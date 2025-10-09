import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('Hello Vite + React!')
  return (
    useEffect(() => {
      fetch("/api/hello")
        .then((response) => response.json())
        .then((data) => setMessage(data.message));
    }, []),
    <div>
      <h1>{message}</h1>
    </div>
  )
}

export default App
