import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import './Projects.css'

function Projects() {
  return (
    <section id="projects">
      <h1>Projects</h1>
      <p className="projects-intro">Projects I've made or helped make. Most are unfinished so expect rough edges.</p>

      <div className="project-grid">
        {projects.map((project) => (
          <Link key={project.slug} to={`/portfolio/${project.slug}`} className="project-card">
            {project.thumbnail ? (
              <img className="project-thumb" src={project.thumbnail} alt="" />
            ) : (
              <div className="project-thumb placeholder">{project.title}</div>
            )}
            <div className="project-card-body">
              <h2>{project.title}</h2>
              <span className="status">{project.status}</span>
              <p>{project.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Projects
