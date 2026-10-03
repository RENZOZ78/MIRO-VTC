import type { Metadata } from 'next'
import { HtmlLang } from '@/i18n/locale-context'

export const metadata: Metadata = {
  openGraph: { locale: 'en_GB' },
}

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HtmlLang locale="en" />
      {children}
    </>
  )
}
