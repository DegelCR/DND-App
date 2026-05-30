import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'

const ANIMATION_PATH = '/animations/devil-d20-fumble.json'

interface FumbleAnimationProps {
  className?: string
  onComplete?: () => void
}

export function FumbleAnimation({
  className = 'mx-auto h-44 w-44 sm:h-52 sm:w-52',
  onComplete,
}: FumbleAnimationProps) {
  const [animationData, setAnimationData] = useState<object | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch(ANIMATION_PATH)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data) setAnimationData(data)
      })
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (!loaded) {
    return (
      <span className="inline-block text-5xl opacity-70" aria-hidden="true">
        🎲
      </span>
    )
  }

  if (!animationData) {
    return (
      <span className="inline-block text-6xl sm:text-7xl" aria-hidden="true">
        😈
      </span>
    )
  }

  return (
    <Lottie
      animationData={animationData}
      loop={false}
      autoplay
      onComplete={onComplete}
      className={className}
      aria-label="Critical fumble animation"
    />
  )
}

export async function isFumbleAnimationAvailable(): Promise<boolean> {
  try {
    const response = await fetch(ANIMATION_PATH, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}
