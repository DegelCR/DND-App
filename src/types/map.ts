export interface MapToken {
  id: string
  label: string
  color: string
  /** X in image pixel coordinates */
  x: number
  /** Y in image pixel coordinates */
  y: number
}

export type MapTool = 'pan' | 'token' | 'fog' | 'erase' | 'measure'

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
  fogBlob?: Blob | null
  updatedAt: Date
  createdAt: Date
}

export interface MapViewport {
  panX: number
  panY: number
  zoom: number
}
