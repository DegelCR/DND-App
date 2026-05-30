import type { MapBackgroundType } from '@/types/map'

export type MapAssetCategory = 'terrain' | 'structures' | 'props'

export interface MapAssetDef {
  id: string
  label: string
  category: MapAssetCategory
  src: string
  /** Default display size in image pixels */
  size: number
}

const base = import.meta.env.BASE_URL

export const MAP_ASSET_CATEGORIES: { id: MapAssetCategory; label: string }[] = [
  { id: 'terrain', label: 'Terrain' },
  { id: 'structures', label: 'Structures' },
  { id: 'props', label: 'Props' },
]

export const MAP_ASSETS: MapAssetDef[] = [
  { id: 'tree-oak', label: 'Oak tree', category: 'terrain', src: `${base}map-assets/tree-oak.svg`, size: 56 },
  { id: 'tree-pine', label: 'Pine tree', category: 'terrain', src: `${base}map-assets/tree-pine.svg`, size: 52 },
  { id: 'rock-large', label: 'Large rock', category: 'terrain', src: `${base}map-assets/rock-large.svg`, size: 44 },
  { id: 'rock-small', label: 'Small rock', category: 'terrain', src: `${base}map-assets/rock-small.svg`, size: 28 },
  { id: 'bush', label: 'Bush', category: 'terrain', src: `${base}map-assets/bush.svg`, size: 36 },
  { id: 'water-pool', label: 'Pool', category: 'terrain', src: `${base}map-assets/water-pool.svg`, size: 48 },

  { id: 'wall-h', label: 'Wall (H)', category: 'structures', src: `${base}map-assets/wall-h.svg`, size: 56 },
  { id: 'wall-v', label: 'Wall (V)', category: 'structures', src: `${base}map-assets/wall-v.svg`, size: 56 },
  { id: 'wall-corner', label: 'Corner', category: 'structures', src: `${base}map-assets/wall-corner.svg`, size: 56 },
  { id: 'door', label: 'Door', category: 'structures', src: `${base}map-assets/door.svg`, size: 48 },
  { id: 'house', label: 'House', category: 'structures', src: `${base}map-assets/house.svg`, size: 64 },
  { id: 'tower', label: 'Tower', category: 'structures', src: `${base}map-assets/tower.svg`, size: 56 },

  { id: 'table', label: 'Table', category: 'props', src: `${base}map-assets/table.svg`, size: 40 },
  { id: 'chair', label: 'Chair', category: 'props', src: `${base}map-assets/chair.svg`, size: 28 },
  { id: 'chest', label: 'Chest', category: 'props', src: `${base}map-assets/chest.svg`, size: 32 },
  { id: 'barrel', label: 'Barrel', category: 'props', src: `${base}map-assets/barrel.svg`, size: 28 },
  { id: 'bed', label: 'Bed', category: 'props', src: `${base}map-assets/bed.svg`, size: 48 },
  { id: 'campfire', label: 'Campfire', category: 'props', src: `${base}map-assets/campfire.svg`, size: 36 },
]

const assetById = new Map(MAP_ASSETS.map((a) => [a.id, a]))

export function getMapAsset(id: string): MapAssetDef | undefined {
  return assetById.get(id)
}

export const MAP_BACKGROUND_OPTIONS: { id: MapBackgroundType; label: string }[] = [
  { id: 'grass', label: 'Grass' },
  { id: 'stone', label: 'Stone floor' },
  { id: 'dungeon', label: 'Dungeon' },
  { id: 'sand', label: 'Sand' },
  { id: 'water', label: 'Shallow water' },
]
