import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { WhatsAppFloating } from '@/components/WhatsAppButton'
import { isSet, siteConfig } from '@/config/site'
import './globals.css'

// Polices embarquées (src/app/fonts) : le build ne dépend plus d'un téléchargement
// depuis Google Fonts, qui échouait par intermittence sur l'hébergeur.
const display = localFont({
  src: [
    { path: './fonts/cormorant.woff2', weight: '300 700', style: 'normal' },
    { path: './fonts/cormorant-italic.woff2', weight: '300 700', style: 'italic' },
  ],
  variable: '--font-display',
  display: 'swap',
})

const sans = localFont({
  src: './fonts/manrope.woff2',
  weight: '200 800',
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  // Tant que le site est provisoire, il reste fermé aux moteurs de recherche.
  robots: siteConfig.provisoire
    ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
    : { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0c',
  colorScheme: 'dark',
}

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${siteConfig.url}/#business`,
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  telephone: siteConfig.phone.e164,
  ...(isSet(siteConfig.email) ? { email: siteConfig.email } : {}),
  areaServed: siteConfig.serviceArea.departments.map((code) => ({
    '@type': 'AdministrativeArea',
    name: `Département ${code}`,
  })),
  priceRange: '€€€',
  openingHours: 'Mo-Su 00:00-23:59',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Carte bancaire, espèces',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#contenu"
          className="bg-gold text-ink sr-only z-[100] rounded-full px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <WhatsAppFloating />
        <JsonLd data={localBusiness} />
      </body>
    </html>
  )
}
