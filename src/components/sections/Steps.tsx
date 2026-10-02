const steps = [
  { title: 'Votre trajet', text: 'Départ, arrivée, date et heure. Le prix s’affiche aussitôt, calculé sur l’itinéraire réel.' },
  { title: 'Votre véhicule', text: 'Choisissez l’Audi Q8 et les options utiles : siège enfant, accueil en aérogare.' },
  { title: 'Vos coordonnées', text: 'Confirmez, réglez en ligne si vous le souhaitez, et recevez votre confirmation par e-mail.' },
]

export function Steps() {
  return (
    <section className="container-x mt-24">
      <div className="max-w-2xl">
        <p className="eyebrow">Réservation</p>
        <h2 className="mt-4 text-4xl sm:text-5xl">Trois étapes, deux minutes.</h2>
      </div>
      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="relative">
            <span className="font-display text-gold/40 text-7xl leading-none">{i + 1}</span>
            <h3 className="mt-2 text-2xl">{s.title}</h3>
            <p className="text-mist mt-3 text-sm leading-relaxed">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
