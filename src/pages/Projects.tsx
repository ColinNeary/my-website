import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'
import './Projects.css'

function Projects() {
  return (
    <section id="projects">
      <h1>Projects</h1>
      <p className="projects-intro">Projects I've made or helped make. Most are unfinished so expect rough edges.</p>

      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}

export default Projects
