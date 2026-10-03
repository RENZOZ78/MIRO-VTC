import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
        style={{
          background:
            'radial-gradient(700px 320px at 20% 0%, rgba(201,163,90,0.14), transparent 65%), radial-gradient(500px 260px at 90% 20%, rgba(231,211,161,0.07), transparent 60%)',
        }}
      />
      <div className="container-x relative">
        <p className="eyebrow animate-rise">{eyebrow}</p>
        <h1 className="animate-rise-delay mt-4 max-w-3xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h1>
        {lead && <div className="lead animate-rise-delay-2 mt-6 max-w-2xl">{lead}</div>}
        {children && <div className="animate-rise-delay-2 mt-8">{children}</div>}
      </div>
    </section>
  )
}
