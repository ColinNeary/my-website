import { lazy, Suspense, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { games } from '../data/games'
import './Portfolio.css'

// Loaded only when a project page needs it, so the demo's code isn't in everyone's first download
const TextGeneratorDemo = lazy(() => import('../demos/TextGeneratorDemo'))

function Game() {
  const { slug } = useParams()
  const game = games.find((g) => g.slug === slug)
  const frameRef = useRef<HTMLIFrameElement>(null)

  if (!game) {
    return (
      <section id="game">
        <h1>Project not found</h1>
        <Link to="/portfolio">Back to Projects</Link>
      </section>
    )
  }

  return (
    <section id="game">
      <Link to="/portfolio" className="back-link">← Back to Projects</Link>
      <h1>{game.title}</h1>
      <span className="status">{game.status}</span>
      {game.tech && (
        <ul className="tech-list" aria-label="Built with">
          {game.tech.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      )}

      {game.demo === 'text-generator' && (
        <div className="demo-section">
          <h2>Try it</h2>
          <p className="demo-intro">
            A re-creation of the app's main features that runs entirely in your browser. The real app is a JavaFX
            desktop program backed by MySQL; this version keeps its data in memory instead, and it's a fresh
            implementation, not my teammates' code.
          </p>
          <Suspense fallback={<p>Loading the demo...</p>}>
            <TextGeneratorDemo />
          </Suspense>
        </div>
      )}

      {game.kind !== 'software' && (
        <div className="game-stage">
          {game.buildUrl ? (
            <iframe
              ref={frameRef}
              className="game-frame"
              src={game.buildUrl}
              title={game.title}
              allow="autoplay; fullscreen; gamepad"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="game-frame placeholder">Web build coming soon</div>
          )}
        </div>
      )}

      {game.buildUrl && (
        <button type="button" className="counter" onClick={() => frameRef.current?.requestFullscreen()}>
          Fullscreen
        </button>
      )}

      {game.screenshots && (
        <div className="game-screenshots">
          {game.screenshots.map((src) => (
            <img key={src} src={src} alt={`${game.title} screenshot`} loading="lazy" />
          ))}
        </div>
      )}

      <div className="game-about">
        <h2>About</h2>
        <p>{game.description}</p>
      </div>
    </section>
  )
}

export default Game
