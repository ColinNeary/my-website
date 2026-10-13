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
        <h1>Game not found</h1>
        <Link to="/portfolio">Back to Portfolio</Link>
      </section>
    )
  }

  return (
    <section id="game">
      <Link to="/portfolio" className="back-link">← Back to Portfolio</Link>
      <h1>{game.title}</h1>
      <span className="status">{game.status}</span>

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

      {game.buildUrl && (
        <button type="button" className="counter" onClick={() => frameRef.current?.requestFullscreen()}>
          Fullscreen
        </button>
      )}

      <div className="game-about">
        <h2>About</h2>
        <p>{game.description}</p>
      </div>
    </section>
  )
}

export default Game
