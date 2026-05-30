/**
 * Border glow wrapper — inspired by React Bits Magic Bento (MIT + Commons Clause)
 * https://reactbits.dev/components/magic-bento
 */
import { type CSSProperties, type ReactNode, useRef } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  /** RGB triplet, e.g. "201, 162, 39" for gold */
  glowColor?: string
  glowRadius?: number
}

export function GlowCard({
  children,
  className = '',
  glowColor = '201, 162, 39',
  glowRadius = 200,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  function setGlow(intensity: number, x = 50, y = 50) {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--glow-intensity', String(intensity))
    el.style.setProperty('--glow-x', `${x}%`)
    el.style.setProperty('--glow-y', `${y}%`)
  }

  return (
    <div
      ref={ref}
      className={`glow-card ${className}`}
      style={
        {
          '--glow-color': glowColor,
          '--glow-radius': `${glowRadius}px`,
          '--glow-intensity': '0',
          '--glow-x': '50%',
          '--glow-y': '50%',
        } as CSSProperties
      }
      onMouseMove={(e) => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setGlow(1, x, y)
      }}
      onMouseLeave={() => setGlow(0)}
    >
      {children}
    </div>
  )
}
