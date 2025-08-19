import React from 'react';
import { Column as ColumnType } from '../types';
import TaskCard from './TaskCard';
import './Column.css';

interface ColumnProps {
  column: ColumnType;
  onCardMove: (cardId: number, newColumnId: number) => void;
}

const Column: React.FC<ColumnProps> = ({ column, onCardMove }) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const cardId = parseInt(e.dataTransfer.getData('cardId'));
    onCardMove(cardId, column.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  return (
    <div 
      className="column"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <div className="column-header">
        <h3 className="column-title">{column.name}</h3>
        <span className="card-count">({column.cards?.length || 0})</span>
      </div>
      
      <div className="cards-list">
        {column.cards?.map((card) => (
          <TaskCard 
            key={card.id} 
            card={card}
          />
        ))}
        
        {(!column.cards || column.cards.length === 0) && (
          <div className="empty-column">
            <p>Drop cards here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;