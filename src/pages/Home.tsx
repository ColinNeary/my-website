import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  const [count, setCount] = useState(0)

  const handleClick = async () => {
    const response = await fetch("https://s7v7ch54l4o6zmfqt7onm7o5mu0wqlcp.lambda-url.us-east-2.on.aws/");
    const data = await response.json();
    setCount(data.count);
  };

  useEffect(() => {
    fetch("https://hzerk5ka4ob26mzrbzk6cuqoyu0svnnn.lambda-url.us-east-2.on.aws/")
      .then((response) => response.json())
      .then((data) => setCount(data.count));
  }, []);

  return (
    <>
      <section id="hero">
        <h1>Colin Neary</h1>
        <p className="tagline">Programming extraordinaire</p>
        <p className="about">
          Hello! I am a Computer Science student at UT Dallas, graduating in December 2026. I've been creating software things
          for many years now and wanted a place to showcase my work. This website is still a work in progress, so expect things 
          to improve over time. If you want to get in touch with me, please feel free to reach out using the links below!
        </p>
        <div className="hero-actions">
          <Link to="/portfolio" className="button primary">View projects</Link>
          <Link to="/weeklies" className="button">This week's picks</Link>
        </div>
      </section>

      <section id="counter">
        <p>Click the button!</p>
        <button
          type="button"
          className="counter"
          onClick={handleClick}
        >
          Count is {count}
        </button>
      </section>
    </>
  )
}

export default Home
