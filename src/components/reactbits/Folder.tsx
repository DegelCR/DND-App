/**
 * Folder component — adapted from React Bits (MIT + Commons Clause)
 * https://reactbits.dev/components/folder
 */
import { useState, type CSSProperties, type ReactNode } from 'react'

export interface FolderProps {
  color?: string
  size?: number
  items?: ReactNode[]
  className?: string
  'aria-label'?: string
}

function darkenColor(hex: string, percent: number): string {
  let color = hex.startsWith('#') ? hex.slice(1) : hex
  if (color.length === 3) {
    color = color
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const num = parseInt(color, 16)
  let r = (num >> 16) & 0xff
  let g = (num >> 8) & 0xff
  let b = num & 0xff
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))))
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))))
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))))
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
}

export function Folder({
  color = '#c9a227',
  size = 1,
  items = [],
  className = '',
  'aria-label': ariaLabel = 'Folder',
}: FolderProps) {
  const maxItems = 3
  const papers = items.slice(0, maxItems)
  while (papers.length < maxItems) {
    papers.push(null)
  }

  const [open, setOpen] = useState(false)
  const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })),
  )

  const folderBackColor = darkenColor(color, 0.08)
  const paper1 = darkenColor('#ffffff', 0.1)
  const paper2 = darkenColor('#ffffff', 0.05)
  const paper3 = '#ffffff'

  const folderStyle = {
    '--folder-color': color,
    '--folder-back-color': folderBackColor,
    '--paper-1': paper1,
    '--paper-2': paper2,
    '--paper-3': paper3,
  } as CSSProperties

  const getOpenTransform = (index: number) => {
    if (index === 0) return 'translate(-120%, -70%) rotate(-15deg)'
    if (index === 1) return 'translate(10%, -70%) rotate(15deg)'
    if (index === 2) return 'translate(-50%, -100%) rotate(5deg)'
    return ''
  }

  return (
    <div style={{ transform: `scale(${size})` }} className={className}>
      <div
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-expanded={open}
        className={`group relative cursor-pointer transition-all duration-200 ease-in ${
          !open ? 'hover:-translate-y-2' : ''
        }`}
        style={{
          ...folderStyle,
          transform: open ? 'translateY(-8px)' : undefined,
        }}
        onClick={() => {
          setOpen((prev) => {
            if (prev) setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })))
            return !prev
          })
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.currentTarget.click()
          }
        }}
      >
        <div
          className="relative h-[80px] w-[100px] rounded-tl-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
          style={{ backgroundColor: folderBackColor }}
        >
          <span
            className="absolute bottom-[98%] left-0 z-0 h-[10px] w-[30px] rounded-tl-[5px] rounded-tr-[5px]"
            style={{ backgroundColor: folderBackColor }}
          />
          {papers.map((item, i) => {
            const sizeClasses =
              i === 0 ? 'h-[80%] w-[70%]' : i === 1 ? 'h-[70%] w-[80%]' : 'h-[60%] w-[90%]'
            const openSize = 'h-[80%]'

            return (
              <div
                key={i}
                onMouseMove={(e) => {
                  if (!open) return
                  const rect = e.currentTarget.getBoundingClientRect()
                  const offsetX = (e.clientX - (rect.left + rect.width / 2)) * 0.15
                  const offsetY = (e.clientY - (rect.top + rect.height / 2)) * 0.15
                  setPaperOffsets((prev) => {
                    const next = [...prev]
                    next[i] = { x: offsetX, y: offsetY }
                    return next
                  })
                }}
                onMouseLeave={() => {
                  setPaperOffsets((prev) => {
                    const next = [...prev]
                    next[i] = { x: 0, y: 0 }
                    return next
                  })
                }}
                className={`absolute bottom-[10%] left-1/2 z-20 transition-all duration-300 ease-in-out ${
                  !open
                    ? '-translate-x-1/2 translate-y-[10%] group-hover:translate-y-0'
                    : 'hover:scale-110'
                } ${open ? openSize : sizeClasses} ${open ? 'w-[90%]' : ''}`}
                style={{
                  ...(!open
                    ? {}
                    : { transform: `${getOpenTransform(i)} translate(${paperOffsets[i].x}px, ${paperOffsets[i].y}px)` }),
                  backgroundColor: i === 0 ? paper1 : i === 1 ? paper2 : paper3,
                  borderRadius: '10px',
                }}
              >
                {item}
              </div>
            )
          })}
          <div
            className={`absolute z-30 h-full w-full origin-bottom transition-all duration-300 ease-in-out ${
              !open ? 'group-hover:[transform:skew(15deg)_scaleY(0.6)]' : ''
            }`}
            style={{
              backgroundColor: color,
              borderRadius: '5px 10px 10px 10px',
              ...(open && { transform: 'skew(15deg) scaleY(0.6)' }),
            }}
          />
          <div
            className={`absolute z-30 h-full w-full origin-bottom transition-all duration-300 ease-in-out ${
              !open ? 'group-hover:[transform:skew(-15deg)_scaleY(0.6)]' : ''
            }`}
            style={{
              backgroundColor: color,
              borderRadius: '5px 10px 10px 10px',
              ...(open && { transform: 'skew(-15deg) scaleY(0.6)' }),
            }}
          />
        </div>
      </div>
    </div>
  )
}
