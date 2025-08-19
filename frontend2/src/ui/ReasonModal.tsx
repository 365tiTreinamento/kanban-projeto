import React, { useState } from 'react'

interface Reason { id:number; name:string }
export default function ReasonModal({ reasons, onCancel, onConfirm }:{ reasons:Reason[], onCancel:()=>void, onConfirm:(reasonId:number, note:string)=>void }) {
  const [reasonId,setReasonId] = useState<number|undefined>(reasons[0]?.id)
  const [note,setNote] = useState('')
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{background:'#fff', borderRadius:12, padding:16, width:420}}>
        <h3>Informe o motivo da movimentação</h3>
        <select value={reasonId} onChange={e=> setReasonId(Number(e.target.value))} style={{width:'100%', padding:8, marginTop:8}}>
          {reasons.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <textarea placeholder="Observação (opcional)" value={note} onChange={e=> setNote(e.target.value)} style={{width:'100%', marginTop:8, height:90}}/>
        <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:12}}>
          <button onClick={onCancel}>Cancelar</button>
          <button onClick={()=> reasonId && onConfirm(reasonId, note)}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}
