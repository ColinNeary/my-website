import { weeklies } from '../data/weeklies'

function YouTubeEmbed({ videoId, caption }: { videoId: string; caption: string }) {
  return (
    <>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <p>{caption}</p>
    </>
  )
}

function InstagramEmbed({ reelId, caption }: { reelId: string; caption: string }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <iframe
          src={`https://www.instagram.com/reel/${reelId}/embed`}
          width="400"
          height="480"
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
          allowFullScreen={true}
        ></iframe>
      </div>
      <p>{caption}</p>
    </>
  )
}

function Weeklies() {
  const [current, ...previous] = weeklies

  return (
    <section id="weeklies">
      <h1>Weeklies</h1>

      <h2>YouTube Video of the Week</h2>
      <YouTubeEmbed videoId={current.youtubeId} caption={current.videoCaption} />

      <h2>Instagram Reel of the Week</h2>
      <InstagramEmbed reelId={current.reelId} caption={current.reelCaption} />

      <h2>Previous Videos</h2>
      {previous.length === 0 ? (
        <p>Check back next week for the archive!</p>
      ) : (
        previous.map((week) => (
          <YouTubeEmbed key={week.date} videoId={week.youtubeId} caption={week.videoCaption} />
        ))
      )}

      <h2>Previous Reels</h2>
      {previous.length === 0 ? (
        <p>Check back next week for the archive!</p>
      ) : (
        previous.map((week) => (
          <InstagramEmbed key={week.date} reelId={week.reelId} caption={week.reelCaption} />
        ))
      )}
    </section>
  )
}

export default Weeklies
