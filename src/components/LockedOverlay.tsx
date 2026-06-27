import { Lock } from '@phosphor-icons/react'

interface LockedOverlayProps {
  price: number
}

export function LockedOverlay({ price }: LockedOverlayProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 min-h-[120px]">
      <Lock size={24} weight="light" color="#836EFD" />
      <span
        className="glass rounded-full px-3 py-0.5 text-xs text-white/80"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {price} MON
      </span>
    </div>
  )
}
