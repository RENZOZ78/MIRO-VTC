import type { MetadataRoute } from 'next'
import { destinations } from '@/config/destinations'
import { siteConfig } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url
  const lastModified = new Date()
  const statics: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/reservation`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/services`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tarifs`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${base}/mentions-legales`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/cgv`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/confidentialite`, lastModified, changeFrequency: 'yearly', priority: 0.2 },
  ]
  const locals: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${base}/vtc/${d.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))
  return [...statics, ...locals]
}
