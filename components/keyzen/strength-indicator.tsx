'use client'

import type { Strength } from '@/lib/password'

export function StrengthIndicator({ strength }: { strength: Strength }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
        {strength.label}
      </span>
      <div className="flex flex-1 items-center gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= strength.score ? 'bg-accent' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
