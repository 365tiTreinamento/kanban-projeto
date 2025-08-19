// components/Column.tsx
import { Task } from '../types/Task';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: Task['status']) => void;
}

const statusLabels: Record<Task['status'], string> = {
  todo: 'To Do',
  inProgress: 'Em Progresso',
  done: 'Concluído',
};

export const Column = ({
  title,
  tasks,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
}: ColumnProps) => {
  const statusKey = Object.keys(statusLabels).find(
    (key) => statusLabels[key as Task['status']] === title
  ) as Task['status'] || 'todo';

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, statusKey)}
      style={{
        minWidth: '300px',
        padding: '16px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        height: '100%',
      }}
    >
      <h3>{title}</h3>
      <div style={{ minHeight: '500px' }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
          >
            <TaskCard task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          </div>
        ))}
      </div>
    </div>
  );
};