import generated from './gallery.generated.json'

export interface Photo {
  id: string
  src: string
  thumb: string
  width: number
  height: number
  date?: string // YYYY-MM-DD; unknown for screenshots and photos saved from messaging apps
  caption?: string
}

interface GeneratedPhoto {
  id: string
  width: number
  height: number
  date: string | null
}

// Optional captions, keyed by photo id: the original file name without its extension, lowercased, with
// other characters turned into dashes (IMG_2041.jpg -> 'img-2041'). `npm run photos` prints each id.
const captions: Record<string, string> = {
  // 'img-2041': 'Hiking at Big Bend',
}

// Dates for photos that have none in their metadata (or to correct one), as YYYY-MM-DD, keyed the same way.
const dates: Record<string, string> = {
  // 'img-1973': '2025-03-14',
}

// gallery.generated.json is rewritten by `npm run photos`. Newest first, undated photos last.
export const photos: Photo[] = (generated as GeneratedPhoto[])
  .map((p) => ({
    ...p,
    date: dates[p.id] ?? p.date ?? undefined,
    src: `/gallery/${p.id}.webp`,
    thumb: `/gallery/thumbs/${p.id}.webp`,
    caption: captions[p.id],
  }))
  .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.id.localeCompare(b.id))
