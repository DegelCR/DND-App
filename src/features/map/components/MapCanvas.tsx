import { useCallback, useEffect, useRef, useState } from 'react'
import { getMapAsset } from '@/lib/map/assets'
import {
  createStamp,
  createToken,
  distanceInSquares,
  formatDistance,
  screenToImage,
  snapPointToGrid,
} from '@/lib/map/utils'
import type { BattleMapRecord, MapStamp, MapToken, MapTool } from '@/types/map'

interface MapCanvasProps {
  map: BattleMapRecord
  tool: MapTool
  selectedAssetId: string | null
  snapToGrid: boolean
  onTokensChange: (tokens: MapToken[]) => void
  onStampsChange: (stamps: MapStamp[]) => void
  onGridChange: (patch: Partial<
    Pick<BattleMapRecord, 'gridSize' | 'gridOffsetX' | 'gridOffsetY' | 'showGrid' | 'feetPerSquare'>
  >) => void
  onFogSave: (blob: Blob | null) => void
  onMeasureChange: (label: string | null) => void
  onResetViewRef?: (fn: () => void) => void
}

const FOG_COLOR = 'rgba(10, 10, 15, 0.88)'
const BRUSH_SIZE = 28

export function MapCanvas({
  map,
  tool,
  selectedAssetId,
  snapToGrid,
  onTokensChange,
  onStampsChange,
  onGridChange,
  onFogSave,
  onMeasureChange,
  onResetViewRef,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const fogCanvasRef = useRef<HTMLCanvasElement>(null)
  const imageUrlRef = useRef<string | null>(null)
  const fogSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [pan, setPan] = useState({ x: 40, y: 40 })
  const [zoom, setZoom] = useState(1)
  const [tokens, setTokens] = useState<MapToken[]>(map.tokens)
  const tokensRef = useRef(tokens)
  tokensRef.current = tokens
  const [stamps, setStamps] = useState<MapStamp[]>(map.stamps ?? [])
  const stampsRef = useRef(stamps)
  stampsRef.current = stamps
  const [dragTokenId, setDragTokenId] = useState<string | null>(null)
  const [dragStampId, setDragStampId] = useState<string | null>(null)
  const [selectedStampId, setSelectedStampId] = useState<string | null>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [isDrawingFog, setIsDrawingFog] = useState(false)
  const [measureStart, setMeasureStart] = useState<{ x: number; y: number } | null>(null)
  const [measureEnd, setMeasureEnd] = useState<{ x: number; y: number } | null>(null)
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const resetView = useCallback(() => {
    if (!containerRef.current) return
    const { clientWidth, clientHeight } = containerRef.current
    const fitZoom = Math.min(
      (clientWidth - 80) / map.imageWidth,
      (clientHeight - 80) / map.imageHeight,
      1.5,
    )
    setZoom(Math.max(0.2, fitZoom))
    setPan({
      x: (clientWidth - map.imageWidth * fitZoom) / 2,
      y: (clientHeight - map.imageHeight * fitZoom) / 2,
    })
  }, [map.imageHeight, map.imageWidth])

  useEffect(() => {
    onResetViewRef?.(resetView)
  }, [onResetViewRef, resetView])

  useEffect(() => {
    setImageError(null)
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
    imageUrlRef.current = null
    setImageUrl(null)

    try {
      const blob =
        map.imageBlob instanceof Blob
          ? map.imageBlob
          : new Blob([map.imageBlob as BlobPart], { type: 'image/png' })
      const url = URL.createObjectURL(blob)
      imageUrlRef.current = url
      setImageUrl(url)
    } catch {
      setImageError('Could not display map image. Try re-uploading or creating a new map.')
    }

    return () => {
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current)
    }
  }, [map.id, map.imageBlob])

  useEffect(() => {
    setTokens(map.tokens)
    setStamps(map.stamps ?? [])
    setSelectedStampId(null)
    setMeasureStart(null)
    setMeasureEnd(null)
    onMeasureChange(null)
  }, [map.id, onMeasureChange])

  useEffect(() => {
    const canvas = fogCanvasRef.current
    if (!canvas) return
    canvas.width = map.imageWidth
    canvas.height = map.imageHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (map.fogBlob) {
      const fogUrl = URL.createObjectURL(map.fogBlob)
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        URL.revokeObjectURL(fogUrl)
      }
      img.src = fogUrl
    }
  }, [map.fogBlob, map.imageHeight, map.imageWidth, map.id])

  useEffect(() => {
    resetView()
  }, [map.id, resetView])

  const scheduleFogSave = useCallback(() => {
    const canvas = fogCanvasRef.current
    if (!canvas) return
    if (fogSaveTimer.current) clearTimeout(fogSaveTimer.current)
    fogSaveTimer.current = setTimeout(() => {
      canvas.toBlob((blob) => onFogSave(blob), 'image/png')
    }, 500)
  }, [onFogSave])

  const getImagePoint = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return null
      return screenToImage(clientX, clientY, rect, pan.x, pan.y, zoom)
    },
    [pan.x, pan.y, zoom],
  )

  const drawFogAt = useCallback(
    (x: number, y: number, erase: boolean) => {
      const canvas = fogCanvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!ctx) return
      ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over'
      ctx.fillStyle = FOG_COLOR
      ctx.beginPath()
      ctx.arc(x, y, BRUSH_SIZE / zoom, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalCompositeOperation = 'source-over'
      scheduleFogSave()
    },
    [scheduleFogSave, zoom],
  )

  const commitTokens = useCallback(
    (next: MapToken[]) => {
      setTokens(next)
      onTokensChange(next)
    },
    [onTokensChange],
  )

  const commitStamps = useCallback(
    (next: MapStamp[]) => {
      setStamps(next)
      onStampsChange(next)
    },
    [onStampsChange],
  )

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (tool === 'stamp' && selectedStampId) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault()
          commitStamps(stampsRef.current.filter((s) => s.id !== selectedStampId))
          setSelectedStampId(null)
          return
        }
        if (e.key === 'r' || e.key === 'R') {
          e.preventDefault()
          commitStamps(
            stampsRef.current.map((s) =>
              s.id === selectedStampId ? { ...s, rotation: (s.rotation + 90) % 360 } : s,
            ),
          )
          return
        }
      }

      if (tool !== 'pan') return
      const step = e.shiftKey ? 10 : 1
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onGridChange({ gridOffsetX: map.gridOffsetX - step })
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onGridChange({ gridOffsetX: map.gridOffsetX + step })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        onGridChange({ gridOffsetY: map.gridOffsetY - step })
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        onGridChange({ gridOffsetY: map.gridOffsetY + step })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [commitStamps, tool, selectedStampId, map.gridOffsetX, map.gridOffsetY, onGridChange])

  const resolvePoint = useCallback(
    (x: number, y: number) => {
      if (!snapToGrid) return { x, y }
      if (tool === 'stamp' || dragStampId) {
        return snapPointToGrid(x, y, map.gridSize, map.gridOffsetX, map.gridOffsetY)
      }
      return { x, y }
    },
    [dragStampId, map.gridOffsetX, map.gridOffsetY, map.gridSize, snapToGrid, tool],
  )

  const hitTestStamp = useCallback(
    (x: number, y: number) => {
      for (let i = stamps.length - 1; i >= 0; i--) {
        const stamp = stamps[i]
        const asset = getMapAsset(stamp.assetId)
        const radius = ((asset?.size ?? 40) * stamp.scale) / 2
        if (Math.hypot(stamp.x - x, stamp.y - y) < radius / zoom + 4) return stamp
      }
      return null
    },
    [stamps, zoom],
  )

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const factor = e.deltaY > 0 ? 0.9 : 1.1
      const nextZoom = Math.min(4, Math.max(0.15, zoom * factor))
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      setPan({
        x: mx - ((mx - pan.x) / zoom) * nextZoom,
        y: my - ((my - pan.y) / zoom) * nextZoom,
      })
      setZoom(nextZoom)
    },
    [pan.x, pan.y, zoom],
  )

  const handlePointerDown = (e: React.PointerEvent) => {
    const point = getImagePoint(e.clientX, e.clientY)
    if (!point) return

    if (tool === 'pan' || e.button === 1) {
      setIsPanning(true)
      panStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
      e.currentTarget.setPointerCapture(e.pointerId)
      return
    }

    if (tool === 'stamp') {
      const hit = hitTestStamp(point.x, point.y)
      if (hit) {
        setSelectedStampId(hit.id)
        setDragStampId(hit.id)
        dragOffsetRef.current = { x: point.x - hit.x, y: point.y - hit.y }
        e.currentTarget.setPointerCapture(e.pointerId)
      } else if (selectedAssetId) {
        const placed = resolvePoint(point.x, point.y)
        const next = [...stamps, createStamp(selectedAssetId, placed.x, placed.y)]
        commitStamps(next)
        setSelectedStampId(next[next.length - 1].id)
      }
      return
    }

    if (tool === 'token') {
      const hit = tokens.find(
        (t) => Math.hypot(t.x - point.x, t.y - point.y) < 24 / zoom,
      )
      if (hit) {
        setDragTokenId(hit.id)
        dragOffsetRef.current = { x: point.x - hit.x, y: point.y - hit.y }
        e.currentTarget.setPointerCapture(e.pointerId)
      } else {
        const next = [...tokens, createToken(point.x, point.y, tokens.length + 1)]
        commitTokens(next)
      }
      return
    }

    if (tool === 'fog' || tool === 'erase') {
      setIsDrawingFog(true)
      drawFogAt(point.x, point.y, tool === 'erase')
      e.currentTarget.setPointerCapture(e.pointerId)
      return
    }

    if (tool === 'measure') {
      if (!measureStart) {
        setMeasureStart(point)
        setMeasureEnd(null)
        onMeasureChange('Click end point…')
      } else {
        setMeasureEnd(point)
        const squares = distanceInSquares(
          measureStart.x,
          measureStart.y,
          point.x,
          point.y,
          map.gridSize,
        )
        onMeasureChange(formatDistance(squares, map.feetPerSquare))
      }
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const point = getImagePoint(e.clientX, e.clientY)
    if (!point) return

    if (isPanning) {
      const dx = e.clientX - panStartRef.current.x
      const dy = e.clientY - panStartRef.current.y
      setPan({ x: panStartRef.current.panX + dx, y: panStartRef.current.panY + dy })
      return
    }

    if (dragStampId) {
      const raw = {
        x: point.x - dragOffsetRef.current.x,
        y: point.y - dragOffsetRef.current.y,
      }
      const placed = resolvePoint(raw.x, raw.y)
      const next = stamps.map((s) =>
        s.id === dragStampId ? { ...s, x: placed.x, y: placed.y } : s,
      )
      setStamps(next)
      return
    }

    if (dragTokenId) {
      const next = tokens.map((t) =>
        t.id === dragTokenId
          ? { ...t, x: point.x - dragOffsetRef.current.x, y: point.y - dragOffsetRef.current.y }
          : t,
      )
      setTokens(next)
      return
    }

    if (isDrawingFog) {
      drawFogAt(point.x, point.y, tool === 'erase')
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragTokenId) {
      commitTokens(tokensRef.current)
      setDragTokenId(null)
    }
    if (dragStampId) {
      commitStamps(stampsRef.current)
      setDragStampId(null)
    }
    setIsPanning(false)
    setIsDrawingFog(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const handleTokenLabelChange = (id: string, label: string) => {
    commitTokens(tokens.map((t) => (t.id === id ? { ...t, label } : t)))
  }

  const handleDeleteToken = (id: string) => {
    commitTokens(tokens.filter((t) => t.id !== id))
  }

  const gridStyle = map.showGrid
    ? {
        backgroundImage: `
          linear-gradient(to right, rgba(201,162,39,0.35) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(201,162,39,0.35) 1px, transparent 1px)
        `,
        backgroundSize: `${map.gridSize}px ${map.gridSize}px`,
        backgroundPosition: `${map.gridOffsetX}px ${map.gridOffsetY}px`,
      }
    : undefined

  const handleDeleteStamp = (id: string) => {
    commitStamps(stamps.filter((s) => s.id !== id))
    if (selectedStampId === id) setSelectedStampId(null)
  }

  const handleRotateStamp = (id: string) => {
    commitStamps(
      stamps.map((s) => (s.id === id ? { ...s, rotation: (s.rotation + 90) % 360 } : s)),
    )
  }

  const cursor =
    tool === 'pan'
      ? isPanning
        ? 'grabbing'
        : 'grab'
      : tool === 'stamp'
        ? selectedAssetId
          ? 'crosshair'
          : 'default'
      : tool === 'token'
        ? 'crosshair'
        : tool === 'fog' || tool === 'erase'
          ? 'cell'
          : tool === 'measure'
            ? 'crosshair'
            : 'default'

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-table-700 bg-table-950">
      <div
        ref={containerRef}
        className="relative min-h-[480px] flex-1 overflow-hidden"
        style={{ cursor }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        {imageError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-table-950/90 p-6 text-center">
            <p className="max-w-sm text-sm text-red-200">{imageError}</p>
          </div>
        )}
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            width: map.imageWidth,
            height: map.imageHeight,
          }}
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt={map.name}
              draggable={false}
              className="pointer-events-none block select-none"
              width={map.imageWidth}
              height={map.imageHeight}
            />
          )}

          <div
            className="pointer-events-none absolute inset-0"
            style={gridStyle}
          />

          {stamps.map((stamp) => {
            const asset = getMapAsset(stamp.assetId)
            if (!asset) return null
            const size = asset.size * stamp.scale
            const isSelected = selectedStampId === stamp.id
            return (
              <img
                key={stamp.id}
                src={asset.src}
                alt={asset.label}
                draggable={false}
                className={`absolute select-none ${
                  isSelected ? 'ring-2 ring-gold-400 ring-offset-1 ring-offset-transparent' : ''
                }`}
                style={{
                  left: stamp.x,
                  top: stamp.y,
                  width: size,
                  height: size,
                  transform: `translate(-50%, -50%) rotate(${stamp.rotation}deg)`,
                  pointerEvents: tool === 'stamp' ? 'auto' : 'none',
                  cursor: tool === 'stamp' ? 'grab' : 'default',
                }}
                title={asset.label}
              />
            )
          })}

          <svg
            className="pointer-events-none absolute inset-0 overflow-visible"
            width={map.imageWidth}
            height={map.imageHeight}
          >
            {measureStart && measureEnd && (
              <>
                <line
                  x1={measureStart.x}
                  y1={measureStart.y}
                  x2={measureEnd.x}
                  y2={measureEnd.y}
                  stroke="#c9a227"
                  strokeWidth={2 / zoom}
                  strokeDasharray={`${6 / zoom} ${4 / zoom}`}
                />
                <circle cx={measureStart.x} cy={measureStart.y} r={4 / zoom} fill="#c9a227" />
                <circle cx={measureEnd.x} cy={measureEnd.y} r={4 / zoom} fill="#c9a227" />
              </>
            )}
          </svg>

          <canvas
            ref={fogCanvasRef}
            className={`absolute inset-0 ${tool === 'fog' || tool === 'erase' ? 'pointer-events-none' : 'pointer-events-none'}`}
            width={map.imageWidth}
            height={map.imageHeight}
          />

          {tokens.map((token) => (
            <div
              key={token.id}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/80 text-xs font-bold text-white shadow-lg"
              style={{
                left: token.x,
                top: token.y,
                width: 40,
                height: 40,
                backgroundColor: token.color,
                pointerEvents: tool === 'token' ? 'auto' : 'none',
              }}
              title={token.label}
            >
              {token.label.slice(0, 2).toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      {tool === 'stamp' && stamps.length > 0 && (
        <div className="max-h-28 overflow-y-auto border-t border-table-700 bg-table-900/60 px-4 py-2">
          <p className="mb-2 text-xs uppercase tracking-wide text-table-500">
            Placed assets · R to rotate · Del to remove
          </p>
          <ul className="flex flex-wrap gap-2">
            {stamps.map((stamp) => {
              const asset = getMapAsset(stamp.assetId)
              return (
                <li
                  key={stamp.id}
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 ${
                    selectedStampId === stamp.id ? 'bg-gold-500/15 ring-1 ring-gold-500/40' : 'bg-table-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedStampId(stamp.id)}
                    className="text-sm text-table-200"
                  >
                    {asset?.label ?? stamp.assetId}
                  </button>
                  <button
                    type="button"
                    title="Rotate 90°"
                    onClick={() => handleRotateStamp(stamp.id)}
                    className="text-xs text-table-500 hover:text-gold-300"
                  >
                    ↻
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteStamp(stamp.id)}
                    className="text-xs text-table-500 hover:text-red-400"
                  >
                    ✕
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {tool === 'token' && tokens.length > 0 && (
        <div className="max-h-36 overflow-y-auto border-t border-table-700 bg-table-900/60 px-4 py-2">
          <p className="mb-2 text-xs uppercase tracking-wide text-table-500">Tokens</p>
          <ul className="flex flex-wrap gap-2">
            {tokens.map((token) => (
              <li key={token.id} className="flex items-center gap-1 rounded-lg bg-table-800 px-2 py-1">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: token.color }}
                />
                <input
                  value={token.label}
                  onChange={(e) => handleTokenLabelChange(token.id, e.target.value)}
                  className="w-20 bg-transparent text-sm text-table-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteToken(token.id)}
                  className="text-xs text-table-500 hover:text-red-400"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-table-800 px-4 py-2 text-xs text-table-500">
        Scroll to zoom · Pan tool or middle-click drag · Arrow keys (Pan tool) nudge grid offset
        <span className="ml-2 text-table-400">
          Offset ({map.gridOffsetX}, {map.gridOffsetY})
        </span>
        <button
          type="button"
          className="ml-2 text-table-400 hover:text-table-200"
          onClick={() => onGridChange({ gridOffsetX: 0, gridOffsetY: 0 })}
        >
          Reset offset
        </button>
      </div>
    </div>
  )
}
