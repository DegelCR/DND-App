import { useCallback, useEffect, useState } from 'react'
import { db } from '@/db'
import { defaultCharacter } from '@/lib/character/character'
import type { Character } from '@/lib/character/types'
import { toCharacterRecord, type CharacterRecord } from '@/types/character'

export function useCharacters() {
  const [characters, setCharacters] = useState<CharacterRecord[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const rows = await db.characters.orderBy('updatedAt').reverse().toArray()
    setCharacters(rows)
    return rows
  }, [])

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  const saveCharacter = useCallback(
    async (data: Character, id?: number) => {
      const record = toCharacterRecord(data)
      if (id) {
        await db.characters.update(id, record)
        await refresh()
        return id
      }
      const newId = await db.characters.add(record as CharacterRecord)
      await refresh()
      return newId
    },
    [refresh],
  )

  const deleteCharacter = useCallback(
    async (id: number) => {
      await db.characters.delete(id)
      await refresh()
    },
    [refresh],
  )

  const getCharacter = useCallback(async (id: number) => {
    const row = await db.characters.get(id)
    if (!row) return null
    return { ...defaultCharacter(), ...row.data }
  }, [])

  return {
    characters,
    loading,
    refresh,
    saveCharacter,
    deleteCharacter,
    getCharacter,
  }
}
