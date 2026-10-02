import { ImageResponse } from 'next/og'
import { siteConfig } from '@/config/site'

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background:
            'radial-gradient(900px 420px at 15% 10%, rgba(201,163,90,0.22), transparent 65%), #0a0a0c',
          color: '#f4f1ea',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              border: '2px solid #c9a35a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              color: '#e7d3a1',
            }}
          >
            M
          </div>
          <div style={{ fontSize: 30, letterSpacing: 8 }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 24, color: '#c9a35a', letterSpacing: 6, textTransform: 'uppercase' }}>
            {siteConfig.tagline}
          </div>
          <div style={{ fontSize: 76, lineHeight: 1.05, marginTop: 18 }}>Le trajet devient un moment.</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#a8a295' }}>
          <span>Audi Q8 hybrides · Prix fixé à l’avance</span>
          <span>{siteConfig.phone.display}</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
