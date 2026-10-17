import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { games } from '../data/games'
import './Portfolio.css'

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
