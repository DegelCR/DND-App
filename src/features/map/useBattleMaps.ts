import { useCallback, useEffect, useRef, useState } from 'react'
import { db, initDatabase } from '@/db'
import {
  BLANK_MAP_GRID,
  BLANK_MAP_HEIGHT,
  BLANK_MAP_WIDTH,
  createBlankMapBlob,
  defaultGridSize,
  readImageDimensions,
  validateMapFile,
} from '@/lib/map/utils'
import type { BattleMapRecord, MapBackgroundType, MapStamp, MapToken } from '@/types/map'

const ACTIVE_MAP_KEY = 'active_battle_map_id'

function normalizeMap(map: BattleMapRecord): BattleMapRecord {
  return {
    ...map,
    tokens: map.tokens ?? [],
    stamps: map.stamps ?? [],
    fogBlob: map.fogBlob ?? null,
    source: map.source ?? 'upload',
  }
}

function toImageBlob(value: BattleMapRecord['imageBlob']): Blob {
  if (value instanceof Blob) return value
  return new Blob([value as BlobPart], { type: 'image/png' })
}

async function getActiveMapId(): Promise<number | null> {
  const row = await db.settings.get({ key: ACTIVE_MAP_KEY })
  return row?.value ? Number(row.value) : null
}

async function setActiveMapId(id: number | null) {
  if (id == null) {
    const row = await db.settings.get({ key: ACTIVE_MAP_KEY })
    if (row?.id != null) await db.settings.delete(row.id)
    return
  }
  const existing = await db.settings.get({ key: ACTIVE_MAP_KEY })
  if (existing?.id != null) {
    await db.settings.update(existing.id, { value: String(id) })
  } else {
    await db.settings.add({ key: ACTIVE_MAP_KEY, value: String(id) })
  }
}

export function useBattleMaps() {
  const [maps, setMaps] = useState<BattleMapRecord[]>([])
  const [activeMap, setActiveMap] = useState<BattleMapRecord | null>(null)
  const [activeMapId, setActiveMapIdState] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const refreshMaps = useCallback(async () => {
    const rows = await db.battleMaps.orderBy('updatedAt').reverse().toArray()
    const normalized = rows.map((row) =>
      normalizeMap({ ...row, imageBlob: toImageBlob(row.imageBlob) }),
    )
    setMaps(normalized)
    return normalized
  }, [])

  const loadActiveMap = useCallback(async (id: number) => {
    const map = await db.battleMaps.get(id)
    if (map) {
      const normalized = normalizeMap({ ...map, imageBlob: toImageBlob(map.imageBlob) })
      setActiveMap(normalized)
      setActiveMapIdState(id)
      await setActiveMapId(id)
    }
  }, [])

  useEffect(() => {
    async function init() {
      try {
        await initDatabase()
        const rows = await refreshMaps()
        const savedId = await getActiveMapId()
        const target =
          savedId != null ? rows.find((m) => m.id === savedId) ?? rows[0] : rows[0]
        if (target?.id != null) {
          setActiveMap(target)
          setActiveMapIdState(target.id)
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Could not load battle maps from local storage.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    void init()
  }, [refreshMaps])

  const selectMap = useCallback(
    async (id: number) => {
      await loadActiveMap(id)
    },
    [loadActiveMap],
  )

  const createMapFromFile = useCallback(
    async (file: File) => {
      setError(null)
      const validation = validateMapFile(file)
      if (validation) {
        setError(validation)
        return null
      }

      try {
        const { width, height } = await readImageDimensions(file)
        const now = new Date()
        const baseName = file.name.replace(/\.[^.]+$/, '') || 'Untitled map'
        const record: BattleMapRecord = {
          name: baseName,
          imageBlob: file,
          imageWidth: width,
          imageHeight: height,
          gridSize: defaultGridSize(width),
          gridOffsetX: 0,
          gridOffsetY: 0,
          showGrid: true,
          feetPerSquare: 5,
          tokens: [],
          stamps: [],
          fogBlob: null,
          source: 'upload',
          createdAt: now,
          updatedAt: now,
        }

        const id = await db.battleMaps.add(record)
        if (id == null) throw new Error('Failed to save map')
        await refreshMaps()
        await loadActiveMap(id)
        return id
      } catch {
        setError('Could not import map image.')
        return null
      }
    },
    [loadActiveMap, refreshMaps],
  )

  const createBlankMap = useCallback(
    async (name: string, background: MapBackgroundType) => {
      setError(null)
      try {
        const blob = await createBlankMapBlob(background)
        const now = new Date()
        const record: BattleMapRecord = {
          name: name.trim() || 'Untitled map',
          imageBlob: blob,
          imageWidth: BLANK_MAP_WIDTH,
          imageHeight: BLANK_MAP_HEIGHT,
          gridSize: BLANK_MAP_GRID,
          gridOffsetX: 0,
          gridOffsetY: 0,
          showGrid: true,
          feetPerSquare: 5,
          tokens: [],
          stamps: [],
          fogBlob: null,
          source: 'builder',
          backgroundType: background,
          createdAt: now,
          updatedAt: now,
        }

        const id = await db.battleMaps.add(record)
        if (id == null) throw new Error('Failed to save map')
        await refreshMaps()
        await loadActiveMap(id)
        return id
      } catch (err) {
        console.error('createBlankMap failed', err)
        setError('Could not create blank map. Try clearing site data and reload.')
        return null
      }
    },
    [loadActiveMap, refreshMaps],
  )

  const deleteMap = useCallback(
    async (id: number) => {
      await db.battleMaps.delete(id)
      const rows = await refreshMaps()
      if (activeMapId === id) {
        const next = rows[0] ?? null
        if (next?.id != null) {
          await loadActiveMap(next.id)
        } else {
          setActiveMap(null)
          setActiveMapIdState(null)
          await setActiveMapId(null)
        }
      }
    },
    [activeMapId, loadActiveMap, refreshMaps],
  )

  const renameMap = useCallback(
    async (id: number, name: string) => {
      const trimmed = name.trim()
      if (!trimmed) return
      await db.battleMaps.update(id, { name: trimmed, updatedAt: new Date() })
      await refreshMaps()
      if (activeMapId === id) {
        setActiveMap((prev) => (prev ? { ...prev, name: trimmed } : prev))
      }
    },
    [activeMapId, refreshMaps],
  )

  const persistMap = useCallback(
    async (id: number, patch: Partial<BattleMapRecord>) => {
      const updatedAt = new Date()
      await db.battleMaps.update(id, { ...patch, updatedAt })
      setActiveMap((prev) => (prev?.id === id ? { ...prev, ...patch, updatedAt } : prev))
      setMaps((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...patch, updatedAt } : m)),
      )
    },
    [],
  )

  const scheduleSave = useCallback(
    (patch: Partial<BattleMapRecord>) => {
      if (activeMapId == null) return
      setActiveMap((prev) => (prev ? { ...prev, ...patch } : prev))
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        void persistMap(activeMapId, patch)
      }, 400)
    },
    [activeMapId, persistMap],
  )

  const updateTokens = useCallback(
    (tokens: MapToken[]) => {
      scheduleSave({ tokens })
    },
    [scheduleSave],
  )

  const updateStamps = useCallback(
    (stamps: MapStamp[]) => {
      scheduleSave({ stamps })
    },
    [scheduleSave],
  )

  const updateGrid = useCallback(
    (patch: Partial<
      Pick<
        BattleMapRecord,
        'gridSize' | 'gridOffsetX' | 'gridOffsetY' | 'showGrid' | 'feetPerSquare'
      >
    >) => {
      scheduleSave(patch)
    },
    [scheduleSave],
  )

  const saveFog = useCallback(
    async (blob: Blob | null) => {
      if (activeMapId == null) return
      await persistMap(activeMapId, { fogBlob: blob })
    },
    [activeMapId, persistMap],
  )

  const clearFog = useCallback(async () => {
    if (activeMapId == null) return
    await persistMap(activeMapId, { fogBlob: null })
    setActiveMap((prev) => (prev ? { ...prev, fogBlob: null } : prev))
  }, [activeMapId, persistMap])

  return {
    loading,
    error,
    maps,
    activeMap,
    activeMapId,
    selectMap,
    createMapFromFile,
    createBlankMap,
    deleteMap,
    renameMap,
    updateTokens,
    updateStamps,
    updateGrid,
    saveFog,
    clearFog,
    setError,
  }
}
