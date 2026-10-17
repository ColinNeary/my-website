export interface Game {
  slug: string // used in the URL: /portfolio/<slug>
  title: string
  description: string
  status: string
  // 'game' (the default) shows the playable build, or a placeholder until one exists.
  // 'software' has nothing to play in a browser, so its page skips the game frame.
  kind?: 'game' | 'software'
  // Path to the web build's entry HTML, served from public/.
  // Leave undefined until a build exists so the page shows a placeholder.
  buildUrl?: string
  thumbnail?: string
  // Technologies used, shown as small tags on the project page
  tech?: string[]
  // Extra images for the project page, served from public/
  screenshots?: string[]
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
    description: 'Commercial indie game built in Godot using GDScript. I implemented a perk-unlock system, UI/UX design, and theory-crafted items and systems. Some dev controls: 1- adds 5 seconds, 2- skips to shop, 3- controls catball, 5- adds 5 coins, SPACE- skips intro.',
    status: 'Finished alpha',
    buildUrl: '/games/cat-ball/index.html',
    thumbnail: '/images/cat-ball.png',
  },
  {
    slug: 'text-generator-ai',
    title: 'Text Generator AI',
    description: "A JavaFX desktop app backed by MySQL that imports text files and builds word and word-pair statistics for autocomplete and text generation. Built with a team of six for UT Dallas's senior project class. I designed the database schema and built the text-parsing import that fills it, and helped refactor and optimize the code.",
    status: 'Senior project, Fall 2025',
    kind: 'software',
    tech: ['Java', 'JavaFX', 'MySQL', 'Maven'],
  },
]
