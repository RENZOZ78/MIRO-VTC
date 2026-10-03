import type { Metadata } from 'next'
import { ContactForm, type ContactFormLabels } from '@/components/ContactForm'
import { PageHeader } from '@/components/PageHeader'
import { WhatsAppLink } from '@/components/WhatsAppButton'
import { isSet, siteConfig } from '@/config/site'
import { contactTopics, type ContactTopic } from '@/lib/booking'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Contact ${siteConfig.name}, private chauffeur in the Paris region: hourly hire quote, question about a booking, business request.`,
  alternates: { canonical: '/en/contact', languages: { fr: '/contact', en: '/en/contact' } },
}

const labels: ContactFormLabels = {
  topic: 'Subject',
  topics: {
    particulier: 'Booking or question',
    entreprise: 'Business / concierge account',
    disposition: 'Hourly hire, event',
    longue: 'Long distance',
    autre: 'Other request',
  },
  company: 'Company (optional)',
  name: 'Name',
  email: 'Email',
  phone: 'Phone (optional)',
  message: 'Message',
  messagePlaceholder: 'Journey, date, number of passengers, special request…',
  hint: 'Reply within a few hours, 7 days a week.',
  submit: 'Send',
  sending: 'Sending…',
  sentEyebrow: 'Message sent',
  sentTitle: 'Thank you, we will get back to you shortly.',
  sentText: 'For an urgent request, call',
  callUs: 'Call',
}

const areaEn = ['Paris and inner suburbs', 'Roissy-CDG, Orly and Beauvais airports', 'Paris railway stations', 'Versailles, La Défense, Disneyland Paris']

export default async function ContactPageEn({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams
  const defaultTopic: ContactTopic = topic && topic in contactTopics ? (topic as ContactTopic) : 'particulier'
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let’s talk about your journey."
        lead="A quote for hourly hire, a question about a booking, a recurring need for your company: write to us or call us."
      />
      <section className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-8">
          <div>
            <p className="eyebrow">Phone</p>
            <a href={`tel:${siteConfig.phone.e164}`} className="font-display mt-2 block text-4xl">
              {siteConfig.phone.display}
            </a>
            <p className="text-mist mt-1 text-sm">7 days a week, 24 h by reservation</p>
          </div>
          {siteConfig.whatsapp && (
            <div>
              <p className="eyebrow">WhatsApp</p>
              <div className="mt-3">
                <WhatsAppLink>Message us on WhatsApp</WhatsAppLink>
              </div>
            </div>
          )}
          <div>
            <p className="eyebrow">Email</p>
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
            <p className="eyebrow">Service area</p>
            <p className="text-cream mt-2">Paris and Île-de-France</p>
            <ul className="text-mist mt-2 space-y-1 text-sm">
              {areaEn.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
        <ContactForm defaultTopic={defaultTopic} labels={labels} />
      </section>
    </>
  )
}
