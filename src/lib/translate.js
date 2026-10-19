// Client-side translation via MyMemory API
// Free, no API key, CORS-enabled — calls directly from the browser
// https://mymemory.translated.net/doc/spec.php

const CACHE_PREFIX = 'pollyglot:cache:'
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours
const MAX_CACHE_ENTRIES = 400
const API_URL = 'https://api.mymemory.translated.net/get'

// Map internal language codes to MyMemory-compatible codes where they differ
const CODE_MAP = {
  zh: 'zh-CN',
  nb: 'no',
}

function toMyMemoryCode(code) {
  return CODE_MAP[code] || code
}

function getCacheKey(source, target, text) {
  return `${CACHE_PREFIX}${source}:${target}:${text.trim().toLowerCase()}`
}

function getCachedTranslation(source, target, text) {
  const key = getCacheKey(source, target, text)
  let raw
  try {
    raw = localStorage.getItem(key)
  } catch {
    return null // storage blocked — treat as a cache miss
  }
  if (!raw) return null
  try {
    const { value, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key)
      return null
    }
    return value
  } catch {
    return null
  }
}

// Drop the oldest cache entries when the store grows past the cap so a
// long session can't fill localStorage unboundedly.
function pruneCache() {
  try {
    const entries = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (!k || !k.startsWith(CACHE_PREFIX)) continue
      let timestamp = 0
      try {
        timestamp = JSON.parse(localStorage.getItem(k))?.timestamp ?? 0
      } catch {
        // unreadable entry — still a prune candidate
      }
      entries.push([k, timestamp])
    }
    if (entries.length < MAX_CACHE_ENTRIES) return
    entries.sort((a, b) => a[1] - b[1])
    for (const [k] of entries.slice(0, entries.length - MAX_CACHE_ENTRIES + 1)) {
      localStorage.removeItem(k)
    }
  } catch {
    // storage blocked — nothing to prune
  }
}

function setCachedTranslation(source, target, text, value) {
  const key = getCacheKey(source, target, text)
  try {
    pruneCache()
    localStorage.setItem(key, JSON.stringify({ value, timestamp: Date.now() }))
  } catch {
    // localStorage might be full; silently ignore
  }
}

export async function translateWord(source, target, text) {
  // Check client cache first
  const cached = getCachedTranslation(source, target, text)
  if (cached !== null) {
    return { translated: cached, cached: true }
  }

  const src = toMyMemoryCode(source)
  const tgt = toMyMemoryCode(target)
  const params = new URLSearchParams({
    q: text.trim(),
    langpair: `${src}|${tgt}`,
  })

  // Optional: add email for higher rate limit (50K chars/day vs 5K anonymous)
  const email = import.meta.env?.VITE_MYMEMORY_EMAIL
  if (email) params.set('de', email)

  try {
    const res = await fetch(`${API_URL}?${params}`, { signal: AbortSignal.timeout(15000) })

    if (!res.ok) {
      return { error: 'network_error', status: res.status }
    }

    const data = await res.json()

    // MyMemory returns responseStatus in the body
    if (data.responseStatus === 429 || data.responseStatus === 403) {
      return { error: 'rate_limited' }
    }

    if (data.responseStatus && data.responseStatus !== 200) {
      const details = data.responseDetails || ''
      if (details.includes('SELECT TWO DISTINCT')) {
        return { error: 'unsupported_pair' }
      }
      return { error: 'api_error', message: details }
    }

    const translated = data.responseData?.translatedText
    if (!translated || translated === '') {
      // Fallback: check matches array for a valid translation
      // MyMemory sometimes returns empty translatedText but has valid matches
      const matches = data.matches || []
      const fallback = matches.find(
        (m) => m.translation && m.translation.trim() !== '' && !m.translation.includes('MYMEMORY WARNING'),
      )
      if (fallback) {
        setCachedTranslation(source, target, text, fallback.translation)
        return { translated: fallback.translation, cached: false }
      }
      return { error: 'no_translation' }
    }

    // MyMemory sometimes returns warnings in the translated text
    // (e.g., "PLEASE SELECT TWO DISTINCT LANGUAGES" or quota messages)
    if (translated.includes('PLEASE SELECT') || translated.includes('MYMEMORY WARNING')) {
      if (translated.includes('DAILY LIMIT') || translated.includes('quota')) {
        return { error: 'rate_limited' }
      }
      return { error: 'api_error', message: translated }
    }

    // Store in client cache
    setCachedTranslation(source, target, text, translated)

    return { translated, cached: false }
  } catch (e) {
    return {
      error: 'network_error',
      message: e?.name === 'TimeoutError' ? 'request timed out' : e.message,
    }
  }
}
