import { Check } from 'lucide-react'
import { families } from '../data/languageFamilies'
import { cn } from '../lib/utils'

export default function FamilySelector({ selected, onToggle, onToggleAll, onClear }) {
  const allSelected = selected.length === families.length
  const noneSelected = selected.length === 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Language Families
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onToggleAll}
            className="text-xs font-medium text-primary hover:underline"
          >
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
          {!noneSelected && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <button
                onClick={onClear}
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {families.map((family) => {
          const isSelected = selected.includes(family.name)
          return (
            <button
              key={family.name}
              onClick={() => onToggle(family.name)}
              className={cn(
                'group flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-medium transition-all',
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent',
              )}
            >
              {isSelected && <Check className="w-3.5 h-3.5" />}
              <span>{family.name}</span>
              <span
                className={cn(
                  'text-xs tabular-nums rounded-full px-1.5 py-0.5',
                  isSelected
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {family.languageCount}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
