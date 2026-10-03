/**
 * Photos du site. Les fichiers sont attendus dans public/images/ ; tant
 * qu'un fichier manque, les composants affichent leur rendu de secours
 * (dégradés et illustration), sans erreur.
 *
 * Module serveur uniquement (accès au système de fichiers).
 */
import fs from 'node:fs'
import path from 'node:path'

export const siteImages = {
  /** Accueil : SUV de nuit devant une façade parisienne (16:9). */
  hero: { file: 'hero.jpg', alt: 'SUV noir premium de nuit devant un immeuble parisien' },
  /** Section flotte : habitacle arrière (3:2). */
  interior: { file: 'interieur.jpg', alt: 'Habitacle arrière cuir noir avec éclairage d’ambiance doré' },
  /** Transferts aéroport : chauffeur avec pancarte d’accueil (3:2). */
  airport: { file: 'aeroport.jpg', alt: 'Chauffeur privé attendant un passager en aérogare' },
  /** Page Entreprises : SUV au pied d’une tour de bureaux (16:9). */
  business: { file: 'entreprises.jpg', alt: 'Chauffeur ouvrant la portière à un passager devant des bureaux' },
} as const

export type SiteImageKey = keyof typeof siteImages

const cache = new Map<string, boolean>()

/** URL publique de la photo si le fichier existe, sinon null. */
export function publicImage(key: SiteImageKey): { src: string; alt: string } | null {
  const { file, alt } = siteImages[key]
  if (!cache.has(file)) {
    cache.set(file, fs.existsSync(path.join(process.cwd(), 'public', 'images', file)))
  }
  return cache.get(file) ? { src: `/images/${file}`, alt } : null
}
