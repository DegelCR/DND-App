import { useState } from 'react'
import { renderSimpleMarkdown } from '@/lib/markdown-preview'
import {
  PREP_CHECKLIST_ITEMS,
  type CampaignSecret,
  type PrepChecklist,
  type SessionQuickNote,
  type SessionTab,
} from '@/types/session'
import type { Session } from '@/types'

interface SessionWorkspaceProps {
  session: Session | null
  secrets: CampaignSecret[]
  quickNotes: SessionQuickNote[]
  saveState: 'idle' | 'saving' | 'saved'
  onUpdateField: (field: keyof Session, value: string | PrepChecklist) => void
  onUpdateSecret: (secretId: number, patch: Partial<CampaignSecret>) => void
  onAddQuickNote: (text: string) => void
  onDeleteQuickNote: (noteId: number) => void
  normalizePrepChecklist: (value?: PrepChecklist | string) => PrepChecklist
}

const TABS: { id: SessionTab; label: string }[] = [
  { id: 'notes', label: 'Notes' },
  { id: 'recap', label: 'Recap' },
  { id: 'prep', label: 'Prep' },
  { id: 'quick', label: 'Quick notes' },
]

export function SessionWorkspace({
  session,
  secrets,
  quickNotes,
  saveState,
  onUpdateField,
  onUpdateSecret,
  onAddQuickNote,
  onDeleteQuickNote,
  normalizePrepChecklist,
}: SessionWorkspaceProps) {
  const [tab, setTab] = useState<SessionTab>('notes')
  const [previewNotes, setPreviewNotes] = useState(false)
  const [quickDraft, setQuickDraft] = useState('')

  if (!session) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-table-700 bg-table-900/20 p-8 text-center">
        <span className="text-4xl" aria-hidden="true">
          📜
        </span>
        <p className="mt-4 text-table-300">Select or create a session</p>
        <p className="mt-1 text-sm text-table-500">
          Notes, recaps, Lazy DM prep, and live quick notes
        </p>
      </div>
    )
  }

  const checklist = normalizePrepChecklist(session.prepChecklist)

  function toggleChecklist(key: keyof PrepChecklist) {
    onUpdateField('prepChecklist', { ...checklist, [key]: !checklist[key] })
  }

  function handleQuickSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!quickDraft.trim()) return
    onAddQuickNote(quickDraft)
    setQuickDraft('')
  }

  return (
    <div className="flex h-full min-h-[400px] flex-col rounded-xl border border-table-700 bg-table-900/40">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-table-700 px-4 py-3">
        <div className="min-w-0">
          <input
            value={session.title}
            onChange={(e) => onUpdateField('title', e.target.value)}
            className="w-full bg-transparent font-display text-xl text-table-100 focus:outline-none"
          />
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-table-500">
            <label className="flex items-center gap-2">
              Date
              <input
                type="date"
                value={session.date}
                onChange={(e) => onUpdateField('date', e.target.value)}
                className="rounded border border-table-600 bg-table-800 px-2 py-1 text-table-200 focus:outline-none"
              />
            </label>
            <span>
              {saveState === 'saving' && 'Saving…'}
              {saveState === 'saved' && 'Saved'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                tab === t.id
                  ? 'bg-gold-500/20 text-gold-300'
                  : 'text-table-400 hover:bg-table-800 hover:text-table-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'notes' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewNotes((p) => !p)}
                className="text-xs text-table-400 hover:text-gold-300"
              >
                {previewNotes ? 'Edit' : 'Preview'}
              </button>
            </div>
            {previewNotes ? (
              <div
                className="prose-invert min-h-[280px] rounded-lg border border-table-700 bg-table-950/50 p-4 text-sm leading-relaxed text-table-300"
                dangerouslySetInnerHTML={{
                  __html:
                    renderSimpleMarkdown(session.notes) ||
                    '<span class="text-table-500">No notes yet.</span>',
                }}
              />
            ) : (
              <textarea
                value={session.notes}
                onChange={(e) => onUpdateField('notes', e.target.value)}
                placeholder="Session notes… Supports **bold**, *italic*, # headings, - lists"
                className="min-h-[320px] w-full resize-y rounded-lg border border-table-600 bg-table-800 px-4 py-3 text-sm leading-relaxed text-table-100 placeholder:text-table-500 focus:border-gold-500/50 focus:outline-none"
              />
            )}
          </div>
        )}

        {tab === 'recap' && (
          <div className="space-y-2">
            <p className="text-sm text-table-400">
              Post-session summary for players or your future self.
            </p>
            <textarea
              value={session.recap ?? ''}
              onChange={(e) => onUpdateField('recap', e.target.value)}
              placeholder="What happened? Key decisions, cliffhangers, loot…"
              className="min-h-[320px] w-full resize-y rounded-lg border border-table-600 bg-table-800 px-4 py-3 text-sm leading-relaxed text-table-100 placeholder:text-table-500 focus:border-gold-500/50 focus:outline-none"
            />
          </div>
        )}

        {tab === 'prep' && (
          <div className="space-y-6">
            <section>
              <h3 className="font-display text-sm uppercase tracking-wide text-gold-400">
                Strong start
              </h3>
              <textarea
                value={session.strongStart ?? ''}
                onChange={(e) => onUpdateField('strongStart', e.target.value)}
                placeholder="How will you open the session? Hook the table in the first minutes…"
                className="mt-2 min-h-[100px] w-full resize-y rounded-lg border border-table-600 bg-table-800 px-4 py-3 text-sm text-table-100 placeholder:text-table-500 focus:border-gold-500/50 focus:outline-none"
              />
            </section>

            <section>
              <h3 className="font-display text-sm uppercase tracking-wide text-gold-400">
                Prep checklist (Lazy GM)
              </h3>
              <ul className="mt-3 space-y-2">
                {PREP_CHECKLIST_ITEMS.map((item) => (
                  <li key={item.key}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-table-700 bg-table-800/50 px-3 py-2 text-sm text-table-200 hover:bg-table-800">
                      <input
                        type="checkbox"
                        checked={checklist[item.key]}
                        onChange={() => toggleChecklist(item.key)}
                        className="mt-0.5 accent-gold-500"
                      />
                      {item.label}
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="font-display text-sm uppercase tracking-wide text-gold-400">
                Secrets & clues pool
              </h3>
              <p className="mt-1 text-xs text-table-500">
                Campaign-wide (Lazy DM). Ten slots shared across all sessions.
              </p>
              <div className="mt-3 space-y-2">
                {secrets.map((secret) => (
                  <div
                    key={secret.id ?? secret.slot}
                    className="flex items-start gap-2 rounded-lg border border-table-700 bg-table-800/40 p-2"
                  >
                    <span className="mt-2 w-6 shrink-0 text-center text-xs text-table-500">
                      {secret.slot}
                    </span>
                    <input
                      value={secret.text}
                      onChange={(e) =>
                        secret.id != null &&
                        onUpdateSecret(secret.id, { text: e.target.value })
                      }
                      placeholder={`Secret / clue ${secret.slot}…`}
                      className={`min-w-0 flex-1 rounded border border-table-600 bg-table-900 px-3 py-2 text-sm text-table-100 placeholder:text-table-500 focus:border-gold-500/50 focus:outline-none ${
                        secret.revealed ? 'opacity-60 line-through' : ''
                      }`}
                    />
                    <label className="flex shrink-0 items-center gap-1 pt-2 text-xs text-table-400">
                      <input
                        type="checkbox"
                        checked={secret.revealed}
                        onChange={(e) =>
                          secret.id != null &&
                          onUpdateSecret(secret.id, { revealed: e.target.checked })
                        }
                        className="accent-gold-500"
                      />
                      Revealed
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === 'quick' && (
          <div className="space-y-4">
            <p className="text-sm text-table-400">
              Append-only log for live play. Each note gets a timestamp.
            </p>
            <form onSubmit={handleQuickSubmit} className="flex gap-2">
              <input
                value={quickDraft}
                onChange={(e) => setQuickDraft(e.target.value)}
                placeholder="Quick note during session…"
                className="min-w-0 flex-1 rounded-lg border border-table-600 bg-table-800 px-4 py-2.5 text-sm text-table-100 placeholder:text-table-500 focus:border-gold-500/50 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-gold-500/20 px-4 py-2.5 text-sm text-gold-300 hover:bg-gold-500/30"
              >
                Add
              </button>
            </form>
            <ul className="space-y-2">
              {quickNotes.length === 0 ? (
                <li className="text-sm text-table-500">No quick notes yet.</li>
              ) : (
                quickNotes.map((note) => (
                  <li
                    key={note.id}
                    className="group flex items-start gap-3 rounded-lg border border-table-700 bg-table-800/50 px-3 py-2 text-sm"
                  >
                    <time className="shrink-0 font-mono text-xs text-gold-400">
                      {formatTime(note.createdAt)}
                    </time>
                    <span className="min-w-0 flex-1 text-table-200">{note.text}</span>
                    <button
                      type="button"
                      onClick={() => note.id != null && onDeleteQuickNote(note.id)}
                      className="shrink-0 text-xs text-table-500 opacity-0 hover:text-blood-400 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
