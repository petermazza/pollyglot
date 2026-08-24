import { useState, useEffect, useCallback } from 'react'
import { Languages, Sparkles } from 'lucide-react'
import SearchBar from './components/SearchBar'
import FamilySelector from './components/FamilySelector'
import FamilyCard from './components/FamilyCard'
import HistoryBar from './components/HistoryBar'
import { useTranslation } from './hooks/useTranslation'
import { families } from './data/languageFamilies'
import { getHistory, addToHistory, clearHistory } from './lib/history'

export default function App() {
  const [sourceLang, setSourceLang] = useState('en')
  const [selectedFamilies, setSelectedFamilies] = useState(['Indo-European'])
  const [searchText, setSearchText] = useState('')
  const [history, setHistory] = useState([])

  const { results, isSearching, search, retrySingle, clear } = useTranslation()

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const handleToggleFamily = useCallback((familyName) => {
    setSelectedFamilies((prev) =>
      prev.includes(familyName)
        ? prev.filter((f) => f !== familyName)
        : [...prev, familyName],
    )
  }, [])

  const handleToggleAll = useCallback(() => {
    setSelectedFamilies((prev) =>
      prev.length === families.length ? [] : families.map((f) => f.name),
    )
  }, [])

  const handleClear = useCallback(() => {
    setSelectedFamilies([])
  }, [])

  const handleSearch = useCallback(
    (text) => {
      setSearchText(text)
      search(sourceLang, text, selectedFamilies)
      const updated = addToHistory({
        text,
        sourceLang,
        families: [...selectedFamilies],
      })
      setHistory(updated)
    },
    [sourceLang, selectedFamilies, search],
  )

  const handleReRun = useCallback(
    (entry) => {
      setSourceLang(entry.sourceLang)
      setSelectedFamilies(entry.families)
      setSearchText(entry.text)
      search(entry.sourceLang, entry.text, entry.families)
    },
    [search],
  )

  const handleClearHistory = useCallback(() => {
    clearHistory()
    setHistory([])
  }, [])

  const handleRetry = useCallback(
    (srcLang, text, familyName, langCode) => {
      retrySingle(srcLang, text, familyName, langCode)
    },
    [retrySingle],
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/30">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Languages className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Pollyglot</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Language Family Translator</p>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Powered by MyMemory
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Search section */}
        <section className="space-y-5">
          <SearchBar
            sourceLang={sourceLang}
            onSourceLangChange={setSourceLang}
            onSearch={handleSearch}
            disabled={selectedFamilies.length === 0}
          />

          <FamilySelector
            selected={selectedFamilies}
            onToggle={handleToggleFamily}
            onToggleAll={handleToggleAll}
            onClear={handleClear}
          />

          {history.length > 0 && (
            <HistoryBar
              history={history}
              onReRun={handleReRun}
              onClear={handleClearHistory}
            />
          )}
        </section>

        {/* Results section */}
        {results && Object.keys(results).length > 0 ? (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>
                Translating <span className="font-semibold text-foreground">"{searchText}"</span> into{' '}
                {selectedFamilies.length} {selectedFamilies.length === 1 ? 'family' : 'families'}
                {isSearching && <span className="text-primary"> · loading...</span>}
              </span>
            </div>

            {selectedFamilies.map((familyName, idx) => (
              <FamilyCard
                key={familyName}
                familyName={familyName}
                familyResults={results[familyName]}
                sourceLang={sourceLang}
                searchText={searchText}
                onRetry={handleRetry}
                defaultOpen={idx === 0}
              />
            ))}
          </section>
        ) : (
          <section className="text-center py-16 space-y-3">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto">
              <Languages className="w-8 h-8 text-primary/60" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Ready to explore</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                Select one or more language families above, type a word, and hit Translate to see it revealed across languages.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          Pollyglot · Translations by MyMemory · Romanization via pinyin-pro & transliteration
        </div>
      </footer>
    </div>
  )
}
