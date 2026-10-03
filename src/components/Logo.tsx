import { siteConfig } from '@/config/site'

export function Logo({ className = '', tagline = 'Chauffeur privé' }: { className?: string; tagline?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        aria-hidden
        className="border-gold/60 text-gold-2 font-display grid h-10 w-10 place-items-center rounded-full border text-xl font-semibold"
        style={{ boxShadow: '0 0 0 4px rgba(201,163,90,0.08)' }}
      >
        M
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-cream text-xl font-semibold tracking-[0.18em]">
          {siteConfig.name}
        </span>
        <span className="text-mist mt-1 text-[10px] font-medium tracking-[0.3em] uppercase">{tagline}</span>
      </span>
    </span>
  )
}
