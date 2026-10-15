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
    title: "Skribble 'N Skram",
    description: 'A commercial indie game built in Godot with gdscript and the Steamworks API. I led development and built the enemy AI using behavior trees and state machines.',
    status: 'Finished alpha, discontinued',
    buildUrl: '/games/skribble-n-skram/index.html',
    thumbnail: '/images/skribble-n-skram.png',
  },
  {
    slug: 'cat-ball',
    title: 'Cat ball and the ball is a cat',
    description: 'Commercial indie game built in Godot using GDScript. I implemented a perk-unlock system, UI/UX design, and theory-crafted items and systems.',
    status: 'Finished alpha',
    buildUrl: '/games/cat-ball/index.html',
    thumbnail: '/images/cat-ball.png',
  },
]
