import { useEffect, useState } from 'react'
import { usePageTitle } from '../usePageTitle'
import './Resume.css'

// Replace public/resume.pdf to update it. The download button saves it under the second name.
const RESUME_URL = '/resume.pdf'
const DOWNLOAD_NAME = 'Colin-Neary-Resume.pdf'

function Resume() {
  usePageTitle('Resume')
  // null while checking. The host answers any missing file with the home page (status 200), so check the
  // content type instead of the status to tell whether the PDF is really there.
  const [available, setAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    fetch(RESUME_URL, { method: 'HEAD' })
      .then((res) => setAvailable(res.ok && (res.headers.get('content-type') ?? '').includes('pdf')))
      .catch(() => setAvailable(false))
  }, [])

  return (
    <section id="resume">
      <h1>Resume</h1>

      {available === false && <p className="resume-missing">My resume is coming soon.</p>}

      {available && (
        <>
          <div className="resume-actions">
            <a className="button primary" href={RESUME_URL} download={DOWNLOAD_NAME}>
              Download PDF
            </a>
            <a className="button" href={RESUME_URL} target="_blank" rel="noreferrer">
              Open in new tab
            </a>
          </div>
          <iframe className="resume-frame" src={`${RESUME_URL}#view=FitH&navpanes=0`} title="Resume (PDF)"></iframe>
        </>
      )}
    </section>
  )
}

export default Resume
