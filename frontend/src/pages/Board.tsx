import React, { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import ReasonModal from './ReasonModal';
import TimerBar from './TimerBar';

interface Card { id:number; title:string; description:string; flagColor?:string; logoUrl?:string; createdAt?:string; dueAt?:string; }
interface Column { id:number; name:string; position:number; cards:Card[] }
interface Project { id:number; name:string; columns:Column[] }
interface Reason { id:number; name:string }

export default function Board({ token, projectId }: { token:string, projectId:number }) {
  const [board,setBoard] = useState<Project | null>(null)
  const [reasons,setReasons] = useState<Reason[]>([])
  const [pendingMove,setPendingMove] = useState<{cardId:number, toColumnId:number} | null>(null)

  const client = useMemo(()=>{
    const c = api.create({})
    c.defaults.headers.common['Authorization'] = `Bearer ${token}`
    return c
  },[token])

  const load = async () => {
    const { data } = await client.get(`/boards/${projectId}`)
    setBoard(data)
  }

  useEffect(()=>{
    load()
    client.get('/movement-reasons').then(r=> setReasons(r.data))
  },[])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !board) return
    const fromColIdx = board.columns.findIndex(c=> c.id.toString() === result.source.droppableId)
    const toColIdx = board.columns.findIndex(c=> c.id.toString() === result.destination!.droppableId)
    if (fromColIdx === -1 || toColIdx === -1) return
    const fromCol = board.columns[fromColIdx]
    const card = fromCol.cards[result.source.index]
    setPendingMove({ cardId: card.id, toColumnId: board.columns[toColIdx].id })
  }

  const confirmMove = async (reasonId:number, note:string) => {
    if (!pendingMove) return
    await client.post(`/cards/${pendingMove.cardId}/move`, { toColumnId: pendingMove.toColumnId, reasonId, note })
    alert('Pausa automática aplicada. Card movido.')
    setPendingMove(null)
    await load()
  }

  const cancelMove = () => setPendingMove(null)

  if (!board) return <div style={{padding:20}}>Carregando board...</div>

  return (
    <div style={{display:'flex', gap:16, padding:16, overflowX:'auto'}}>
      <DragDropContext onDragEnd={onDragEnd}>
        {board.columns.map(col => (
          <Droppable droppableId={col.id.toString()} key={col.id}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{minWidth:300, background:'#f5f5f5', borderRadius:12, padding:12}}>
                <div style={{fontWeight:700, marginBottom:8}}>{col.name}</div>
                {col.cards?.map((card, idx) => (
                  <Draggable draggableId={card.id.toString()} index={idx} key={card.id}>
                    {(prov) => (
                      <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                           style={{background:'#fff', borderRadius:12, padding:12, marginBottom:8, boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
                        <div style={{display:'flex', alignItems:'center', gap:8}}>
                          {card.logoUrl && <img src={card.logoUrl} style={{width:28,height:28,borderRadius:6, objectFit:'cover'}}/>}
                          <div style={{flex:1, fontWeight:600}}>{card.title}</div>
                          {card.flagColor && <span style={{width:12,height:12,borderRadius:3, background: card.flagColor}}/>}
                        </div>
                        <div style={{fontSize:12, opacity:0.8, marginTop:6}}>
                          Criado: {card.createdAt ? new Date(card.createdAt).toLocaleDateString() : '-'}
                          {card.dueAt && <> • Entrega: {new Date(card.dueAt).toLocaleDateString()}</>}
                        </div>
                        <TimerBar token={token} cardId={card.id} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>

      {pendingMove && <ReasonModal reasons={reasons} onCancel={cancelMove} onConfirm={confirmMove} />}
    </div>
  )
}
