import type { MapToken } from '@/types/map'

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
