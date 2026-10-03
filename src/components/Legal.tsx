import type { ReactNode } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { isSet } from '@/config/site'

/** Affiche une valeur de configuration, ou un placeholder visible si elle n'est pas renseignée. */
export function Value({ v }: { v: string }) {
  return isSet(v) ? <>{v}</> : <span className="placeholder">{v}</span>
}

export function LegalLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string
  title: string
  updated: string
  children: ReactNode
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} lead={`Dernière mise à jour : ${updated}`} />
      <section className="container-x">
        <div
          role="note"
          className="border-gold/40 bg-gold/10 text-gold-2 mb-10 max-w-3xl rounded-xl border px-5 py-4 text-sm leading-relaxed"
        >
          <strong>Modèle de document.</strong> Ce texte est une base de travail générée pour {eyebrow.toLowerCase()} ;
          il n’a pas été validé par un professionnel du droit. Les mentions{' '}
          <span className="placeholder">À COMPLÉTER</span> doivent être renseignées dans{' '}
          <code>src/config/site.ts</code> avant la mise en ligne.
        </div>
        <div className="prose-legal max-w-3xl">{children}</div>
      </section>
    </>
  )
}
