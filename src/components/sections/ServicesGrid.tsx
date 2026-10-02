import Link from 'next/link'
import { services } from '@/config/services'

export function ServicesGrid({ withIntro = true }: { withIntro?: boolean }) {
  return (
    <section className="container-x mt-24" id="services">
      {withIntro && (
        <div className="max-w-2xl">
          <p className="eyebrow">Services</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Un chauffeur pour chaque moment.</h2>
          <p className="lead mt-5">
            Du transfert aéroport à la journée de mise à disposition, le même soin et le même véhicule.
          </p>
        </div>
      )}
      <div className={`grid gap-5 md:grid-cols-2 lg:grid-cols-3 ${withIntro ? 'mt-12' : ''}`}>
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/services#${s.slug}`}
            className="card card-hover group flex flex-col p-7"
          >
            <span className="divider-gold" />
            <h3 className="mt-5 text-2xl">{s.title}</h3>
            <p className="text-mist mt-3 flex-1 text-sm leading-relaxed">{s.short}</p>
            <span className="btn-link mt-6">
              En savoir plus <span className="transition group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
