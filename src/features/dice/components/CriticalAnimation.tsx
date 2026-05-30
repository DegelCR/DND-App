import { EvilEye } from '@/components/reactbits'

export function CriticalAnimation() {
  return (
    <div className="mx-auto h-28 w-full max-w-xs">
      <EvilEye
        eyeColor="#4ade80"
        backgroundColor="#0a0908"
        intensity={1.8}
        glowIntensity={0.45}
        scale={0.75}
      />
    </div>
  )
}
