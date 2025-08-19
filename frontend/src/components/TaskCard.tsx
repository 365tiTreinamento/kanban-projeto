// components/TaskCard.tsx
import { Task } from '../types/Task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <h4>{task.title}</h4>
      {task.description && <p style={{ fontSize: '0.9em', color: '#555' }}>{task.description}</p>}
      <small style={{ color: '#888' }}>
        Criado em: {new Date(task.createdAt).toLocaleDateString()}
      </small>
      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
        <button onClick={() => onEdit(task)} style={{ fontSize: '0.8em' }}>Editar</button>
        <button onClick={() => onDelete(task.id)} style={{ fontSize: '0.8em', color: 'red' }}>Excluir</button>
      </div>
    </div>
  );
};