export interface Game {
  slug: string // used in the URL: /portfolio/<slug>
  title: string
  description: string
  status: string
  // Path to the web build's entry HTML, served from public/.
  // Leave undefined until a build exists so the page shows a placeholder.
  buildUrl?: string
  thumbnail?: string
}

export const games: Game[] = [
  {
    slug: 'skribble-n-skram',
    title: 'Skribble N Skram',
    description: 'Description coming soon.',
    status: 'In development',
    // buildUrl: '/games/skribble-n-skram/index.html',
  },
]
