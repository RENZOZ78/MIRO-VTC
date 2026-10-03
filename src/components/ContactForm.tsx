'use client'

import { useState } from 'react'
import { siteConfig } from '@/config/site'
import type { ContactTopic } from '@/lib/booking'

export type ContactFormLabels = {
  topic: string
  topics: Record<ContactTopic, string>
  company: string
  name: string
  email: string
  phone: string
  message: string
  messagePlaceholder: string
  hint: string
  submit: string
  sending: string
  sentEyebrow: string
  sentTitle: string
  sentText: string
  callUs: string
}

export const contactLabelsFr: ContactFormLabels = {
  topic: 'Objet',
  topics: {
    particulier: 'Réservation ou question',
    entreprise: 'Compte entreprise / conciergerie',
    disposition: 'Mise à disposition, événement',
    longue: 'Longue distance',
    autre: 'Autre demande',
  },
  company: 'Société (facultatif)',
  name: 'Nom',
  email: 'E-mail',
  phone: 'Téléphone (facultatif)',
  message: 'Message',
  messagePlaceholder: 'Trajet souhaité, date, nombre de passagers, demande particulière…',
  hint: 'Réponse sous quelques heures, 7j/7.',
  submit: 'Envoyer',
  sending: 'Envoi…',
  sentEyebrow: 'Message envoyé',
  sentTitle: 'Merci, nous revenons vers vous rapidement.',
  sentText: 'Pour une demande urgente, appelez le',
  callUs: 'Appeler',
}

export function ContactForm({
  defaultTopic = 'particulier',
  labels = contactLabelsFr,
}: {
  defaultTopic?: ContactTopic
  labels?: ContactFormLabels
}) {
  const [form, setForm] = useState({
    topic: defaultTopic,
    company: '',
    name: '',
    email: '',
    phone: '',
    message: '',
    website: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const showCompany = form.topic === 'entreprise'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, company: form.company || undefined }),
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
        <p className="eyebrow">{labels.sentEyebrow}</p>
        <h2 className="mt-3 text-3xl">{labels.sentTitle}</h2>
        <p className="text-mist mt-4">
          {labels.sentText}{' '}
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
        <div className={showCompany ? '' : 'sm:col-span-2'}>
          <label htmlFor="c-topic" className="label">
            {labels.topic}
          </label>
          <select
            id="c-topic"
            className="input"
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value as ContactTopic })}
          >
            {(Object.keys(labels.topics) as ContactTopic[]).map((key) => (
              <option key={key} value={key}>
                {labels.topics[key]}
              </option>
            ))}
          </select>
        </div>
        {showCompany && (
          <div>
            <label htmlFor="c-company" className="label">
              {labels.company}
            </label>
            <input
              id="c-company"
              className="input"
              autoComplete="organization"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
        )}
        <div>
          <label htmlFor="c-name" className="label">
            {labels.name}
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
            {labels.email}
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
            {labels.phone}
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
            {labels.message}
          </label>
          <textarea
            id="c-message"
            className="input min-h-36"
            required
            minLength={10}
            maxLength={3000}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={labels.messagePlaceholder}
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
        <p className="text-mist text-xs">{labels.hint}</p>
        <button type="submit" className="btn-gold" disabled={status === 'sending'}>
          {status === 'sending' ? labels.sending : labels.submit}
        </button>
      </div>
    </form>
  )
}
