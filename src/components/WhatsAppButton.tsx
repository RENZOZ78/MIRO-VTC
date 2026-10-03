'use client'

import { siteConfig } from '@/config/site'
import { getDictionary } from '@/i18n/dictionaries'
import { useLocale } from '@/i18n/locale-context'

export function whatsappUrl(message = siteConfig.whatsappMessage): string | null {
  if (!siteConfig.whatsapp) return null
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`
}

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 1.67c4.54 0 8.24 3.7 8.24 8.24s-3.7 8.24-8.24 8.24c-1.52 0-3-.41-4.3-1.19l-.31-.18-3.12.82.83-3.04-.2-.32a8.2 8.2 0 0 1-1.26-4.33c0-4.54 3.7-8.24 8.24-8.24m-3.3 4.41c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.6c.12.17 1.76 2.68 4.27 3.76 2.08.9 2.5.72 2.96.68.45-.05 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.23-.17-.48-.29-.25-.12-1.46-.72-1.69-.8-.23-.09-.4-.13-.56.12-.17.25-.65.8-.79.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.46" />
    </svg>
  )
}

/** Bouton WhatsApp flottant (bas de page, mobile et bureau). */
export function WhatsAppFloating() {
  const locale = useLocale()
  const label = getDictionary(locale).whatsapp
  const url = whatsappUrl()
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="fixed right-5 bottom-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.8)] transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}

/** Lien WhatsApp en forme de bouton, à utiliser dans le contenu. */
export function WhatsAppLink({ children, className = 'btn-ghost' }: { children: React.ReactNode; className?: string }) {
  const url = whatsappUrl()
  if (!url) return null
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      <WhatsAppIcon className="h-4 w-4" />
      {children}
    </a>
  )
}
