import { useRef } from 'react'
import type { BattleMapRecord } from '@/types/map'

interface MapSidebarProps {
  maps: BattleMapRecord[]
  activeId: number | null
  onSelect: (id: number) => void
  onUpload: (file: File) => void
  onDelete: (id: number) => void
  onRename: (id: number, name: string) => void
}

export function MapSidebar({
  maps,
  activeId,
  onSelect,
  onUpload,
  onDelete,
  onRename,
}: MapSidebarProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <aside className="flex flex-col gap-4 rounded-xl border border-table-700 bg-table-900/40 p-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-table-400">Maps</h2>
        <p className="mt-1 text-xs text-table-500">Upload PNG, JPG, or WebP (max 15 MB)</p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onUpload(file)
          e.target.value = ''
        }}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="w-full rounded-lg bg-gold-500 px-3 py-2 text-sm font-medium text-table-950 hover:bg-gold-400"
      >
        Upload map
      </button>

      <ul className="flex max-h-[420px] flex-col gap-1 overflow-y-auto">
        {maps.length === 0 ? (
          <li className="rounded-lg border border-dashed border-table-700 px-3 py-6 text-center text-sm text-table-500">
            No maps yet
          </li>
        ) : (
          maps.map((map) => (
            <li key={map.id}>
              <div
                className={`group flex items-center gap-2 rounded-lg px-2 py-2 ${
                  map.id === activeId ? 'bg-gold-500/15 ring-1 ring-gold-500/40' : 'hover:bg-table-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => map.id != null && onSelect(map.id)}
                  className="min-w-0 flex-1 truncate text-left text-sm text-table-200"
                >
                  {map.name}
                </button>
                <button
                  type="button"
                  title="Rename"
                  onClick={() => {
                    const next = window.prompt('Map name', map.name)
                    if (next != null && map.id != null) onRename(map.id, next)
                  }}
                  className="hidden text-xs text-table-500 group-hover:inline hover:text-table-300"
                >
                  ✎
                </button>
                <button
                  type="button"
                  title="Delete"
                  onClick={() => {
                    if (map.id != null && window.confirm(`Delete "${map.name}"?`)) {
                      onDelete(map.id)
                    }
                  }}
                  className="hidden text-xs text-red-400/70 group-hover:inline hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </aside>
  )
}
