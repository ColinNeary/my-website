import { Link, NavLink } from 'react-router-dom'
import ThemeMenu from './ThemeMenu'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/portfolio' },
  { label: 'Weeklies', to: '/weeklies' },
]

function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-name">Colin Neary</Link>
      <nav className="nav">
        {navLinks.map((link) => (
          // `end` keeps Home from matching every route
          <NavLink key={link.to} to={link.to} end={link.to === '/'}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <ThemeMenu />
    </header>
  )
}

export default Header
