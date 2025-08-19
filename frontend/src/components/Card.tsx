import React from 'react';
import { Card as CardType } from '../types';
import './Card.css';

interface CardProps {
  card: CardType;
}

const CardComponent: React.FC<CardProps> = ({ card }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('cardId', card.id.toString());
  };

  return (
    <div 
      className="card"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="card-header">
        <h4>{card.title}</h4>
        {card.flagColor && (
          <span 
            className="flag" 
            style={{ backgroundColor: card.flagColor }}
          />
        )}
      </div>
      
      {card.description && (
        <p className="card-description">{card.description}</p>
      )}
      
      {card.dueAt && (
        <div className="card-due-date">
          Due: {new Date(card.dueAt).toLocaleDateString()}
        </div>
      )}
      
      {card.logoUrl && (
        <img 
          src={card.logoUrl} 
          alt="Card logo" 
          className="card-logo"
        />
      )}
    </div>
  );
};

export default CardComponent;