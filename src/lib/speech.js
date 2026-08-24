// TTS wrapper around the Web Speech API (speechSynthesis)
// Free, built-in, no API key needed

let voices = []

// Map our language codes to likely browser voice lang prefixes
const VOICE_CODE_MAP = {
  zh: 'zh',
  nb: 'no',
  tl: 'tl',
  ms: 'ms',
  fa: 'fa',
  ku: 'ku',
  ps: 'ps',
  ur: 'ur',
  az: 'az',
  kk: 'kk',
  uz: 'uz',
  hy: 'hy',
  ka: 'ka',
  my: 'my',
  bo: 'bo',
  km: 'km',
  lo: 'lo',
  th: 'th',
  bn: 'bn',
  gu: 'gu',
  pa: 'pa',
  ta: 'ta',
  te: 'te',
  kn: 'kn',
  yi: 'yi',
}

function getVoicePrefix(code) {
  return VOICE_CODE_MAP[code] || code
}

function loadVoices() {
  voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices()
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
}

export function hasVoice(langCode) {
  if (!window.speechSynthesis) return false
  if (voices.length === 0) loadVoices()
  const prefix = getVoicePrefix(langCode).toLowerCase()
  return voices.some((v) => v.lang.toLowerCase().startsWith(prefix))
}

export function speak(text, langCode) {
  if (!window.speechSynthesis) return

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = langCode
  utterance.rate = 0.9 // slightly slower for clarity

  // Try to find a matching voice
  if (voices.length === 0) loadVoices()
  const prefix = getVoicePrefix(langCode).toLowerCase()
  const voice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix))
  if (voice) {
    utterance.voice = voice
  }

  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel()
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}
