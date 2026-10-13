import { Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import './App.css'
import NavOption from './components/NavOption'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Game from './pages/Game'
import Weeklies from './pages/Weeklies'

function App() {
  const NavOptions = [
    {label_text:'Home', destination:'/'},
    {label_text:'Portfolio', destination:'/portfolio'},
    {label_text:'Weeklies', destination:'/weeklies'}
   ]

  return (
    <>
      <header>
        <nav id="nav" className="nav">
          <img src={reactLogo} className="framework" alt="React logo" />
          <>
            {NavOptions.map((option) => (
              <NavOption
              key={option.label_text}
              label_text={option.label_text}
              destination={option.destination} />
            ))}
          </>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<Game />} />
          <Route path="/weeklies" element={<Weeklies />} />
        </Routes>
      </main>

      <footer>
        <p>Sample footer content</p>
      </footer>
    </>
  )
}

export default App
