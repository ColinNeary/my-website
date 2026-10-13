import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons'

const socials = [
  { label: 'GitHub', href: 'https://github.com/ColinNeary', icon: <GitHubIcon /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/colin-neary', icon: <LinkedInIcon /> },
  { label: 'Email', href: 'mailto:colinneary2749@gmail.com', icon: <MailIcon /> },
]

function Footer() {
  return (
    <footer className="site-footer">
      <div className="socials">
        {socials.map((s) => (
          <a key={s.label} href={s.href} aria-label={s.label} title={s.label} target="_blank" rel="noreferrer">
            {s.icon}
          </a>
        ))}
      </div>
      <p>© {new Date().getFullYear()} Colin Neary</p>
    </footer>
  )
}

export default Footer
