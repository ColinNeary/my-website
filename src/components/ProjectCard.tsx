import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

// One card on the Projects page. If the project has a `preview` clip, it plays over the thumbnail
// while the card is hovered or has keyboard focus.
function ProjectCard({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [wanted, setWanted] = useState(false) // true after the first hover; only then does the clip start downloading
  const [hovering, setHovering] = useState(false)
  const [showing, setShowing] = useState(false) // true once the clip is really playing, so it can fade in

  function start() {
    // Touch screens have no hover, and some visitors ask for less motion: skip the clip for them
    if (!project.preview || window.matchMedia(REDUCED_MOTION).matches) return
    setWanted(true)
    setHovering(true)
  }

  function stop() {
    setHovering(false)
    setShowing(false)
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (hovering) {
      // Browsers can still refuse to play; if so the thumbnail simply stays put
      video.play().catch(() => {})
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [hovering, wanted])

  return (
    <Link
      to={`/portfolio/${project.slug}`}
      className="project-card"
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
    >
      <div className="project-media">
        {project.thumbnail ? (
          <img className="project-thumb" src={project.thumbnail} alt="" />
        ) : (
          <div className="project-thumb placeholder">{project.title}</div>
        )}
        {project.preview && (
          <video
            ref={videoRef}
            className={showing ? 'project-preview showing' : 'project-preview'}
            src={wanted ? project.preview : undefined}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setShowing(true)}
          />
        )}
      </div>
      <div className="project-card-body">
        <h2>{project.title}</h2>
        <span className="status">{project.status}</span>
        <p>{project.description}</p>
      </div>
    </Link>
  )
}

export default ProjectCard
