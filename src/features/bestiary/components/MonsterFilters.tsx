interface MonsterFiltersProps {
  search: string
  crFilter: string
  onSearchChange: (value: string) => void
  onCrFilterChange: (value: string) => void
}

export function MonsterFilters({
  search,
  crFilter,
  onSearchChange,
  onCrFilterChange,
}: MonsterFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name…"
        className="flex-1 rounded-lg border border-table-600 bg-table-800 px-4 py-2.5 text-sm text-table-100 placeholder:text-table-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
      />
      <select
        value={crFilter}
        onChange={(e) => onCrFilterChange(e.target.value)}
        className="rounded-lg border border-table-600 bg-table-800 px-4 py-2.5 text-sm text-table-100 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
      >
        <option value="all">All CR</option>
        <option value="0-1">CR 0–1</option>
        <option value="2-4">CR 2–4</option>
        <option value="5-10">CR 5–10</option>
        <option value="11-16">CR 11–16</option>
        <option value="17+">CR 17+</option>
      </select>
    </div>
  )
}
