import { Link } from 'react-router-dom'
import { Folder } from '@/components/reactbits'

interface MonsterSidebarProps {
  favorites: { index: string; name: string }[]
  recents: { index: string; name: string }[]
}

export function MonsterSidebar({ favorites, recents }: MonsterSidebarProps) {
  const folderMonsters = favorites.length > 0 ? favorites.slice(0, 3) : recents.slice(0, 3)

  return (
    <aside className="space-y-4">
      <div className="rounded-xl border border-table-700 bg-table-900/40 p-4">
        <h3 className="font-display text-sm text-table-100">Monster index</h3>
        <p className="mt-1 text-xs text-table-500">Click folder to browse papers</p>
        <div className="mt-4 flex justify-center py-2">
          <Folder
            color="#c9a227"
            size={1.15}
            aria-label="Monster folder"
            items={folderMonsters.map((m) => (
              <Link
                key={m.index}
                to={`/bestiary/${m.index}`}
                onClick={(e) => e.stopPropagation()}
                className="flex h-full flex-col items-center justify-center p-1 text-center"
              >
                <span className="text-lg" aria-hidden="true">
                  🐉
                </span>
                <span className="mt-0.5 line-clamp-2 text-[8px] leading-tight font-medium text-table-800">
                  {m.name}
                </span>
              </Link>
            ))}
          />
        </div>
        {folderMonsters.length === 0 && (
          <p className="text-center text-xs text-table-500">Open monsters to fill the folder</p>
        )}
      </div>

      <SidebarSection
        title="Favorites"
        empty="No favorites yet."
        items={favorites}
      />
      <SidebarSection
        title="Recently viewed"
        empty="Open a monster to see it here."
        items={recents}
      />
    </aside>
  )
}

function SidebarSection({
  title,
  empty,
  items,
}: {
  title: string
  empty: string
  items: { index: string; name: string }[]
}) {
  return (
    <div className="rounded-xl border border-table-700 bg-table-900/40 p-4">
      <h3 className="font-display text-sm text-table-100">{title}</h3>
      {items.length > 0 ? (
        <ul className="mt-3 space-y-1">
          {items.map((item) => (
            <SidebarLink key={item.index} index={item.index} name={item.name} />
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-table-500">{empty}</p>
      )}
    </div>
  )
}

function SidebarLink({ index, name }: { index: string; name: string }) {
  return (
    <li>
      <Link
        to={`/bestiary/${index}`}
        className="block truncate rounded px-2 py-1.5 text-sm text-table-300 transition-colors hover:bg-table-800 hover:text-gold-300"
      >
        {name}
      </Link>
    </li>
  )
}
