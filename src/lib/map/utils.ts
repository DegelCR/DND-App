import type { MapBackgroundType, MapStamp, MapToken } from '@/types/map'

export const BLANK_MAP_WIDTH = 1200
export const BLANK_MAP_HEIGHT = 900
export const BLANK_MAP_GRID = 60

const TOKEN_COLORS = [
  '#c9a227', '#4ade80', '#60a5fa', '#f87171', '#a78bfa', '#fb923c', '#2dd4bf', '#f472b6',
]

export function defaultGridSize(imageWidth: number): number {
  return Math.max(40, Math.round(imageWidth / 24))
}

export function createToken(x: number, y: number, index: number): MapToken {
  return {
    id: crypto.randomUUID(),
    label: `T${index}`,
    color: TOKEN_COLORS[index % TOKEN_COLORS.length],
    x,
    y,
  }
}

export function createStamp(assetId: string, x: number, y: number): MapStamp {
  return {
    id: crypto.randomUUID(),
    assetId,
    x,
    y,
    rotation: 0,
    scale: 1,
  }
}

export function snapPointToGrid(
  x: number,
  y: number,
  gridSize: number,
  offsetX: number,
  offsetY: number,
): { x: number; y: number } {
  return {
    x: Math.round((x - offsetX) / gridSize) * gridSize + offsetX,
    y: Math.round((y - offsetY) / gridSize) * gridSize + offsetY,
  }
}

export async function createBlankMapBlob(
  background: MapBackgroundType,
  width = BLANK_MAP_WIDTH,
  height = BLANK_MAP_HEIGHT,
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not create canvas')

  switch (background) {
    case 'grass':
      ctx.fillStyle = '#3a6334'
      ctx.fillRect(0, 0, width, height)
      paintNoise(ctx, width, height, 500, [50, 110, 45])
      break
    case 'stone':
      ctx.fillStyle = '#5a5a62'
      ctx.fillRect(0, 0, width, height)
      paintTilePattern(ctx, width, height, 80, '#6b6b75', '#4e4e56')
      break
    case 'dungeon':
      ctx.fillStyle = '#2a2a32'
      ctx.fillRect(0, 0, width, height)
      paintTilePattern(ctx, width, height, 60, '#35353f', '#222228')
      break
    case 'sand':
      ctx.fillStyle = '#c4a574'
      ctx.fillRect(0, 0, width, height)
      paintNoise(ctx, width, height, 400, [180, 150, 100])
      break
    case 'water':
      ctx.fillStyle = '#2a5a7a'
      ctx.fillRect(0, 0, width, height)
      paintNoise(ctx, width, height, 300, [40, 90, 130])
      break
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not export map'))), 'image/png')
  })
}

function paintNoise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  count: number,
  rgb: [number, number, number],
) {
  for (let i = 0; i < count; i++) {
    const alpha = 0.08 + Math.random() * 0.12
    ctx.fillStyle = `rgba(${rgb[0] + Math.random() * 30}, ${rgb[1] + Math.random() * 30}, ${rgb[2] + Math.random() * 20}, ${alpha})`
    ctx.fillRect(Math.random() * width, Math.random() * height, 2 + Math.random() * 4, 2 + Math.random() * 4)
  }
}

function paintTilePattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tileSize: number,
  light: string,
  dark: string,
) {
  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      const even = ((x / tileSize) + (y / tileSize)) % 2 === 0
      ctx.fillStyle = even ? light : dark
      ctx.fillRect(x, y, tileSize, tileSize)
    }
  }
}

export function distanceInSquares(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  gridSize: number,
): number {
  const dx = x2 - x1
  const dy = y2 - y1
  const dist = Math.hypot(dx, dy)
  return dist / gridSize
}

export function formatDistance(squares: number, feetPerSquare: number): string {
  const feet = Math.round(squares * feetPerSquare)
  return `${squares.toFixed(1)} squares (${feet} ft.)`
}

export function screenToImage(
  clientX: number,
  clientY: number,
  containerRect: DOMRect,
  panX: number,
  panY: number,
  zoom: number,
): { x: number; y: number } {
  return {
    x: (clientX - containerRect.left - panX) / zoom,
    y: (clientY - containerRect.top - panY) / zoom,
  }
}

export function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read image file'))
    }
    img.src = url
  })
}

export const MAX_MAP_FILE_BYTES = 15 * 1024 * 1024

export function validateMapFile(file: File): string | null {
  if (!file.type.startsWith('image/')) return 'Please choose a PNG, JPG, or WebP image.'
  if (file.size > MAX_MAP_FILE_BYTES) return 'Image must be under 15 MB.'
  return null
}
