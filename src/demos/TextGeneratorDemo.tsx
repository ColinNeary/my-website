import { useId, useRef, useState } from 'react'
import {
  buildModel,
  completeWord,
  generate,
  suggestNext,
  summarize,
  type Strategy,
  type Suggestion,
  type TextModel,
} from './textModel'
import './TextGeneratorDemo.css'

type Tab = 'import' | 'stats' | 'autocomplete' | 'generate'

// The same four screens as the desktop app's main menu
const TABS: { id: Tab; label: string }[] = [
  { id: 'import', label: 'Import' },
  { id: 'stats', label: 'Statistics' },
  { id: 'autocomplete', label: 'Auto Complete' },
  { id: 'generate', label: 'Text Generator' },
]

const MAX_CHARACTERS = 5_000_000
const SAMPLE_URL = '/demo/pride-and-prejudice.txt'
const WORD_AT_END = /\p{L}+(?:['’]\p{L}+)*$/u
const WORDS = /\p{L}+(?:['’]\p{L}+)*/gu

const STRATEGIES: { id: Strategy; label: string; help: string }[] = [
  { id: 'sample', label: 'Sampled', help: 'Picks each next word at random, weighted by how often it followed the last one.' },
  { id: 'greedy', label: 'Greedy', help: 'Always takes the single most common next word. The same text every time.' },
  { id: 'beam', label: 'Beam search', help: 'Tracks several likely word sequences at once and returns the most probable one.' },
]

function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

function TextGeneratorDemo() {
  const [tab, setTab] = useState<Tab>('import')
  const [model, setModel] = useState<TextModel | null>(null)
  const [source, setSource] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  // Building the model for a whole book takes a moment, so let "Building..." paint first
  function build(text: string, label: string) {
    setBusy(true)
    setMessage('')
    setTimeout(() => {
      const built = buildModel(text)
      if (built.totalWords === 0) {
        setMessage("I couldn't find any words in that text.")
      } else {
        setModel(built)
        setSource(label)
        setMessage(`Built a model from ${label}. Try the other tabs.`)
      }
      setBusy(false)
    }, 30)
  }

  return (
    <div className="demo">
      <div className="demo-tabs" role="tablist" aria-label="Text Generator demo">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`demo-tab-${id}`}
            aria-selected={tab === id}
            aria-controls="demo-panel"
            className={tab === id ? 'demo-tab selected' : 'demo-tab'}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div id="demo-panel" role="tabpanel" aria-labelledby={`demo-tab-${tab}`} className="demo-panel">
        {tab === 'import' && (
          <ImportPanel busy={busy} message={message} source={source} model={model} onBuild={build} onMessage={setMessage} />
        )}
        {tab !== 'import' && !model && (
          <p className="demo-hint">
            Import some text first.{' '}
            <button type="button" className="demo-link" onClick={() => setTab('import')}>
              Go to Import
            </button>
          </p>
        )}
        {tab === 'stats' && model && <StatsPanel model={model} source={source} />}
        {tab === 'autocomplete' && model && <AutoCompletePanel model={model} />}
        {tab === 'generate' && model && <GeneratePanel model={model} />}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- import

function ImportPanel(props: {
  busy: boolean
  message: string
  source: string
  model: TextModel | null
  onBuild: (text: string, label: string) => void
  onMessage: (message: string) => void
}) {
  const { busy, message, model, onBuild, onMessage } = props
  const [pasted, setPasted] = useState('')
  const pasteId = useId()
  const fileId = useId()

  async function loadSample() {
    onMessage('Downloading the sample text...')
    try {
      const response = await fetch(SAMPLE_URL)
      if (!response.ok) throw new Error(String(response.status))
      onBuild(await response.text(), 'Pride and Prejudice')
    } catch {
      onMessage("Couldn't download the sample text. Check your connection and try again.")
    }
  }

  async function loadFile(file: File | undefined) {
    if (!file) return
    if (file.size > MAX_CHARACTERS) {
      onMessage(`That file is too large for the demo (limit ${formatNumber(MAX_CHARACTERS / 1_000_000)} MB).`)
      return
    }
    onBuild(await file.text(), file.name)
  }

  return (
    <>
      <p className="demo-hint">
        Start with a sample, or bring your own text. Everything is processed in your browser, so nothing you paste or
        choose is uploaded. The sample is <em>Pride and Prejudice</em> by Jane Austen (public domain).
      </p>

      <div className="demo-row">
        <button type="button" className="demo-button primary" disabled={busy} onClick={loadSample}>
          Load Pride and Prejudice
        </button>
        <label className="demo-button" htmlFor={fileId}>
          Choose a .txt file
        </label>
        <input
          id={fileId}
          className="demo-file"
          type="file"
          accept=".txt,text/plain"
          onChange={(event) => {
            void loadFile(event.target.files?.[0])
            event.target.value = ''
          }}
        />
      </div>

      <label htmlFor={pasteId} className="demo-label">
        Or paste text
      </label>
      <textarea
        id={pasteId}
        className="demo-textarea"
        rows={5}
        value={pasted}
        placeholder="Paste a few paragraphs here..."
        onChange={(event) => setPasted(event.target.value)}
      />
      <div className="demo-row">
        <button
          type="button"
          className="demo-button"
          disabled={busy || pasted.trim() === ''}
          onClick={() => onBuild(pasted.slice(0, MAX_CHARACTERS), 'your pasted text')}
        >
          Build from pasted text
        </button>
      </div>

      <p className="demo-status" role="status">
        {busy ? 'Building...' : message}
      </p>
      {model && !busy && (
        <p className="demo-hint">
          Current model: {formatNumber(model.totalWords)} words, {formatNumber(model.words.size)} unique,{' '}
          {formatNumber(model.distinctPairs)} word pairs.
        </p>
      )}
    </>
  )
}

// ---------------------------------------------------------------- statistics

function StatsPanel({ model, source }: { model: TextModel; source: string }) {
  const [skipCommon, setSkipCommon] = useState(false)
  const summary = summarize(model, skipCommon)
  const skipId = useId()

  const cards: [string, string][] = [
    ['Words', formatNumber(summary.totalWords)],
    ['Unique words', formatNumber(summary.uniqueWords)],
    ['Sentences', formatNumber(summary.sentences)],
    ['Avg. sentence length', summary.averageSentenceLength.toFixed(1)],
    ['Distinct word pairs', formatNumber(summary.distinctPairs)],
  ]

  return (
    <>
      <p className="demo-hint">Statistics for {source}.</p>
      <dl className="demo-cards">
        {cards.map(([label, value]) => (
          <div key={label} className="demo-card">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="demo-check">
        <input id={skipId} type="checkbox" checked={skipCommon} onChange={(event) => setSkipCommon(event.target.checked)} />
        <label htmlFor={skipId}>Skip common words like "the" and "and"</label>
      </div>

      <div className="demo-columns">
        <div>
          <h3>Most common words</h3>
          <ol className="demo-list">
            {summary.topWords.map(({ word, count }) => (
              <li key={word}>
                <span>{word}</span>
                <span className="demo-count">{formatNumber(count)}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3>Most common word pairs</h3>
          <ol className="demo-list">
            {summary.topPairs.map(({ left, right, count }) => (
              <li key={`${left} ${right}`}>
                <span>
                  {left} {right}
                </span>
                <span className="demo-count">{formatNumber(count)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------------- auto complete

function AutoCompletePanel({ model }: { model: TextModel }) {
  const [typed, setTyped] = useState('')
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const words = typed.toLowerCase().replace(/[’‘]/g, "'").match(WORDS) ?? []
  const endsWithSpace = typed === '' || /\s$/.test(typed)
  const completing = !endsWithSpace && words.length > 0

  // Mid-word we finish the word being typed; after a space we predict the next one
  const previous = completing ? words[words.length - 2] : words[words.length - 1]
  const suggestions: Suggestion[] = completing
    ? completeWord(model, words[words.length - 1], previous, 6)
    : suggestNext(model, previous, 6)

  function pick(word: string) {
    const base = completing ? typed.replace(WORD_AT_END, '') : typed
    setTyped(`${base}${word} `)
    inputRef.current?.focus() // so typing can carry on straight away
  }

  return (
    <>
      <label htmlFor={inputId} className="demo-label">
        Start typing
      </label>
      <input
        id={inputId}
        ref={inputRef}
        className="demo-input"
        type="text"
        autoComplete="off"
        spellCheck={false}
        value={typed}
        placeholder="It is a truth universally..."
        onChange={(event) => setTyped(event.target.value)}
      />

      <p className="demo-hint" aria-live="polite">
        {completing
          ? `Words starting with "${words[words.length - 1]}"`
          : previous
            ? `Likely next words after "${previous}"`
            : 'Most common words'}
        :
      </p>
      {suggestions.length === 0 ? (
        <p className="demo-hint">No suggestions for that.</p>
      ) : (
        <ul className="demo-chips">
          {suggestions.map(({ word, count, afterPrevious }) => (
            <li key={word}>
              <button type="button" className="demo-chip" onClick={() => pick(word)}>
                {word}
                <span className="demo-count" title={afterPrevious ? 'times it followed the previous word' : 'times it appears'}>
                  {formatNumber(count)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

// ---------------------------------------------------------------- text generator

function GeneratePanel({ model }: { model: TextModel }) {
  const [strategy, setStrategy] = useState<Strategy>('sample')
  const [length, setLength] = useState(30)
  const [beamWidth, setBeamWidth] = useState(5)
  const [start, setStart] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const startId = useId()
  const lengthId = useId()
  const beamId = useId()

  function run() {
    const startWord = start.trim().toLowerCase().replace(/[’‘]/g, "'")
    if (startWord && !model.words.has(startWord)) {
      setError(`"${startWord}" isn't in the imported text.`)
      return
    }
    setError('')
    setOutput(generate(model, { strategy, length, beamWidth, start: startWord || undefined }))
  }

  return (
    <>
      <fieldset className="demo-fieldset">
        <legend>Method</legend>
        {STRATEGIES.map(({ id, label, help }) => (
          <label key={id} className="demo-radio">
            <input type="radio" name="strategy" value={id} checked={strategy === id} onChange={() => setStrategy(id)} />
            <span>
              <strong>{label}</strong> <span className="demo-hint-inline">{help}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="demo-controls">
        <div>
          <label htmlFor={lengthId} className="demo-label">
            Length: {length} words
          </label>
          <input id={lengthId} type="range" min={5} max={100} value={length} onChange={(event) => setLength(Number(event.target.value))} />
        </div>
        {strategy === 'beam' && (
          <div>
            <label htmlFor={beamId} className="demo-label">
              Beam width: {beamWidth}
            </label>
            <input id={beamId} type="range" min={2} max={12} value={beamWidth} onChange={(event) => setBeamWidth(Number(event.target.value))} />
          </div>
        )}
        <div>
          <label htmlFor={startId} className="demo-label">
            Start with (optional)
          </label>
          <input
            id={startId}
            className="demo-input"
            type="text"
            value={start}
            placeholder="elizabeth"
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => setStart(event.target.value)}
          />
        </div>
      </div>

      <div className="demo-row">
        <button type="button" className="demo-button primary" onClick={run}>
          {output ? 'Generate again' : 'Generate'}
        </button>
      </div>

      <p className="demo-error" role="alert">
        {error}
      </p>
      {output && <p className="demo-output">{output}</p>}
    </>
  )
}

export default TextGeneratorDemo
