import type { ZodError } from 'zod'

export function jsonError(status: number, error: string, extra: Record<string, unknown> = {}): Response {
  return Response.json({ error, ...extra }, { status })
}

/** Lit un corps JSON ; renvoie null si absent ou invalide. */
export async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json()
  } catch {
    return null
  }
}

/** Premier message d'erreur lisible d'une validation zod. */
export function firstIssue(error: ZodError): string {
  const issue = error.issues[0]
  if (!issue) return 'Données invalides'
  const path = issue.path.filter((p) => typeof p === 'string').join('.')
  return path ? `${path} : ${issue.message}` : issue.message
}
