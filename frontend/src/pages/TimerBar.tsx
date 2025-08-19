import React, { useMemo } from 'react'
import api from '../api'

export default function TimerBar({ token, cardId }:{ token:string, cardId:number }) {
  const client = useMemo(()=>{
    const c = api.create({})
    c.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return c
  },[token])

  const start = async (cls:'START_ACTIVITY'|'START_OF_DAY'|'SWITCH_ACTIVITY'|'OTHER') => {
    await client.post(`/cards/${cardId}/time/start`, { classification: cls, note: '' })
    alert('Timer iniciado.')
  }
  const pause = async (cls:'PAUSE_BATHROOM'|'LUNCH'|'OTHER') => {
    await client.post(`/cards/${cardId}/time/pause`, { classification: cls, note: '' })
    alert('Timer pausado.')
  }
  const stop = async () => {
    await client.post(`/cards/${cardId}/time/stop`, { note: '' })
    alert('Timer finalizado.')
  }

  return (
    <div style={{display:'flex', gap:8, marginTop:8, flexWrap:'wrap'}}>
      <button onClick={()=> start('START_ACTIVITY')}>Iniciar</button>
      <button onClick={()=> pause('PAUSE_BATHROOM')}>Pausa</button>
      <button onClick={stop}>Finalizar</button>
    </div>
  )
}
