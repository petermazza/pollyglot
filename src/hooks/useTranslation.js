// Hook: useTranslation
// Orchestrates search → fetch → progressive reveal state
import { useState, useCallback, useRef } from 'react'
import { translateWord } from '../lib/translate'
import { getLanguagesByFamily } from '../data/languageFamilies'

// State per translation item: 'idle' | 'loading' | 'done' | 'error'
export function useTranslation() {
  const [results, setResults] = useState(null) // { familyName: { langCode: { state, translated, error } } }
  const [isSearching, setIsSearching] = useState(false)
  const requestIdRef = useRef(0)

  const search = useCallback(async (sourceLang, text, selectedFamilies) => {
    if (!text.trim() || selectedFamilies.length === 0) return

    const reqId = ++requestIdRef.current
    setIsSearching(true)

    // Build initial results structure with all items in 'loading' state
    const initialResults = {}
    const allLangs = []
    for (const familyName of selectedFamilies) {
      const langs = getLanguagesByFamily(familyName)
      initialResults[familyName] = {}
      for (const lang of langs) {
        // Skip translating to the same language as source
        if (lang.code === sourceLang) {
          initialResults[familyName][lang.code] = {
            state: 'done',
            translated: text,
            isSource: true,
          }
          continue
        }
        initialResults[familyName][lang.code] = { state: 'loading' }
        allLangs.push({ familyName, lang })
      }
    }

    setResults(initialResults)

    // Fetch translations concurrently (the proxy handles throttling)
    const promises = allLangs.map(async ({ familyName, lang }) => {
      const result = await translateWord(sourceLang, lang.code, text)

      // Ignore if a newer search has started
      if (reqId !== requestIdRef.current) return

      setResults((prev) => {
        if (!prev || !prev[familyName]) return prev
        return {
          ...prev,
          [familyName]: {
            ...prev[familyName],
            [lang.code]:
              result.error
                ? { state: 'error', error: result.error }
                : { state: 'done', translated: result.translated },
          },
        }
      })
    })

    await Promise.allSettled(promises)

    if (reqId === requestIdRef.current) {
      setIsSearching(false)
    }
  }, [])

  const retrySingle = useCallback(
    async (sourceLang, text, familyName, langCode) => {
      setResults((prev) => {
        if (!prev || !prev[familyName]) return prev
        return {
          ...prev,
          [familyName]: {
            ...prev[familyName],
            [langCode]: { state: 'loading' },
          },
        }
      })

      const result = await translateWord(sourceLang, langCode, text)

      setResults((prev) => {
        if (!prev || !prev[familyName]) return prev
        return {
          ...prev,
          [familyName]: {
            ...prev[familyName],
            [langCode]: result.error
              ? { state: 'error', error: result.error }
              : { state: 'done', translated: result.translated },
          },
        }
      })
    },
    [],
  )

  const clear = useCallback(() => {
    setResults(null)
    setIsSearching(false)
  }, [])

  return { results, isSearching, search, retrySingle, clear }
}
