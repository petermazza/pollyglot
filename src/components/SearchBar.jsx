import { useState } from 'react'
import { Search, Globe, ChevronDown } from 'lucide-react'
import { languages } from '../data/languageFamilies'
import { cn } from '../lib/utils'

export default function SearchBar({ sourceLang, onSourceLangChange, onSearch, disabled }) {
  const [text, setText] = useState('')
  const [selectOpen, setSelectOpen] = useState(false)

  const sortedLangs = [...languages].sort((a, b) => a.name.localeCompare(b.name))
  const currentLang = languages.find((l) => l.code === sourceLang)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim() && !disabled) {
      onSearch(text.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
      {/* Source language dropdown */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setSelectOpen(!selectOpen)}
          className="flex items-center gap-2 px-4 h-12 rounded-lg border border-border bg-card text-sm font-medium hover:bg-accent transition-colors min-w-[160px] justify-between"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span>{currentLang ? currentLang.name : 'Select'}</span>
          </span>
          <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', selectOpen && 'rotate-180')} />
        </button>

        {selectOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setSelectOpen(false)} />
            <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg scrollbar-thin">
              {sortedLangs.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    onSourceLangChange(lang.code)
                    setSelectOpen(false)
                  }}
                  className={cn(
                    'flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-accent transition-colors text-left',
                    lang.code === sourceLang && 'bg-accent font-medium',
                  )}
                >
                  <span>{lang.name}</span>
                  <span className="text-muted-foreground text-xs">{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Text input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a word or short phrase..."
          className="w-full h-12 pl-11 pr-4 rounded-lg border border-border bg-card text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          autoFocus
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="h-12 px-6 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
      >
        Translate
      </button>
    </form>
  )
}
