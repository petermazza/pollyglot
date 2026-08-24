import { useState } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { getFamilyByName } from '../data/languageFamilies'
import { cn } from '../lib/utils'
import TranslationItem from './TranslationItem'

export default function FamilyCard({
  familyName,
  familyResults,
  sourceLang,
  searchText,
  onRetry,
  defaultOpen = true,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const family = getFamilyByName(familyName)
  if (!family) return null

  // Count progress
  const entries = familyResults ? Object.entries(familyResults) : []
  const done = entries.filter(([, v]) => v.state === 'done').length
  const total = entries.length
  const loading = entries.some(([, v]) => v.state === 'loading')
  const hasErrors = entries.some(([, v]) => v.state === 'error')

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-5 py-4 hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            className={cn(
              'w-5 h-5 text-muted-foreground transition-transform shrink-0',
              !isOpen && '-rotate-90',
            )}
          />
          <div className="text-left">
            <h3 className="font-semibold text-base">{familyName}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {family.subfamilies.length} sub-families · {total} languages
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 shrink-0">
          {loading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
          {hasErrors && !loading && (
            <span className="text-xs font-medium text-destructive">{entries.filter(([, v]) => v.state === 'error').length} failed</span>
          )}
          <span
            className={cn(
              'text-xs tabular-nums font-medium px-2 py-1 rounded-full',
              done === total && total > 0
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {done}/{total}
          </span>
        </div>
      </button>

      {/* Body */}
      {isOpen && (
        <div className="border-t border-border px-5 py-4 space-y-6 animate-slide-down">
          {family.subfamilies.map((subfamily) => (
            <div key={subfamily.name}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {subfamily.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {subfamily.languages.map((lang) => {
                  const result = familyResults?.[lang.code] || { state: 'loading' }
                  return (
                    <TranslationItem
                      key={lang.code}
                      lang={lang}
                      result={result}
                      onRetry={() => onRetry(sourceLang, searchText, familyName, lang.code)}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
