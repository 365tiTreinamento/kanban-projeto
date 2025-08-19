import React from 'react';
import { Card as CardType } from '../types';
import './TaskCard.css';

interface TaskCardProps {
  card: CardType;
  onEdit?: (card: CardType) => void;
  onDelete?: (cardId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ card, onEdit, onDelete }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('cardId', card.id.toString());
    e.dataTransfer.setData('cardTitle', card.title);
  };

  const isOverdue = card.dueAt && new Date(card.dueAt) < new Date();

  return (
    <div 
      className="task-card"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="task-card-header">
        <h4 className="task-card-title">{card.title}</h4>
        {card.flagColor && (
          <span 
            className="task-card-flag"
            style={{ backgroundColor: card.flagColor }}
          />
        )}
      </div>
      
      {card.description && (
        <p className="task-card-description">{card.description}</p>
      )}
      
      {card.dueAt && (
        <div className={`task-card-due-date ${isOverdue ? 'overdue' : ''}`}>
          📅 {new Date(card.dueAt).toLocaleDateString()}
          {isOverdue && <span className="overdue-badge">Overdue</span>}
        </div>
      )}
      
      {card.logoUrl && (
        <img 
          src={card.logoUrl} 
          alt="Card logo" 
          className="task-card-logo"
        />
      )}
      
      {(onEdit || onDelete) && (
        <div className="task-card-actions">
          {onEdit && (
            <button 
              className="task-card-btn edit"
              onClick={() => onEdit(card)}
              title="Edit card"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button 
              className="task-card-btn delete"
              onClick={() => onDelete(card.id)}
              title="Delete card"
            >
              🗑️
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;