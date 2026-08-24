// Romanization dispatcher — picks the right strategy per script
import { pinyin } from 'pinyin-pro'
import { slugify } from 'transliteration'

export function romanize(text, script) {
  if (!text) return null

  // Latin scripts don't need romanization
  if (script === 'Latin') return null

  // Chinese: high-quality pinyin with tone marks
  if (script === 'Han') {
    return pinyin(text, { toneType: 'symbol', type: 'array' }).join(' ')
  }

  // All other non-Latin scripts: generic transliteration fallback
  // Handles Cyrillic, Arabic, Devanagari, Greek, Hangul, Kana,
  // Bengali, Gujarati, Gurmukhi, Telugu, Kannada, Khmer, Thai,
  // Lao, Burmese, Tibetan, Georgian, Armenian, etc.
  return slugify(text, { lowercase: false, separator: ' ' })
}
