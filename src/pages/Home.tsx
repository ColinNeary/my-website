import { useState, useEffect } from 'react'

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
        <p>Computer Science Student</p>
        <p>Welcome to my website!</p>
      </section>

      <section id="body">
        <h2>Click the button!</h2>
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
