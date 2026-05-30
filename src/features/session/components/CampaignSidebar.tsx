import { useState } from 'react'
import type { Campaign } from '@/types'

interface CampaignSidebarProps {
  campaigns: Campaign[]
  activeId: number | null
  sessionCounts: Record<number, number>
  onSelect: (id: number) => void
  onCreate: (name: string) => void
  onRename: (id: number, name: string) => void
  onDelete: (id: number) => void
}

export function CampaignSidebar({
  campaigns,
  activeId,
  sessionCounts,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: CampaignSidebarProps) {
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    onCreate(newName.trim())
    setNewName('')
  }

  function startRename(campaign: Campaign) {
    if (campaign.id == null) return
    setEditingId(campaign.id)
    setEditName(campaign.name)
  }

  function commitRename(id: number) {
    if (editName.trim()) onRename(id, editName.trim())
    setEditingId(null)
  }

  return (
    <aside className="flex flex-col rounded-xl border border-table-700 bg-table-900/40">
      <div className="border-b border-table-700 px-4 py-3">
        <h2 className="font-display text-lg text-table-100">Campaigns</h2>
        <p className="text-xs text-table-500">One world, many sessions</p>
      </div>

      <form onSubmit={handleCreate} className="border-b border-table-700 p-3">
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New campaign…"
            className="min-w-0 flex-1 rounded-lg border border-table-600 bg-table-800 px-3 py-2 text-sm text-table-100 placeholder:text-table-500 focus:border-gold-500/50 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-gold-500/20 px-3 py-2 text-sm text-gold-300 hover:bg-gold-500/30"
          >
            +
          </button>
        </div>
      </form>

      <ul className="flex-1 overflow-y-auto p-2">
        {campaigns.length === 0 ? (
          <li className="px-2 py-4 text-center text-xs text-table-500">
            Create your first campaign
          </li>
        ) : (
          campaigns.map((campaign) => {
            if (campaign.id == null) return null
            const active = campaign.id === activeId
            return (
              <li key={campaign.id} className="group mb-1">
                {editingId === campaign.id ? (
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => commitRename(campaign.id!)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename(campaign.id!)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    className="w-full rounded-lg border border-gold-500/40 bg-table-800 px-3 py-2 text-sm text-table-100 focus:outline-none"
                  />
                ) : (
                  <div
                    className={`flex items-center gap-1 rounded-lg ${
                      active ? 'bg-gold-500/15' : 'hover:bg-table-800'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(campaign.id!)}
                      className={`min-w-0 flex-1 px-3 py-2.5 text-left text-sm ${
                        active ? 'text-gold-300' : 'text-table-200'
                      }`}
                    >
                      <span className="block truncate font-medium">{campaign.name}</span>
                      <span className="text-xs text-table-500">
                        {sessionCounts[campaign.id] ?? 0} sessions
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => startRename(campaign)}
                      className="px-2 py-2 text-xs text-table-500 opacity-0 hover:text-table-300 group-hover:opacity-100"
                      title="Rename"
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          confirm(
                            `Delete "${campaign.name}" and all its sessions?`,
                          )
                        ) {
                          onDelete(campaign.id!)
                        }
                      }}
                      className="px-2 py-2 text-xs text-table-500 opacity-0 hover:text-blood-400 group-hover:opacity-100"
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                )}
              </li>
            )
          })
        )}
      </ul>
    </aside>
  )
}
