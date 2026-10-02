import Link from 'next/link'
import { destinations } from '@/config/destinations'

export function DestinationsGrid({ exclude }: { exclude?: string }) {
  const list = destinations.filter((d) => d.slug !== exclude)
  return (
    <section className="container-x mt-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="eyebrow">Destinations</p>
          <h2 className="mt-4 text-4xl sm:text-5xl">Partout en Île-de-France.</h2>
        </div>
        <Link href="/tarifs" className="btn-link">
          Voir les forfaits →
        </Link>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((d) => (
          <li key={d.slug}>
            <Link href={`/vtc/${d.slug}`} className="card card-hover block h-full p-6">
              <p className="text-mist text-xs tracking-[0.2em] uppercase">VTC</p>
              <h3 className="mt-2 text-2xl leading-tight">{d.name}</h3>
              <p className="text-mist mt-3 text-sm">{d.kicker}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
