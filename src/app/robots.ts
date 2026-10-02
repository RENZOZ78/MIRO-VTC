import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  // Site provisoire : fermé à tous les robots d'indexation.
  if (siteConfig.provisoire) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/reservation/confirmation', '/reservation/annulation'] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
