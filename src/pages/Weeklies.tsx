import { weeklies, type WeeklyEntry } from '../data/weeklies'
import { usePageTitle } from '../usePageTitle'
import './Weeklies.css'

// Parse as local time so the date doesn't shift a day in US timezones
function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function YouTubeEmbed({ videoId, lazy }: { videoId: string; lazy?: boolean }) {
  return (
    <iframe
      className="youtube-embed"
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video player"
      loading={lazy ? 'lazy' : undefined}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  )
}

// For videos that can't be embedded: the thumbnail, linking out to YouTube
function YouTubeLink({ videoId }: { videoId: string }) {
  return (
    <a
      className="youtube-link"
      href={`https://www.youtube.com/watch?v=${videoId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" loading="lazy" />
      <span>Watch on YouTube ↗</span>
    </a>
  )
}

function InstagramEmbed({ reelId, lazy }: { reelId: string; lazy?: boolean }) {
  return (
    <iframe
      className="instagram-embed"
      src={`https://www.instagram.com/reel/${reelId}/embed`}
      title="Instagram reel"
      loading={lazy ? 'lazy' : undefined}
      scrolling="no"
      allowFullScreen
    ></iframe>
  )
}

function WeekPicks({ week, lazy }: { week: WeeklyEntry; lazy?: boolean }) {
  return (
    <div className="week-picks">
      <figure className="pick pick-video">
        <span className="pick-label">YouTube Video</span>
        {week.youtubeEmbeddable === false ? (
          <YouTubeLink videoId={week.youtubeId} />
        ) : (
          <YouTubeEmbed videoId={week.youtubeId} lazy={lazy} />
        )}
        <figcaption>{week.videoCaption}</figcaption>
      </figure>
      <figure className="pick pick-reel">
        <span className="pick-label">Instagram Reel</span>
        <InstagramEmbed reelId={week.reelId} lazy={lazy} />
        <figcaption>{week.reelCaption}</figcaption>
      </figure>
    </div>
  )
}

function Weeklies() {
  usePageTitle('Weeklies')
  const [current, ...previous] = weeklies

  return (
    <section id="weeklies">
      <h1>Weeklies</h1>
      <p className="weeklies-intro">Definitive best YouTube video and Instagram reel of each week</p>

      <article className="week-card featured">
        <header className="week-header">
          <span className="badge">This Week</span>
          <time dateTime={current.date}>{formatDate(current.date)}</time>
        </header>
        <WeekPicks week={current} />
      </article>

      <h2 className="archive-heading">Previous Weeks</h2>
      {previous.length === 0 ? (
        <p>Check back next week for the archive!</p>
      ) : (
        <div className="archive">
          {previous.map((week) => (
            <article key={week.date} className="week-card archived">
              <header className="week-header">
                <time dateTime={week.date}>{formatDate(week.date)}</time>
              </header>
              <WeekPicks week={week} lazy />
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Weeklies
