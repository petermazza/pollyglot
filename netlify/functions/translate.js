// Netlify Function: optional translate proxy for MyMemory.
// Deployed and reachable, but the app currently calls MyMemory directly
// from the browser — nothing routes here yet.

const cache = new Map()
const MAX_CACHE_ENTRIES = 1000
const API_URL = 'https://api.mymemory.translated.net/get'
const MAX_TEXT_LENGTH = 500
const RATE_LIMIT = 60 // requests per window per caller
const RATE_WINDOW_MS = 60 * 1000

// Per-caller request counts for the current window. In-memory only — a
// cold-started function instance sees a fresh window.
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const rec = hits.get(ip)
  if (!rec || now - rec.start > RATE_WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 })
    if (hits.size > 10000) hits.clear()
    return false
  }
  rec.count += 1
  return rec.count > RATE_LIMIT
}

function cacheSet(key, value) {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    // Map iterates oldest-first — drop the oldest quarter.
    for (const k of [...cache.keys()].slice(0, MAX_CACHE_ENTRIES / 4)) cache.delete(k)
  }
  cache.set(key, value)
}

const CODE_MAP = {
  zh: 'zh-CN',
  nb: 'no',
}

function toMyMemoryCode(code) {
  return CODE_MAP[code] || code
}

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'method_not_allowed' }),
    }
  }

  const ip = event.headers?.['x-nf-client-connection-ip'] ?? event.headers?.['client-ip'] ?? 'unknown'
  if (rateLimited(ip)) {
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ error: 'rate_limited' }),
    }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'invalid_json' }),
    }
  }

  const { source, target, text } = body

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'empty_text' }),
    }
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'text_too_long' }),
    }
  }
  if (!source || !target) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'missing_language' }),
    }
  }

  const src = toMyMemoryCode(source)
  const tgt = toMyMemoryCode(target)
  const cacheKey = `${src}:${tgt}:${text.trim().toLowerCase()}`

  // Server cache check
  if (cache.has(cacheKey)) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ translated: cache.get(cacheKey), cached: true }),
    }
  }

  // Call MyMemory API
  const params = new URLSearchParams({
    q: text.trim(),
    langpair: `${src}|${tgt}`,
  })

  const email = process.env.MYMEMORY_EMAIL
  if (email) params.set('de', email)

  try {
    const res = await fetch(`${API_URL}?${params}`, { signal: AbortSignal.timeout(15000) })
    const data = await res.json()

    if (data.responseStatus === 429 || data.responseStatus === 403) {
      return { statusCode: 429, headers, body: JSON.stringify({ error: 'rate_limited' }) }
    }

    if (data.responseStatus && data.responseStatus !== 200) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'api_error' }) }
    }

    const translated = data.responseData?.translatedText
    if (!translated || translated.includes('MYMEMORY WARNING') || translated.includes('PLEASE SELECT')) {
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'no_translation' }) }
    }

    cacheSet(cacheKey, translated)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ translated, cached: false }),
    }
  } catch {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: 'network_error' }),
    }
  }
}

export default handler
