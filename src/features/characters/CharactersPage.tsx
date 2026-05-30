import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { defaultCharacter } from '@/lib/character/character'
import type { Character } from '@/lib/character/types'
import { CharacterWizard } from './CharacterWizard'
import { CharacterSidebar } from './components/CharacterSidebar'
import { useCharacters } from './useCharacters'

export function CharactersPage() {
  const { id: idParam } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { characters, loading, saveCharacter, deleteCharacter, getCharacter } = useCharacters()

  const selectedId = idParam === 'new' ? undefined : idParam ? Number(idParam) : undefined
  const isNew = idParam === 'new' || idParam === undefined

  const [initialCharacter, setInitialCharacter] = useState<Character | null>(
    isNew ? defaultCharacter() : null,
  )
  const [loadingCharacter, setLoadingCharacter] = useState(!isNew && !!selectedId)

  useEffect(() => {
    if (isNew) {
      setInitialCharacter(defaultCharacter())
      setLoadingCharacter(false)
      return
    }
    if (!selectedId || Number.isNaN(selectedId)) {
      setInitialCharacter(null)
      setLoadingCharacter(false)
      return
    }

    let cancelled = false
    setLoadingCharacter(true)
    getCharacter(selectedId).then((data) => {
      if (!cancelled) {
        setInitialCharacter(data ?? defaultCharacter())
        setLoadingCharacter(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [selectedId, isNew, getCharacter])

  const handleSave = useCallback(
    async (character: Character) => {
      const id = await saveCharacter(character, selectedId)
      if (isNew && id) {
        navigate(`/characters/${id}`, { replace: true })
      }
    },
    [saveCharacter, selectedId, isNew, navigate],
  )

  async function handleDelete() {
    if (!selectedId) return
    if (!confirm('Delete this character? This cannot be undone.')) return
    await deleteCharacter(selectedId)
    navigate('/characters/new')
  }

  return (
    <>
      <PageHeader
        title="Characters"
        description="Create and manage D&D 5e player characters. Parchment-style sheet inside your campaign toolkit."
        icon="🧙"
        actions={
          selectedId ? (
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg border border-blood-500/40 bg-blood-500/10 px-3 py-1.5 text-xs text-blood-400 hover:bg-blood-500/20"
            >
              Delete
            </button>
          ) : undefined
        }
      />

      <div className="grid flex-1 gap-6 p-6 lg:grid-cols-[240px_1fr]">
        <CharacterSidebar characters={characters} loading={loading} selectedId={selectedId} />

        <div className="min-w-0">
          {loadingCharacter ? (
            <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-table-700 bg-table-900/40">
              <p className="text-table-400">Loading character…</p>
            </div>
          ) : initialCharacter ? (
            <CharacterWizard
              key={selectedId ?? 'new'}
              initialCharacter={initialCharacter}
              onSave={handleSave}
            />
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-table-700 bg-table-900/20 p-8 text-center">
              <span className="text-4xl" aria-hidden="true">
                🧙
              </span>
              <p className="mt-4 text-table-300">Character not found</p>
              <Link
                to="/characters/new"
                className="mt-3 text-sm text-gold-400 underline hover:text-gold-300"
              >
                Create a new character
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
