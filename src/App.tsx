import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import NavOption from './components/NavOption'

function App() {
  const [count, setCount] = useState(0) 

  const NavOptions = [ 
    {label_text:'nav1', destination:'test1'},
    {label_text:'nav2', destination:'test2'},
    {label_text:'nav3', destination:'test3'}
   ]

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
      <header>
        {/* logo / site name, nav links */}
        <nav id="nav" className="nav">
          <img src={reactLogo} className="framework" alt="React logo" />
          <>
            {NavOptions.map((option) => (
              <NavOption 
              key={option.label_text} 
              label_text={option.label_text} 
              destination={option.destination} />
            ))}
          </>
        </nav>
      </header>

      <main>
        <section id="hero">
          <h1>Colin Neary</h1>
          <p>Computer Science Student</p>
          <p>Welcome to my website!</p>
        </section>

        {/* Split body into multiple sections later */}
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
      </main>

      <footer>
        <p>Sample footer content</p>
      </footer>
    </>
  )
}

export default App