// A small word-and-pair model that can be built from any text.
//
// It's the same idea as the senior project's MySQL tables (a `words` table with total / starting /
// ending counts, and a `word_pairs` table with pair counts), but held in memory so it runs in the
// browser with no database. This is a fresh implementation, not code from the project.

export interface WordStats {
  total: number // times the word appears
  starting: number // times it begins a sentence
  ending: number // times it ends a sentence
}

export interface TextModel {
  words: Map<string, WordStats>
  pairs: Map<string, Map<string, number>> // left word -> (right word -> times they appeared in a row)
  pairTotals: Map<string, number> // left word -> sum of its pair counts
  totalWords: number
  sentenceCount: number
  distinctPairs: number
}

// A "." after one of these doesn't end a sentence
const ABBREVIATIONS = new Set(['mr', 'mrs', 'ms', 'dr', 'st', 'jr', 'sr', 'vs', 'etc'])

/** Splits text into sentences, each an array of lowercase words. */
export function splitSentences(text: string): string[][] {
  const sentences: string[][] = []
  let current: string[] = []

  const normalized = text.toLowerCase().replace(/[’‘]/g, "'")
  for (const match of normalized.matchAll(/\p{L}+(?:'\p{L}+)*|[.!?]+/gu)) {
    const token = match[0]
    if (/^[.!?]+$/.test(token)) {
      const last = current[current.length - 1]
      if (token === '.' && last !== undefined && ABBREVIATIONS.has(last)) continue
      if (current.length > 0) sentences.push(current)
      current = []
    } else {
      current.push(token)
    }
  }
  if (current.length > 0) sentences.push(current)
  return sentences
}

export function buildModel(text: string): TextModel {
  const words = new Map<string, WordStats>()
  const pairs = new Map<string, Map<string, number>>()
  const pairTotals = new Map<string, number>()
  let totalWords = 0
  let distinctPairs = 0

  const sentences = splitSentences(text)
  for (const sentence of sentences) {
    sentence.forEach((word, i) => {
      let stats = words.get(word)
      if (!stats) {
        stats = { total: 0, starting: 0, ending: 0 }
        words.set(word, stats)
      }
      stats.total++
      totalWords++
      if (i === 0) stats.starting++
      if (i === sentence.length - 1) stats.ending++

      if (i > 0) {
        const left = sentence[i - 1]
        let right = pairs.get(left)
        if (!right) {
          right = new Map()
          pairs.set(left, right)
        }
        const seen = right.get(word) ?? 0
        if (seen === 0) distinctPairs++
        right.set(word, seen + 1)
        pairTotals.set(left, (pairTotals.get(left) ?? 0) + 1)
      }
    })
  }

  return { words, pairs, pairTotals, totalWords, sentenceCount: sentences.length, distinctPairs }
}

// ---------------------------------------------------------------- statistics

const COMMON_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'from',
  'as', 'is', 'was', 'were', 'be', 'been', 'are', 'am', 'it', 'its', 'that', 'this', 'he', 'she',
  'his', 'her', 'i', 'you', 'they', 'we', 'me', 'my', 'had', 'have', 'has', 'not', 'so', 'if',
  'him', 'them', 'their', 'your', 'would', 'could', 'which', 'who', 'what', 'all', 'no',
])

export interface Summary {
  totalWords: number
  uniqueWords: number
  sentences: number
  averageSentenceLength: number
  distinctPairs: number
  topWords: { word: string; count: number }[]
  topPairs: { left: string; right: string; count: number }[]
}

export function summarize(model: TextModel, skipCommonWords: boolean, limit = 10): Summary {
  const keep = (word: string) => !skipCommonWords || !COMMON_WORDS.has(word)

  const topWords = [...model.words]
    .filter(([word]) => keep(word))
    .sort((a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word, stats]) => ({ word, count: stats.total }))

  const allPairs: { left: string; right: string; count: number }[] = []
  for (const [left, rights] of model.pairs) {
    if (!keep(left)) continue
    for (const [right, count] of rights) {
      if (keep(right)) allPairs.push({ left, right, count })
    }
  }
  allPairs.sort((a, b) => b.count - a.count || a.left.localeCompare(b.left) || a.right.localeCompare(b.right))

  return {
    totalWords: model.totalWords,
    uniqueWords: model.words.size,
    sentences: model.sentenceCount,
    averageSentenceLength: model.sentenceCount > 0 ? model.totalWords / model.sentenceCount : 0,
    distinctPairs: model.distinctPairs,
    topWords,
    topPairs: allPairs.slice(0, limit),
  }
}

// ---------------------------------------------------------------- autocomplete

export interface Suggestion {
  word: string
  count: number
  // true when `count` is how often the word followed the previous word, false when it's the word's overall count
  afterPrevious: boolean
}

/** Most likely next words after `previous`. If it's unknown (or there is none), the most common words. */
export function suggestNext(model: TextModel, previous: string | undefined, limit = 5): Suggestion[] {
  const followers = previous ? model.pairs.get(previous) : undefined
  if (followers) {
    return [...followers]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, limit)
      .map(([word, count]) => ({ word, count, afterPrevious: true }))
  }
  return [...model.words]
    .sort((a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word, stats]) => ({ word, count: stats.total, afterPrevious: false }))
}

/** Words that start with `prefix`, ranked by how often they follow `previous`, then by overall count. */
export function completeWord(model: TextModel, prefix: string, previous: string | undefined, limit = 5): Suggestion[] {
  const followers = previous ? model.pairs.get(previous) : undefined
  const matches: Suggestion[] = []
  for (const [word, stats] of model.words) {
    if (!word.startsWith(prefix)) continue
    const pairCount = followers?.get(word) ?? 0
    matches.push(
      pairCount > 0
        ? { word, count: pairCount, afterPrevious: true }
        : { word, count: stats.total, afterPrevious: false },
    )
  }
  return matches
    .sort((a, b) => Number(b.afterPrevious) - Number(a.afterPrevious) || b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, limit)
}

// ---------------------------------------------------------------- generation

export type Strategy = 'greedy' | 'sample' | 'beam'

export interface GenerateOptions {
  strategy: Strategy
  length: number // number of words
  start?: string // a word to begin with; must exist in the model
  beamWidth?: number // beam search only
  rng?: () => number // 0 <= n < 1; Math.random by default
}

// Greedy and beam search always favor the same likely words, so left alone they loop ("so much as ... so
// much as ..."). They can't reuse a word from the last several; sampling is random enough to need less.
function repeatWindow(strategy: Strategy): number {
  return strategy === 'sample' ? 3 : 12
}
const MAX_SENTENCE_LENGTH = 22
const MIN_SENTENCE_LENGTH = 4

function weightedPick<T>(items: [T, number][], rng: () => number): T {
  const total = items.reduce((sum, [, weight]) => sum + weight, 0)
  let r = rng() * total
  for (const [item, weight] of items) {
    r -= weight
    if (r < 0) return item
  }
  return items[items.length - 1][0]
}

function bestOf(items: [string, number][]): string {
  let best = items[0]
  for (const item of items) {
    if (item[1] > best[1] || (item[1] === best[1] && item[0] < best[0])) best = item
  }
  return best[0]
}

function sentenceStarters(model: TextModel): [string, number][] {
  const starters: [string, number][] = []
  for (const [word, stats] of model.words) {
    if (stats.starting > 0) starters.push([word, stats.starting])
  }
  return starters
}

function chooseStarter(starters: [string, number][], strategy: Strategy, recent: string[], rng: () => number): string {
  const fresh = starters.filter(([word]) => !recent.includes(word))
  const pool = fresh.length > 0 ? fresh : starters
  return strategy === 'greedy' ? bestOf(pool) : weightedPick(pool, rng)
}

/** Greedy and sampled generation: walk word to word, starting a new sentence when the text calls for one. */
function generateWalk(model: TextModel, options: GenerateOptions, rng: () => number): string[][] {
  const starters = sentenceStarters(model)
  if (starters.length === 0) return []

  const window = repeatWindow(options.strategy)
  const sentences: string[][] = []
  let current: string[] = []
  const recent: string[] = []
  let word = options.start ?? chooseStarter(starters, options.strategy, recent, rng)

  for (let count = 1; ; count++) {
    current.push(word)
    recent.push(word)
    if (count >= options.length) break

    const followers = model.pairs.get(word)
    const choices = followers
      ? [...followers].filter(([next]) => !recent.slice(-window).includes(next))
      : []

    const stats = model.words.get(word)
    const endChance = stats ? stats.ending / stats.total : 0
    const wantsToEnd =
      current.length >= MIN_SENTENCE_LENGTH &&
      (options.strategy === 'greedy' ? endChance >= 0.3 : rng() < endChance)

    if (choices.length === 0 || wantsToEnd || current.length >= MAX_SENTENCE_LENGTH) {
      sentences.push(current)
      current = []
      word = chooseStarter(starters, options.strategy, recent.slice(-window), rng)
    } else {
      word = options.strategy === 'greedy' ? bestOf(choices) : weightedPick(choices, rng)
    }
  }
  if (current.length > 0) sentences.push(current)
  return sentences
}

/** Beam search: keep the `beamWidth` most likely word sequences at each step and return the best one. */
function generateBeam(model: TextModel, options: GenerateOptions, rng: () => number): string[][] {
  const starters = sentenceStarters(model)
  if (starters.length === 0) return []

  const window = repeatWindow('beam')
  const beamWidth = Math.max(1, options.beamWidth ?? 5)
  const first = options.start ?? chooseStarter(starters, 'greedy', [], rng)

  interface Hypothesis {
    words: string[]
    logProbability: number
    finished: boolean // ran out of words that can follow
  }
  const fairScore = (h: Hypothesis) => h.logProbability / h.words.length // so short and long sequences compare fairly
  let beams: Hypothesis[] = [{ words: [first], logProbability: 0, finished: false }]

  for (let step = 1; step < options.length; step++) {
    const candidates: Hypothesis[] = []
    for (const beam of beams) {
      const last = beam.words[beam.words.length - 1]
      const followers = model.pairs.get(last)
      const total = model.pairTotals.get(last) ?? 0
      if (beam.finished || !followers || total === 0) {
        candidates.push({ ...beam, finished: true })
        continue
      }

      const recent = beam.words.slice(-window)
      const likely = [...followers]
        .filter(([next]) => !recent.includes(next))
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, beamWidth)
      if (likely.length === 0) {
        candidates.push({ ...beam, finished: true })
        continue
      }
      for (const [next, count] of likely) {
        candidates.push({
          words: [...beam.words, next],
          logProbability: beam.logProbability + Math.log(count / total),
          finished: false,
        })
      }
    }
    beams = candidates.sort((a, b) => fairScore(b) - fairScore(a)).slice(0, beamWidth)
    if (beams.every((beam) => beam.finished)) break
  }

  return [beams[0].words]
}

/** "i" and "i'm" are written with a capital I, and each sentence starts with a capital and ends with a period. */
function render(sentences: string[][]): string {
  return sentences
    .map((sentence) => {
      const words = sentence.map((word) => word.replace(/^i(?=$|')/, 'I'))
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
      return words.join(' ') + '.'
    })
    .join(' ')
}

export function generate(model: TextModel, options: GenerateOptions): string {
  const rng = options.rng ?? Math.random
  const sentences =
    options.strategy === 'beam' ? generateBeam(model, options, rng) : generateWalk(model, options, rng)
  return render(sentences)
}
