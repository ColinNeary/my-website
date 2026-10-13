import { useEffect, useRef, useState } from 'react'
import {
  accents,
  applyTheme,
  darkQuery,
  loadAccent,
  loadMode,
  saveTheme,
  type Accent,
  type ThemeMode,
} from '../theme'
import { ThemeIcon } from './Icons'

const modes: { id: ThemeMode; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
]

function ThemeMenu() {
  const [mode, setMode] = useState<ThemeMode>(loadMode)
  const [accent, setAccent] = useState<Accent>(loadAccent)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    applyTheme(mode, accent)
    saveTheme(mode, accent)

    // In system mode, follow the OS if it switches while the page is open
    if (mode !== 'system') return
    const query = window.matchMedia(darkQuery)
    const onChange = () => applyTheme(mode, accent)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [mode, accent])

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="theme-menu" ref={menuRef}>
      <button
        type="button"
        className="icon-button"
        aria-label="Theme settings"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <ThemeIcon />
      </button>

      {open && (
        <div className="theme-popover">
          <p className="theme-popover-label">Theme</p>
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`theme-option${mode === m.id ? ' selected' : ''}`}
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}

          <p className="theme-popover-label">Accent</p>
          <div className="swatches">
            {accents.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`swatch${accent === a.id ? ' selected' : ''}`}
                style={{ '--swatch-light': a.light, '--swatch-dark': a.dark } as React.CSSProperties}
                aria-label={a.label}
                aria-pressed={accent === a.id}
                title={a.label}
                onClick={() => setAccent(a.id)}
              ></button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ThemeMenu
