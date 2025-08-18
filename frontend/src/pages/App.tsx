import React, { useEffect, useState } from 'react'
import api from '../api'
import Board from '../ui/Board'

export default function App() {
  const [token,setToken] = useState<string | null>(null)
  const [projectId] = useState<number>(1)

  useEffect(()=>{
    const run = async () => {
      const res = await api.post('/auth/login', { email: 'admin@local', password: 'admin123' })
      setToken(res.data.token)
    }
    run()
  }, [])

  if (!token) return <div style={{padding:20}}>Autenticando...</div>

  return <Board token={token} projectId={projectId} />
}
