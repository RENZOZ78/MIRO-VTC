import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'
import { PageHeader } from '@/components/PageHeader'
import { isSet, siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Contactez ${siteConfig.name}, chauffeur privé en Île-de-France : devis de mise à disposition, question sur une réservation, demande entreprise.`,
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Parlons de votre trajet."
        lead="Un devis de mise à disposition, une question sur une réservation, un besoin récurrent pour votre entreprise : écrivez-nous ou appelez-nous."
      />
      <section className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-8">
          <div>
            <p className="eyebrow">Téléphone</p>
            <a href={`tel:${siteConfig.phone.e164}`} className="font-display mt-2 block text-4xl">
              {siteConfig.phone.display}
            </a>
            <p className="text-mist mt-1 text-sm">{siteConfig.hours}</p>
          </div>
          {siteConfig.whatsapp && (
            <div>
              <p className="eyebrow">WhatsApp</p>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                className="btn-ghost mt-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                Écrire sur WhatsApp
              </a>
            </div>
          )}
          <div>
            <p className="eyebrow">E-mail</p>
            {isSet(siteConfig.email) ? (
              <a href={`mailto:${siteConfig.email}`} className="text-cream mt-2 block text-lg">
                {siteConfig.email}
              </a>
            ) : (
              <p className="mt-2">
                <span className="placeholder">{siteConfig.email}</span>
              </p>
            )}
          </div>
          <div>
            <p className="eyebrow">Zone desservie</p>
            <p className="text-cream mt-2">{siteConfig.serviceArea.label}</p>
            <ul className="text-mist mt-2 space-y-1 text-sm">
              {siteConfig.serviceArea.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  )
}
