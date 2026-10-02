const pillars = [
  {
    title: 'Ponctualité',
    text: 'Votre chauffeur est en place avant l’heure, trafic et vols suivis en temps réel. Vous ne regardez plus votre montre.',
  },
  {
    title: 'Prix fixé à l’avance',
    text: 'Le tarif est calculé sur l’itinéraire réel et affiché avant de réserver. Il ne bouge plus, même dans les embouteillages.',
  },
  {
    title: 'Confort et discrétion',
    text: 'Audi Q8 hybrides, sièges cuir, silence électrique en ville. Tenue sobre, conversation si vous le souhaitez, jamais imposée.',
  },
  {
    title: 'Disponibilité',
    text: 'Sept jours sur sept, de jour comme de nuit, sur réservation. Pour l’immédiat, un appel suffit.',
  },
]

export function Pillars() {
  return (
    <section className="container-x mt-8 sm:mt-16">
      <div className="grid gap-px overflow-hidden rounded-2xl" style={{ background: 'var(--color-line)' }}>
        <div className="bg-ink grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: 'var(--color-line)' }}>
          {pillars.map((p, i) => (
            <article key={p.title} className="bg-ink-2/90 p-7">
              <span className="font-display text-gold/70 text-sm">0{i + 1}</span>
              <h2 className="mt-3 text-2xl">{p.title}</h2>
              <p className="text-mist mt-3 text-sm leading-relaxed">{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
