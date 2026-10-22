import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Project from './pages/Project'
import Weeklies from './pages/Weeklies'
import Gallery from './pages/Gallery'
import Resume from './pages/Resume'

function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* The Projects pages keep the old /portfolio URL so existing links still work */}
          <Route path="/portfolio" element={<Projects />} />
          <Route path="/portfolio/:slug" element={<Project />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/weeklies" element={<Weeklies />} />
          <Route path="/resume" element={<Resume />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App
