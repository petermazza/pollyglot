import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Copy, Check, RotateCw, AlertCircle } from 'lucide-react'
import { romanize } from '../lib/romanize'
import { speak, stopSpeaking, hasVoice, isSpeechSupported } from '../lib/speech'
import { cn } from '../lib/utils'

export default function TranslationItem({ lang, result, onRetry }) {
  const [copied, setCopied] = useState(false)
  const [voiceAvailable, setVoiceAvailable] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    // Check voice availability (voices may load async)
    const check = () => setVoiceAvailable(isSpeechSupported() && hasVoice(lang.code))
    check()
    if (isSpeechSupported()) {
      const timer = setTimeout(check, 500) // re-check after voices load
      return () => clearTimeout(timer)
    }
  }, [lang.code])

  // Stop speaking if component unmounts
  useEffect(() => {
    return () => {
      if (isSpeaking) stopSpeaking()
    }
  }, [isSpeaking])

  const handleCopy = async () => {
    if (result.state !== 'done' || result.isSource) return
    try {
      await navigator.clipboard.writeText(result.translated)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  const handleSpeak = () => {
    if (result.state !== 'done' || result.isSource) return
    if (isSpeaking) {
      stopSpeaking()
      setIsSpeaking(false)
      return
    }
    setIsSpeaking(true)
    speak(result.translated, lang.code)
    // Reset speaking state after a delay based on text length
    const duration = Math.max(1500, result.translated.length * 120)
    setTimeout(() => setIsSpeaking(false), duration)
  }

  // Loading skeleton
  if (result.state === 'loading') {
    return (
      <div className="rounded-lg border border-border bg-background p-4 animate-pulse-soft">
        <div className="flex items-center justify-between mb-2">
          <div className="h-3 w-20 bg-muted rounded" />
          <div className="h-3 w-10 bg-muted rounded" />
        </div>
        <div className="h-5 w-full bg-muted rounded mb-1" />
        <div className="h-3 w-2/3 bg-muted/60 rounded" />
      </div>
    )
  }

  // Error state
  if (result.state === 'error') {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-foreground">{lang.name}</span>
          <span className="text-xs text-muted-foreground">{lang.nativeName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">
            {result.error === 'rate_limited' ? 'Rate limited' : result.error === 'unsupported_pair' || result.error === 'no_translation' ? 'Not supported' : 'Failed'}
          </span>
          <button
            onClick={onRetry}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline shrink-0"
          >
            <RotateCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Done state
  const romanized = lang.romanize ? romanize(result.translated, lang.script) : null

  return (
    <div
      className={cn(
        'group rounded-lg border bg-background p-4 transition-all animate-fade-in',
        result.isSource ? 'border-primary/30 bg-primary/5' : 'border-border hover:border-primary/20 hover:shadow-sm',
      )}
      dir={lang.rtl ? 'rtl' : 'ltr'}
    >
      {/* Header: language names */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-foreground">{lang.name}</span>
        <span className="text-xs text-muted-foreground">{lang.nativeName}</span>
      </div>

      {/* Translation text */}
      <p className="text-lg font-medium leading-snug mb-1" style={{ fontFamily: 'system-ui, sans-serif' }}>
        {result.translated}
      </p>

      {/* Romanization */}
      {romanized && (
        <p className="text-sm text-muted-foreground italic mb-2" dir="ltr">
          {romanized}
        </p>
      )}

      {/* Actions */}
      {!result.isSource && (
        <div className="flex items-center gap-1 mt-2">
          {isSpeechSupported() && (
            <button
              onClick={handleSpeak}
              title={voiceAvailable ? 'Play pronunciation' : 'Play (using default voice)'}
              className={cn(
                'flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors',
                isSpeaking
                  ? 'text-primary bg-accent'
                  : 'text-muted-foreground hover:text-primary hover:bg-accent',
              )}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  Audio
                </>
              )}
            </button>
          )}
          <button
            onClick={handleCopy}
            title="Copy translation"
            className="flex items-center gap-1 text-xs px-2 py-1 rounded text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
      )}

      {result.isSource && (
        <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-2">
          Source
        </span>
      )}
    </div>
  )
}
