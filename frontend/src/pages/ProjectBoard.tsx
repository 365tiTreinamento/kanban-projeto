import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { cardService } from '../services/cardService';
import { Column, Card } from '../types';
import ColumnComponent from '../components/Column';
import './ProjectBoard.css';

export default function ProjectBoard() {
  const { id } = useParams<{ id: string }>();
  const [columns, setColumns] = useState<Column[]>([]);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadProjectData();
    }
  }, [id]);

  const loadProjectData = async () => {
    try {
      const projectResponse = await projectService.getProjectById(parseInt(id!));
      const projectData = projectResponse;
      setProject(projectData);

      const cardsResponse = await cardService.getAllCards(parseInt(id!));
      const cards = cardsResponse;

      // Organize cards by column
      const columnsWithCards = projectData.columns?.map((column: Column) => ({
        ...column,
        cards: cards.filter((card: Card) => card.columnId === column.id)
      }));

      setColumns(columnsWithCards || []);
    } catch (err) {
      setError('Failed to load project data');
      console.error('Error loading project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardMove = async (cardId: number, newColumnId: number) => {
    try {
      // Implementar modal para selecionar motivo depois
      const reasonId = 1; // Temporário
      
      await cardService.moveCard(cardId, newColumnId, reasonId);
      await loadProjectData(); // Recarregar dados
    } catch (err) {
      console.error('Error moving card:', err);
      alert('Failed to move card');
    }
  };

  if (loading) return <div className="loading">Loading board...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!project) return <div className="error">Project not found</div>;

  return (
    <div className="project-board-container">
      <div className="board-header">
        <h1>{project.name}</h1>
        <p className="project-description">{project.description}</p>
      </div>
      
      <div className="columns-container">
        {columns.map((column) => (
          <ColumnComponent
            key={column.id}
            column={column}
            onCardMove={handleCardMove}
          />
        ))}
      </div>
    </div>
  );
}