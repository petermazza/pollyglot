// Pollyglot's test suite — runs on Node's built-in runner (node --test),
// no extra dependencies. Covers the language data, the history store, the
// client translation path, and the deployed proxy function.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, beforeEach } from 'node:test'

import {
  families,
  getFamilyByName,
  getLanguageByCode,
  languages,
} from '../src/data/languageFamilies.js'
import { addToHistory, clearHistory, getHistory } from '../src/lib/history.js'
import { translateWord } from '../src/lib/translate.js'
import { handler } from '../netlify/functions/translate.js'

// ---------- shared fakes -----------------------------------------------------

function fakeStorage({ throws = false } = {}) {
  const map = new Map()
  return {
    get length() {
      return map.size
    },
    key: (i) => [...map.keys()][i] ?? null,
    getItem: (k) => {
      if (throws) throw new Error('denied')
      return map.get(k) ?? null
    },
    setItem: (k, v) => {
      if (throws) throw new Error('denied')
      map.set(k, String(v))
    },
    removeItem: (k) => map.delete(k),
    clear: () => map.clear(),
  }
}

const post = (body, headers = {}) =>
  handler({ httpMethod: 'POST', headers, body: JSON.stringify(body) })

beforeEach((t) => {
  globalThis.localStorage = fakeStorage()
  // Default fetch stub — individual tests override via t.mock or reassignment.
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        responseStatus: 200,
        responseData: { translatedText: 'hola' },
      }),
    )
})

// ---------- language data ----------------------------------------------------

describe('language data', () => {
  it('has a healthy catalog of unique codes', () => {
    const codes = languages.map((l) => l.code)
    assert.equal(new Set(codes).size, codes.length, 'duplicate language code')
    assert.ok(languages.length >= 70, `only ${languages.length} languages`)
  })

  it('every language belongs to a family that lists it back', () => {
    for (const lang of languages) {
      const fam = getFamilyByName(lang.family)
      assert.ok(fam, `${lang.code}: unknown family "${lang.family}"`)
      const listed = fam.subfamilies
        .flatMap((s) => s.languages)
        .some((l) => l.code === lang.code)
      assert.ok(listed, `${lang.code} missing from family ${lang.family}`)
    }
    assert.equal(
      families.reduce((n, f) => n + f.languageCount, 0),
      languages.length,
    )
  })

  it('every language declares script and direction', () => {
    for (const lang of languages) {
      assert.ok(lang.script, `${lang.code} missing script`)
      assert.equal(typeof lang.rtl, 'boolean', `${lang.code} missing rtl flag`)
      assert.ok(lang.nativeName, `${lang.code} missing nativeName`)
    }
  })

  it('right-to-left languages are marked rtl, and only them', () => {
    const rtlCodes = languages.filter((l) => l.rtl).map((l) => l.code).sort()
    for (const code of ['ar', 'he', 'fa', 'ur', 'ps', 'yi']) {
      assert.ok(rtlCodes.includes(code), `${code} should be rtl`)
    }
    assert.deepEqual(rtlCodes, ['ar', 'fa', 'he', 'ps', 'ur', 'yi'])
  })

  it('Kurdish renders left-to-right in the Latin script', () => {
    const ku = getLanguageByCode('ku')
    assert.equal(ku.rtl, false)
    assert.equal(ku.script, 'Latin')
  })
})

// ---------- history ----------------------------------------------------------

describe('search history', () => {
  const entry = { text: 'hello', sourceLang: 'en', families: ['Germanic'] }

  it('drops malformed saved entries instead of crashing', () => {
    localStorage.setItem(
      'pollyglot:history',
      JSON.stringify([entry, null, { text: 42 }, 'junk', { text: 'ok', sourceLang: 'en', families: [] }]),
    )
    const h = getHistory()
    assert.equal(h.length, 2)
    assert.equal(h[0].text, 'hello')
    assert.equal(h[1].text, 'ok')
  })

  it('returns empty on corrupt JSON and on denied storage', () => {
    localStorage.setItem('pollyglot:history', '{nope')
    assert.deepEqual(getHistory(), [])
    globalThis.localStorage = fakeStorage({ throws: true })
    assert.deepEqual(getHistory(), [])
  })

  it('dedupes the same text+language and caps at 10 entries', () => {
    addToHistory(entry)
    addToHistory(entry)
    assert.equal(getHistory().length, 1)
    for (let i = 0; i < 15; i++) addToHistory({ ...entry, text: `w${i}` })
    const h = getHistory()
    assert.equal(h.length, 10)
    assert.equal(h[0].text, 'w14') // newest first
  })

  it('clearHistory empties the list and a full store does not throw', () => {
    addToHistory(entry)
    clearHistory()
    assert.deepEqual(getHistory(), [])
    globalThis.localStorage = fakeStorage({ throws: true })
    addToHistory(entry) // must not throw
  })
})

// ---------- client translation ----------------------------------------------

describe('translateWord', () => {
  it('returns the upstream translation and caches it', async () => {
    const r = await translateWord('en', 'es', 'hello')
    assert.equal(r.translated, 'hola')
    let fetched = 0
    globalThis.fetch = async () => {
      fetched++
      return new Response('{}')
    }
    const again = await translateWord('en', 'es', 'hello')
    assert.equal(again.translated, 'hola')
    assert.equal(again.cached, true)
    assert.equal(fetched, 0, 'second call should hit the cache')
  })

  it('reports rate limiting and non-200 upstream replies', async () => {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ responseStatus: 429 }))
    assert.equal((await translateWord('en', 'es', 'x1')).error, 'rate_limited')
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ responseStatus: 500, responseDetails: 'boom' }))
    assert.equal((await translateWord('en', 'es', 'x2')).error, 'api_error')
    globalThis.fetch = async () => new Response('down', { status: 503 })
    assert.equal((await translateWord('en', 'es', 'x3')).error, 'network_error')
  })

  it('survives denied storage and a dead network', async () => {
    globalThis.localStorage = fakeStorage({ throws: true })
    const ok = await translateWord('en', 'es', 'bonjour')
    assert.equal(ok.translated, 'hola')
    globalThis.fetch = async () => {
      throw new Error('offline')
    }
    assert.equal((await translateWord('en', 'es', 'x4')).error, 'network_error')
  })
})

// ---------- deployed proxy function ------------------------------------------

describe('netlify translate proxy', () => {
  it('answers OPTIONS and rejects non-POST', async () => {
    const opt = await handler({ httpMethod: 'OPTIONS', headers: {} })
    assert.equal(opt.statusCode, 204)
    assert.equal((await handler({ httpMethod: 'GET', headers: {} })).statusCode, 405)
  })

  it('rejects malformed and oversized input', async () => {
    const badJson = await handler({ httpMethod: 'POST', headers: {}, body: '{bad' })
    assert.equal(badJson.statusCode, 400)
    assert.equal((await post({ source: 'en', target: 'es' })).statusCode, 400)
    assert.equal(
      (await post({ source: 'en', target: 'es', text: 'x'.repeat(501) })).statusCode,
      400,
    )
    assert.equal((await post({ target: 'es', text: 'hi' })).statusCode, 400)
  })

  it('translates, caches, and reports upstream failures honestly', async () => {
    const ok = await post({ source: 'en', target: 'es', text: 'hello' })
    assert.equal(ok.statusCode, 200)
    assert.equal(JSON.parse(ok.body).translated, 'hola')

    globalThis.fetch = async () => {
      throw new Error('offline')
    }
    const cached = await post({ source: 'en', target: 'es', text: 'hello' })
    assert.equal(JSON.parse(cached.body).cached, true)
    const miss = await post({ source: 'en', target: 'fr', text: 'never-cached' })
    assert.equal(miss.statusCode, 502)
  })

  it('rate limits after 60 requests per caller per minute', async () => {
    const headers = { 'x-nf-client-connection-ip': '1.2.3.4' }
    let last = 0
    for (let i = 0; i < 61; i++) {
      last = (await post({ source: 'en', target: 'es', text: `rl-${i}` }, headers)).statusCode
    }
    assert.equal(last, 429)
    // A different caller is unaffected.
    const other = await post(
      { source: 'en', target: 'es', text: 'rl-other' },
      { 'x-nf-client-connection-ip': '5.6.7.8' },
    )
    assert.equal(other.statusCode, 200)
  })
})

// ---------- shipped copy -----------------------------------------------------

describe('attribution', () => {
  it('the Powered-by link points at MyMemory, not the repo', () => {
    const app = readFileSync(join(import.meta.dirname, '..', 'src', 'App.jsx'), 'utf8')
    const m = /href="([^"]+)"[^>]*>[^<]*Powered by MyMemory|Powered by MyMemory/.exec(app)
    assert.ok(m, 'Powered by MyMemory link missing')
    assert.ok(app.includes('href="https://mymemory.translated.net"'))
  })
})
