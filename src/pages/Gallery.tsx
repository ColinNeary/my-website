import { useEffect, useRef, useState } from 'react'
import { photos } from '../data/gallery'
import './Gallery.css'

function formatDate(date: string) {
  // Parse as local time so the date doesn't shift a day in US timezones
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  // A modal <dialog> traps focus, closes on Esc, and hands focus back to the thumbnail you clicked
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (openIndex !== null && !dialog.open) dialog.showModal()
    if (openIndex === null && dialog.open) dialog.close()
  }, [openIndex])

  // Load the neighbors ahead of time so stepping through photos feels instant
  useEffect(() => {
    if (openIndex === null) return
    for (const delta of [-1, 1]) {
      new Image().src = photos[(openIndex + delta + photos.length) % photos.length].src
    }
  }, [openIndex])

  const step = (delta: number) =>
    setOpenIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length))

  const photo = openIndex === null ? null : photos[openIndex]

  return (
    <section id="gallery">
      <h1>Gallery</h1>

      {photos.length === 0 ? (
        <p className="gallery-empty">Photos coming soon.</p>
      ) : (
        <>
          <ul className="gallery-grid">
            {photos.map((p, i) => (
              <li key={p.id}>
                <button type="button" className="gallery-item" onClick={() => setOpenIndex(i)}>
                  <img
                    src={p.thumb}
                    alt={p.caption ?? `Photo ${i + 1}`}
                    width={480}
                    height={480}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              </li>
            ))}
          </ul>

          <dialog
            ref={dialogRef}
            className="lightbox"
            aria-label="Photo viewer"
            onClose={() => setOpenIndex(null)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') step(-1)
              if (e.key === 'ArrowRight') step(1)
            }}
            // Clicking the dark area around the photo closes it
            onClick={(e) => {
              if (!(e.target as HTMLElement).closest('figure, button')) setOpenIndex(null)
            }}
          >
            {photo && openIndex !== null && (
              <>
                <button type="button" className="lightbox-close" aria-label="Close" onClick={() => setOpenIndex(null)}>
                  ×
                </button>
                <button type="button" className="lightbox-nav prev" aria-label="Previous photo" onClick={() => step(-1)}>
                  ‹
                </button>
                <figure>
                  <img
                    src={photo.src}
                    alt={photo.caption ?? `Photo ${openIndex + 1}`}
                    width={photo.width}
                    height={photo.height}
                  />
                  <figcaption>
                    {photo.caption && <span className="lightbox-caption">{photo.caption}</span>}
                    <span className="lightbox-meta">
                      {photo.date && `${formatDate(photo.date)} · `}
                      {openIndex + 1} / {photos.length}
                    </span>
                  </figcaption>
                </figure>
                <button type="button" className="lightbox-nav next" aria-label="Next photo" onClick={() => step(1)}>
                  ›
                </button>
              </>
            )}
          </dialog>
        </>
      )}
    </section>
  )
}

export default Gallery
