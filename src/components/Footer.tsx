import Link from 'next/link'
import { destinations } from '@/config/destinations'
import { isSet, navigation, siteConfig } from '@/config/site'
import { Logo } from '@/components/Logo'

export function Footer() {
  return (
    <footer className="border-line bg-ink-2/60 mt-24 border-t">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="text-mist mt-6 max-w-sm text-sm leading-relaxed">{siteConfig.description}</p>
          <p className="text-mist mt-4 text-sm">{siteConfig.hours}</p>
        </div>

        <div>
          <h2 className="eyebrow font-sans text-[11px]">Navigation</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-cream/85 hover:text-gold-2">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/reservation" className="text-cream/85 hover:text-gold-2">
                Réservation
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow font-sans text-[11px]">Destinations</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {destinations.map((d) => (
              <li key={d.slug}>
                <Link href={`/vtc/${d.slug}`} className="text-cream/85 hover:text-gold-2">
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow font-sans text-[11px]">Contact</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a href={`tel:${siteConfig.phone.e164}`} className="text-cream/85 hover:text-gold-2">
                {siteConfig.phone.display}
              </a>
            </li>
            <li>
              {isSet(siteConfig.email) ? (
                <a href={`mailto:${siteConfig.email}`} className="text-cream/85 hover:text-gold-2">
                  {siteConfig.email}
                </a>
              ) : (
                <span className="placeholder">{siteConfig.email}</span>
              )}
            </li>
            <li className="text-mist">{siteConfig.serviceArea.label}</li>
          </ul>
          <ul className="text-mist mt-8 space-y-2 text-xs">
            <li>
              <Link href="/mentions-legales" className="hover:text-gold-2">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/cgv" className="hover:text-gold-2">
                Conditions générales de vente
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="hover:text-gold-2">
                Confidentialité
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-line border-t">
        <div className="container-x text-mist-2 flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
          </span>
          <span>Transport de personnes à titre onéreux — exploitant VTC.</span>
        </div>
      </div>
    </footer>
  )
}
