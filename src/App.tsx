import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Game from './pages/Game'
import Weeklies from './pages/Weeklies'

function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<Game />} />
          <Route path="/weeklies" element={<Weeklies />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App
