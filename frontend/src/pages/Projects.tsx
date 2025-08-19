import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { Project } from '../types';
import { Link } from 'react-router-dom';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectService.getAllProjects();
      setProjects(response);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading projects...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>All Projects</h1>
        <button className="create-project-btn">
          Create New Project
        </button>
      </div>

      <div className="projects-list">
        {projects.map((project) => (
          <div key={project.id} className="project-item">
            <Link to={`/project/${project.id}`} className="project-link">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-meta">
                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <h2>No projects found</h2>
          <p>Create your first project to get started</p>
        </div>
      )}
    </div>
  );
}