import { JsonLd } from '@/components/JsonLd'

export type FaqItem = { question: string; answer: string }

export function Faq({ items, title = 'Questions fréquentes' }: { items: FaqItem[]; title?: string }) {
  return (
    <section className="container-x mt-24">
      <div className="max-w-2xl">
        <p className="eyebrow">FAQ</p>
        <h2 className="mt-4 text-4xl sm:text-5xl">{title}</h2>
      </div>
      <div className="border-line mt-10 divide-y border-y">
        {items.map((item) => (
          <details key={item.question} className="group divide-line py-5">
            <summary className="text-cream flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium">
              {item.question}
              <span className="text-gold transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <p className="text-mist mt-3 max-w-3xl leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((i) => ({
            '@type': 'Question',
            name: i.question,
            acceptedAnswer: { '@type': 'Answer', text: i.answer },
          })),
        }}
      />
    </section>
  )
}
