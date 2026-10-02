/** Silhouette stylisée d'un SUV, en filet doré (décoratif). */
export function CarSilhouette({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 150"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 104 L18 86 Q20 76 36 72 L88 64 Q118 34 166 32 L254 32 Q306 34 336 66 L378 72 Q400 76 402 90 L402 104 Z" />
      <path d="M100 66 Q124 44 166 42 L204 42 L204 66 Z" opacity="0.6" />
      <path d="M214 42 L250 42 Q292 44 318 66 L214 66 Z" opacity="0.6" />
      <path d="M18 104 L402 104" opacity="0.5" />
      <circle cx="98" cy="108" r="20" />
      <circle cx="98" cy="108" r="8" opacity="0.6" />
      <circle cx="322" cy="108" r="20" />
      <circle cx="322" cy="108" r="8" opacity="0.6" />
      <path d="M30 88 L50 88" opacity="0.8" />
      <path d="M370 88 L392 88" opacity="0.8" />
      <path d="M0 136 L420 136" opacity="0.25" />
      <path d="M60 136 L360 136" opacity="0.5" strokeWidth="2" />
    </svg>
  )
}
