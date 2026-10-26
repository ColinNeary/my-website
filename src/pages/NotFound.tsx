import { Link } from 'react-router-dom'
import { usePageTitle } from '../usePageTitle'
import './NotFound.css'

function NotFound() {
  usePageTitle('Page not found', { noindex: true })

  return (
    <section id="not-found">
      <h1>Page not found</h1>
      <p>That page doesn't exist, or it may have moved.</p>
      <div className="hero-actions">
        <Link to="/" className="button primary">Go home</Link>
        <Link to="/portfolio" className="button">See my projects</Link>
      </div>
    </section>
  )
}

export default NotFound
