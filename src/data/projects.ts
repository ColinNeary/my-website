// Everything on the Projects page: games, software, anything else. Each entry becomes a card on /portfolio
// and its own page at /portfolio/<slug>. (The URL is still /portfolio so older links keep working.)
export interface Project {
  slug: string // used in the URL: /portfolio/<slug>
  title: string
  description: string
  status: string
  // What sort of project this is. 'game' (the default) shows the playable build, or a placeholder until
  // one exists. 'software' has nothing to play in a browser, so its page skips the game frame.
  kind?: 'game' | 'software'
  // Games only: path to the web build's entry HTML, served from public/.
  // Leave undefined until a build exists so the page shows a placeholder.
  buildUrl?: string
  // Card image on the Projects page (shown at 4:3), served from public/
  thumbnail?: string
  // Technologies used, shown as small tags on the project page
  tech?: string[]
  // Extra images for the project page, served from public/
  screenshots?: string[]
  // An interactive demo built into the site, shown above the description (see src/demos/)
  demo?: 'text-generator'
}

export const projects: Project[] = [
  {
    slug: 'skribble-n-skram',
    title: "Skribble 'N Skram",
    description: 'My first video game, intended to be a commercial indie product, but we decided to stop at the alpha. We built it in Godot using GDScript with the Steamworks API extension. I led development while building the enemy AI systems using behavior trees and state machines.',
    status: 'Finished alpha, discontinued',
    buildUrl: '/games/skribble-n-skram/index.html',
    thumbnail: '/images/skribble-n-skram.png',
  },
  {
    slug: 'cat-ball',
    title: 'Cat ball and the ball is a cat',
    description: 'This project was our shot at making a small scale game for a quick commercial release. This game was also built in Godot using GDScript. I implemented a perk-unlock system, UI/UX design, and theory-crafted items and systems. Some dev controls: \n1- adds 5 seconds, \n2- skips to shop, \n3- controls catball, \n5- adds 5 coins, SPACE- skips intro.',
    status: 'Finished alpha',
    buildUrl: '/games/cat-ball/index.html',
    thumbnail: '/images/cat-ball.png',
  },
  {
    slug: 'text-generator-ai',
    title: 'Text Generator AI',
    description: "My Senior Project course final. A JavaFX desktop app backed by MySQL that imports text files and uses word and word-pair statistics for autocomplete and text generation (Markov chains and beam search). Built with a team of six for my UT Dallas senior project class. I designed the MySQL schema the whole app runs on, covering word counts and word-pair frequencies, and wrote the text-parsing code that populated it.",
    status: 'Senior project, Fall 2025',
    kind: 'software',
    tech: ['Java', 'JavaFX', 'MySQL', 'Maven', 'Python'],
    demo: 'text-generator',
  },
]
