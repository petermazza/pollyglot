import { History, X, RotateCw } from 'lucide-react'

export default function HistoryBar({ history, onReRun, onClear }) {
  if (history.length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">
        <History className="w-3.5 h-3.5" />
        Recent
      </div>

      {history.map((entry, i) => (
        <button
          key={i}
          onClick={() => onReRun(entry)}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-sm hover:border-primary/40 hover:bg-accent transition-all"
        >
          <RotateCw className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
          <span className="font-medium">{entry.text}</span>
          <span className="text-xs text-muted-foreground">
            {entry.families.length} {entry.families.length === 1 ? 'family' : 'families'}
          </span>
        </button>
      ))}

      <button
        onClick={onClear}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1"
        title="Clear history"
      >
        <X className="w-3.5 h-3.5" />
        Clear
      </button>
    </div>
  )
}
