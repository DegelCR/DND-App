export interface MapToken {
  id: string
  label: string
  color: string
  /** X in image pixel coordinates */
  x: number
  /** Y in image pixel coordinates */
  y: number
}

export interface MapStamp {
  id: string
  assetId: string
  x: number
  y: number
  /** Rotation in degrees (0, 90, 180, 270) */
  rotation: number
  scale: number
}

export type MapBackgroundType = 'grass' | 'stone' | 'dungeon' | 'sand' | 'water'

export type MapTool = 'pan' | 'stamp' | 'token' | 'fog' | 'erase' | 'measure'

export interface BattleMapRecord {
  id?: number
  name: string
  imageBlob: Blob
  imageWidth: number
  imageHeight: number
  gridSize: number
  gridOffsetX: number
  gridOffsetY: number
  showGrid: boolean
  feetPerSquare: number
  tokens: MapToken[]
  stamps?: MapStamp[]
  fogBlob?: Blob | null
  source?: 'upload' | 'builder'
  backgroundType?: MapBackgroundType
  updatedAt: Date
  createdAt: Date
}

export interface MapViewport {
  panX: number
  panY: number
  zoom: number
}
