export type ThemeMode = 'system' | 'light' | 'dark'

// Each accent has a darker shade for light mode and a lighter one for dark mode.
// Keep these in sync with the [data-accent] blocks in index.css.
export const accents = [
  { id: 'purple', label: 'Purple', light: '#aa3bff', dark: '#c084fc' },
  { id: 'blue', label: 'Blue', light: '#2563eb', dark: '#60a5fa' },
  { id: 'teal', label: 'Teal', light: '#0d9488', dark: '#2dd4bf' },
  { id: 'green', label: 'Green', light: '#15803d', dark: '#4ade80' },
  { id: 'orange', label: 'Orange', light: '#c2410c', dark: '#fb923c' },
  { id: 'rose', label: 'Rose', light: '#e11d48', dark: '#fb7185' },
] as const

export type Accent = (typeof accents)[number]['id']

const MODE_KEY = 'theme'
const ACCENT_KEY = 'accent'

export const darkQuery = '(prefers-color-scheme: dark)'

export function loadMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(MODE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Storage blocked; fall through to system
  }
  return 'system'
}

export function loadAccent(): Accent {
  try {
    const saved = localStorage.getItem(ACCENT_KEY)
    if (accents.some((a) => a.id === saved)) return saved as Accent
  } catch {
    // Storage blocked; fall through to default
  }
  return 'orange'
}

export function saveTheme(mode: ThemeMode, accent: Accent) {
  try {
    localStorage.setItem(MODE_KEY, mode)
    localStorage.setItem(ACCENT_KEY, accent)
  } catch {
    // Storage blocked; the choice just won't persist
  }
}

// index.html runs the same logic inline before React loads to avoid a flash
export function applyTheme(mode: ThemeMode, accent: Accent) {
  const dark = mode === 'dark' || (mode === 'system' && window.matchMedia(darkQuery).matches)
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  document.documentElement.dataset.accent = accent
}
