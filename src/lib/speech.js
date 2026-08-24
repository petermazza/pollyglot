// TTS wrapper around the Web Speech API (speechSynthesis)
// Free, built-in, no API key needed

let voices = []

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
  return voices.some((v) => v.lang.toLowerCase().startsWith(langCode.toLowerCase()))
}

export function speak(text, langCode) {
  if (!window.speechSynthesis) return

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = langCode

  // Try to find a matching voice
  if (voices.length === 0) loadVoices()
  const voice = voices.find((v) => v.lang.toLowerCase().startsWith(langCode.toLowerCase()))
  if (voice) {
    utterance.voice = voice
  }

  window.speechSynthesis.speak(utterance)
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}
