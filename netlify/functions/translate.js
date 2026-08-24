// Netlify Function: optional translate proxy for MyMemory
// The app calls MyMemory directly from the browser (CORS-enabled, no key needed).
// This optional proxy adds server-side caching to reduce API calls in production.
// To use it, set VITE_USE_PROXY=true in your env and the app will route through /api/translate.

const cache = new Map()
const API_URL = 'https://api.mymemory.translated.net/get'

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
    const res = await fetch(`${API_URL}?${params}`)
    const data = await res.json()

    if (data.responseStatus === 429 || data.responseStatus === 403) {
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'rate_limited' }) }
    }

    if (data.responseStatus && data.responseStatus !== 200) {
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'api_error', message: data.responseDetails }) }
    }

    const translated = data.responseData?.translatedText
    if (!translated || translated.includes('MYMEMORY WARNING') || translated.includes('PLEASE SELECT')) {
      return { statusCode: 200, headers, body: JSON.stringify({ error: 'no_translation' }) }
    }

    cache.set(cacheKey, translated)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ translated, cached: false }),
    }
  } catch (e) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ error: 'network_error', message: e.message }),
    }
  }
}

export default handler
