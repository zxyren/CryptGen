'use client'

import { useCallback, useEffect, useState } from 'react'
import { Check, Copy, History, Trash2, X } from 'lucide-react'

export type HistoryEntry = {
  id: number
  password: string
}

type Props = {
  open: boolean
  onCloseAction: () => void
  history: HistoryEntry[]
  currentId: number | null
  onSelectAction: (id: number) => void
  onClearAction: () => void
}

export function HistoryModal({
  open,
  onCloseAction,
  history,
  currentId,
  onSelectAction,
  onClearAction,
}: Props) {
  const [copiedId, setCopiedId] = useState<number | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseAction()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onCloseAction])

  const handleCopy = useCallback(async (entry: HistoryEntry) => {
    try {
      await navigator.clipboard.writeText(entry.password)
      setCopiedId(entry.id)
      window.setTimeout(() => setCopiedId(null), 1400)
    } catch {
      // Clipboard unavailable — ignore.
    }
  }, [])

  if (!open) return null

  // Newest first.
  const ordered = [...history].reverse()

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Password history"
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close history"
        onClick={onCloseAction}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm animate-fade-up"
      />

      {/* Panel */}
      <div className="animate-fade-up relative z-10 flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-surface sm:max-h-[80vh] sm:max-w-lg sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <History size={18} className="text-accent" />
            <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              History
            </h2>
            <span className="font-mono tabular-nums text-muted-foreground">
              {history.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearAction}
                aria-label="Clear history"
                title="Clear history"
                className="flex cursor-pointer p-2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              type="button"
              onClick={onCloseAction}
              aria-label="Close"
              className="flex cursor-pointer p-2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        {ordered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">No passwords yet.</p>
            <p className="text-xs text-muted-foreground">
              Generated passwords will appear here.
            </p>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-border overflow-y-auto">
            {ordered.map((entry) => {
              const isCurrent = entry.id === currentId
              const isCopied = entry.id === copiedId
              return (
                <li key={entry.id}>
                  <div className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/5 sm:px-6">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectAction(entry.id)
                        onCloseAction()
                      }}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${isCurrent ? 'bg-accent' : 'bg-transparent'
                          }`}
                        aria-hidden
                      />
                      <span className="truncate font-mono text-sm text-foreground">
                        {entry.password}
                      </span>
                    </button>
                    {isCurrent && (
                      <span className="hidden shrink-0 text-sm font-medium text-accent sm:inline">
                        Current
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCopy(entry)}
                      aria-label="Copy password"
                      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                    >
                      <span className="relative flex size-4 items-center justify-center">
                        <Copy
                          className={`absolute size-4 transition-all duration-200 ${isCopied ? 'scale-50 opacity-0' : 'scale-100 opacity-100'
                            }`}
                        />
                        <Check
                          className={`absolute size-4 text-accent transition-all duration-200 ${isCopied ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                            }`}
                          strokeWidth={3}
                        />
                      </span>
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
