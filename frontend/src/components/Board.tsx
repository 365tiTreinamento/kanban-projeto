// components/Board.tsx
import { Task } from '../types/Task';
import { Column } from './Column';
import { useState } from 'react';

export const Board = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Criar tela de login',
      description: 'Implementar autenticação com Firebase',
      status: 'todo',
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Testar API',
      status: 'inProgress',
      createdAt: new Date(),
    },
  ]);

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === draggedTaskId ? { ...task, status } : task
      )
    );
    setDraggedTaskId(null);
  };

  const handleEditTask = (task: Task) => {
    // Aqui você pode abrir um modal ou formulário
    alert(`Editar tarefa: ${task.title}`);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    }
  };

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'inProgress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  return (
    <div style={{ display: 'flex', gap: '16px', padding: '20px', flexWrap: 'wrap' }}>
      <Column
        title="To Do"
        tasks={todoTasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <Column
        title="Em Progresso"
        tasks={inProgressTasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
      <Column
        title="Concluído"
        tasks={doneTasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
    </div>
  );
};