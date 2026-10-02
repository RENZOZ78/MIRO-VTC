'use client'

import { useState } from 'react'
import { siteConfig } from '@/config/site'

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', website: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Envoi impossible')
      setStatus('sent')
    } catch (err) {
      setError((err as Error).message)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="card p-8 text-center">
        <p className="eyebrow">Message envoyé</p>
        <h2 className="mt-3 text-3xl">Merci, nous revenons vers vous rapidement.</h2>
        <p className="text-mist mt-4">
          Pour une demande urgente, appelez le{' '}
          <a href={`tel:${siteConfig.phone.e164}`} className="text-gold-2">
            {siteConfig.phone.display}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">
            Nom
          </label>
          <input
            id="c-name"
            className="input"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="c-email" className="label">
            E-mail
          </label>
          <input
            id="c-email"
            type="email"
            className="input"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="c-phone" className="label">
            Téléphone (facultatif)
          </label>
          <input
            id="c-phone"
            type="tel"
            className="input"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="c-message" className="label">
            Message
          </label>
          <textarea
            id="c-message"
            className="input min-h-36"
            required
            minLength={10}
            maxLength={3000}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Trajet souhaité, date, nombre de passagers, demande particulière…"
          />
        </div>
      </div>
      <div className="hidden" aria-hidden>
        <label>
          Site web
          <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        </label>
      </div>
      {error && (
        <p role="alert" className="text-danger text-sm">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-mist text-xs">Réponse sous quelques heures, 7j/7.</p>
        <button type="submit" className="btn-gold" disabled={status === 'sending'}>
          {status === 'sending' ? 'Envoi…' : 'Envoyer'}
        </button>
      </div>
    </form>
  )
}
