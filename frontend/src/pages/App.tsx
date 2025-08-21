import React, { useEffect, useState } from 'react'
import Board from '../ui/Board'

export default function App() {
  const [token,setToken] = useState<string | null>(null)
  const [projectId] = useState<number>(1)

  useEffect(()=>{
    const run = async () => {
    }
    run()
  }, [])

  if (!token) return <div style={{padding:20}}>Autenticando...</div>

  return <Board token={token} projectId={projectId} />
}
