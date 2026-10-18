import { lazy, Suspense, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/projects'
import './Projects.css'

// Loaded only when a project page needs it, so the demo's code isn't in everyone's first download
const TextGeneratorDemo = lazy(() => import('../demos/TextGeneratorDemo'))

function Project() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)
  const frameRef = useRef<HTMLIFrameElement>(null)

  if (!project) {
    return (
      <section id="project">
        <h1>Project not found</h1>
        <Link to="/portfolio">Back to Projects</Link>
      </section>
    )
  }

  return (
    <section id="project">
      <Link to="/portfolio" className="back-link">← Back to Projects</Link>
      <h1>{project.title}</h1>
      <span className="status">{project.status}</span>
      {project.tech && (
        <ul className="tech-list" aria-label="Built with">
          {project.tech.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      )}

      {project.demo === 'text-generator' && (
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

      {project.kind !== 'software' && (
        <div className="game-stage">
          {project.buildUrl ? (
            <iframe
              ref={frameRef}
              className="game-frame"
              src={project.buildUrl}
              title={project.title}
              allow="autoplay; fullscreen; gamepad"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="game-frame placeholder">Web build coming soon</div>
          )}
        </div>
      )}

      {project.buildUrl && (
        <button type="button" className="counter" onClick={() => frameRef.current?.requestFullscreen()}>
          Fullscreen
        </button>
      )}

      {project.screenshots && (
        <div className="project-screenshots">
          {project.screenshots.map((src) => (
            <img key={src} src={src} alt={`${project.title} screenshot`} loading="lazy" />
          ))}
        </div>
      )}

      <div className="project-about">
        <h2>About</h2>
        <p>{project.description}</p>
      </div>
    </section>
  )
}

export default Project
