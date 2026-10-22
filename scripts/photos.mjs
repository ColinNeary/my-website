// Turns the photos in photos-original/ into web-sized gallery images.
//
//   npm run photos            process new or changed photos
//   npm run photos -- --force re-encode everything
//
// For each photo this writes a ~1600px version and a square thumbnail (both WebP) into public/gallery/,
// strips camera and GPS metadata, applies the photo's rotation, and rewrites src/data/gallery.generated.json.
// photos-original/ is gitignored, so your full-size originals never leave this machine.

import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, parse } from 'node:path'
import sharp from 'sharp'
import exifReader from 'exif-reader'

const SOURCE_DIR = 'photos-original'
const OUT_DIR = 'public/gallery'
const THUMB_DIR = `${OUT_DIR}/thumbs`
const MANIFEST = 'src/data/gallery.generated.json'

const FULL_SIZE = 1600 // longest edge, in pixels
const THUMB_SIZE = 480 // square

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff'])
const force = process.argv.includes('--force')

// Don't keep source files open or cached, so re-running over changed files (and Windows) behaves
sharp.cache(false)

if (!existsSync(SOURCE_DIR)) {
  console.error(`No ${SOURCE_DIR}/ folder. Create it and copy your photos in, then run this again.`)
  process.exit(1)
}

const files = readdirSync(SOURCE_DIR).filter((f) => statSync(join(SOURCE_DIR, f)).isFile()).sort()
const photos = []
for (const file of files) {
  const ext = extname(file).toLowerCase()
  if (SUPPORTED.has(ext)) photos.push(file)
  else if (ext === '.heic' || ext === '.heif') {
    console.warn(`Skipping ${file}: HEIC isn't supported. Export it as a JPG (or set your phone camera to "Most Compatible").`)
  } else {
    console.warn(`Skipping ${file}: not a supported image type.`)
  }
}

// Refuse to continue with an empty folder, since pruning would wipe the whole gallery
if (photos.length === 0) {
  console.error(`No photos found in ${SOURCE_DIR}/. Nothing was changed.`)
  process.exit(1)
}

mkdirSync(THUMB_DIR, { recursive: true })

function toId(file, used) {
  const base = parse(file).name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'photo'
  let id = base
  for (let n = 2; used.has(id); n++) id = `${base}-${n}`
  used.add(id)
  return id
}

// Date the photo was taken, as YYYY-MM-DD, or null. Screenshots and photos saved from messaging apps usually
// have no date in them, and a file's own timestamp is just when it was copied, so those stay undated
// (they're listed last). Give one a date by hand in src/data/gallery.ts.
function takenOn(meta) {
  try {
    if (meta.exif) {
      const exif = exifReader(meta.exif)
      const taken = exif.Photo?.DateTimeOriginal ?? exif.Image?.DateTime
      if (taken instanceof Date && !Number.isNaN(taken.getTime())) return taken.toISOString().slice(0, 10)
    }
  } catch {
    // Unreadable EXIF; leave it undated
  }
  return null
}

const isStale = (output, input) => force || !existsSync(output) || statSync(output).mtimeMs < statSync(input).mtimeMs

const used = new Set()
const manifest = []
let encoded = 0

for (const file of photos) {
  const input = join(SOURCE_DIR, file)
  const id = toId(file, used)
  const fullPath = `${OUT_DIR}/${id}.webp`
  const thumbPath = `${THUMB_DIR}/${id}.webp`

  const meta = await sharp(input).metadata()
  let info

  if (isStale(fullPath, input)) {
    // sharp drops EXIF (including GPS) from its output unless asked to keep it
    info = await sharp(input)
      .rotate()
      .resize({ width: FULL_SIZE, height: FULL_SIZE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(fullPath)
    encoded++
  } else {
    info = await sharp(fullPath).metadata()
  }

  if (isStale(thumbPath, input)) {
    // 'attention' crops toward the most detailed part of the photo, which tends to keep faces in frame
    await sharp(input)
      .rotate()
      .resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover', position: sharp.strategy.attention })
      .webp({ quality: 72 })
      .toFile(thumbPath)
  }

  manifest.push({ id, width: info.width, height: info.height, date: takenOn(meta) })
  console.log(`${file} -> ${id}`)
}

// Newest first, undated photos last
manifest.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.id.localeCompare(b.id))
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')

// Delete generated images whose original is gone
const keep = new Set(manifest.map((p) => `${p.id}.webp`))
let removed = 0
for (const dir of [OUT_DIR, THUMB_DIR]) {
  for (const name of readdirSync(dir)) {
    if (name.endsWith('.webp') && !keep.has(name)) {
      rmSync(join(dir, name))
      removed++
    }
  }
}

console.log(`\n${manifest.length} photos in the gallery (${encoded} encoded, ${removed} removed).`)
console.log('Add optional captions in src/data/gallery.ts, then run `npm run deploy`.')
