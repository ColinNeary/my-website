import { useEffect } from 'react'

const SITE_NAME = 'Colin Neary'

// Sets the browser tab (and history) title for the current page, e.g. "Projects - Colin Neary".
// Every page calls this, since the title doesn't change by itself when the router swaps pages.
// `noindex` asks search engines to skip the page; the 404 page needs it because the host serves it
// with a 200 status, which would otherwise make every mistyped URL look like a real page.
export function usePageTitle(title?: string, { noindex = false } = {}) {
  useEffect(() => {
    document.title = title ? `${title} - ${SITE_NAME}` : SITE_NAME
  }, [title])

  useEffect(() => {
    if (!noindex) return
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [noindex])
}
