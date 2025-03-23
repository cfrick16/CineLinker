import { useState, useEffect } from 'react'

function App() {
  const LOADING_STATUS = 'loading'
  const [status, setStatus] = useState<string>(LOADING_STATUS)

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="app">
      <h1>Welcome to CineLinker</h1>
      <p>Server status: {status}</p>
    </div>
  )
}

export default App 