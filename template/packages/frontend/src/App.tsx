import { useState } from 'react'
import { client } from './client'

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('')

  const onClick = async () => {
    const message = await client.index
      .$get()
      .then((res) => (res.ok ? res.json() : undefined))
      .then((res) => res?.message)

    setMessage(message ?? 'Failed to fetch')
  }

  return (
    <>
      <h1>React SPA on Cloudflare Workers</h1>
      <button onClick={onClick}>Call API</button>
      <p>Message from server: {message}</p>
    </>
  )
}

export default App
