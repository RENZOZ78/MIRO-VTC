/**
 * Configuration Next.js (version JavaScript).
 *
 * Next.js lit next.config.js, puis next.config.mjs, puis next.config.ts : ce
 * fichier est donc prioritaire sur next.config.ts, qui est conservé tel quel.
 * Il existe parce que l'hébergement Hostinger (glibc trop ancienne) ne peut pas
 * charger le compilateur natif SWC : la configuration TypeScript y échoue, alors
 * qu'un fichier JavaScript se charge sans transpilation.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ]
  },
}

export default nextConfig
