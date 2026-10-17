import { Link } from 'react-router-dom'
import { games } from '../data/games'
import './Portfolio.css'

function Portfolio() {
  return (
    <section id="portfolio">
      <h1>Projects</h1>
      <p className="portfolio-intro">Projects I've made or helped make. Most are unfinished so expect rough edges.</p>

      <div className="game-grid">
        {games.map((game) => (
          <Link key={game.slug} to={`/portfolio/${game.slug}`} className="game-card">
            {game.thumbnail ? (
              <img className="game-thumb" src={game.thumbnail} alt="" />
            ) : (
              <div className="game-thumb placeholder">{game.title}</div>
            )}
            <div className="game-card-body">
              <h2>{game.title}</h2>
              <span className="status">{game.status}</span>
              <p>{game.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Portfolio
