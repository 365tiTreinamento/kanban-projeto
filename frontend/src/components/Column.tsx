import React from 'react';
import { Column as ColumnType, Card } from '../types';
import CardComponent from './Card';
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
  };

  return (
    <div 
      className="column"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="column-header">
        <h3>{column.name}</h3>
        <span className="card-count">({column.cards?.length || 0})</span>
      </div>
      
      <div className="cards-list">
        {column.cards?.map((card) => (
          <CardComponent 
            key={card.id} 
            card={card} 
          />
        ))}
      </div>
    </div>
  );
};

export default Column;