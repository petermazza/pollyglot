// localStorage search history — last ~10 searches

const HISTORY_KEY = 'pollyglot:history'
const MAX_ITEMS = 10

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function addToHistory(entry) {
  // entry: { text, sourceLang, families }
  const history = getHistory()

  // Remove duplicates (same text + sourceLang)
  const filtered = history.filter(
    (h) => !(h.text === entry.text && h.sourceLang === entry.sourceLang),
  )

  // Add to front
  filtered.unshift(entry)

  // Trim to max
  const trimmed = filtered.slice(0, MAX_ITEMS)

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed))
  } catch {
    // ignore
  }

  return trimmed
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch {
    // ignore
  }
}
