'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { Place } from '@/lib/geo'

type Props = {
  id: string
  label: string
  placeholder?: string
  value: Place | null
  onChange: (place: Place | null) => void
  autoFocus?: boolean
}

/** Champ d'adresse avec autocomplétion (Géoplateforme IGN via /api/geo/search). */
export function AddressInput({ id, label, placeholder, value, onChange, autoFocus }: Props) {
  const [text, setText] = useState(value?.label ?? '')
  const [suggestions, setSuggestions] = useState<Place[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listId = useId()
  const abortRef = useRef<AbortController | null>(null)

  // Quand le parent change la valeur (ex. réinitialisation), on aligne le texte saisi.
  const [lastValue, setLastValue] = useState(value)
  if (value !== lastValue) {
    setLastValue(value)
    setText(value?.label ?? '')
  }

  useEffect(() => {
    const q = text.trim()
    if (q.length < 3 || q === value?.label) return
    const timer = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/geo/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        const data = (await res.json()) as { places?: Place[]; error?: string }
        if (!res.ok) throw new Error(data.error ?? 'Service indisponible')
        setSuggestions(data.places ?? [])
        setOpen(true)
        setActive(-1)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message)
          setSuggestions([])
        }
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => clearTimeout(timer)
  }, [text, value?.label])

  function select(place: Place) {
    onChange(place)
    setText(place.label)
    setOpen(false)
    setSuggestions([])
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault()
      select(suggestions[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          className="input pr-10"
          placeholder={placeholder}
          value={text}
          autoComplete="off"
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          onChange={(e) => {
            setText(e.target.value)
            if (e.target.value.trim().length < 3) setSuggestions([])
            if (value) onChange(null)
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
        />
        <span className="absolute inset-y-0 right-3 flex items-center" aria-hidden>
          {loading ? (
            <span className="border-gold h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
          ) : value ? (
            <span className="text-success text-lg">✓</span>
          ) : null}
        </span>
      </div>
      {error && <p className="text-danger mt-1.5 text-xs">{error}</p>}
      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="card absolute z-30 mt-2 max-h-72 w-full overflow-auto p-1"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.label}-${i}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault()
                select(s)
              }}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer rounded-xl px-3 py-2.5 text-sm ${
                i === active ? 'bg-gold/15 text-cream' : 'text-cream/85'
              }`}
            >
              <span className="block">{s.name ?? s.label}</span>
              {(s.postcode || s.city) && (
                <span className="text-mist block text-xs">
                  {[s.postcode, s.city].filter(Boolean).join(' ')}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
