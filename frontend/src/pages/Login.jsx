import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
    navigate('/board')
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
        <h1 className="text-xl mb-4">Login</h1>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 mb-2"/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full border p-2 mb-4"/>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Entrar</button>
      </form>
    </div>
  )
}