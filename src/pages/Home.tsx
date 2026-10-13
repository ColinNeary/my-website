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
        <p className="tagline">Computer Science Student at UT Dallas</p>
        <p className="about">
          I'm a Computer Science student at UT Dallas, graduating in December 2026. I've been making
          games for years, most recently leading development on Skribble 'N Skram, a commercial indie
          game built in Godot. I also love optimizing programs and building tools, especially databases
          and the APIs around them. This site is where I'm teaching myself web development with React,
          TypeScript, and AWS.
        </p>
        <div className="hero-actions">
          <Link to="/portfolio" className="button primary">View portfolio</Link>
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
