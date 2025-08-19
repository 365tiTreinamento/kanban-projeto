import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { Project } from '../types';
import { Link } from 'react-router-dom';
import './Dashboard.css';


export default function Dashboard() {
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

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Projects</h1>
        <Link to="/projects" className="view-all-link">
          View All Projects
        </Link>
      </div>

      <div className="projects-grid">
        {projects.slice(0, 6).map((project) => (
          <Link
            key={project.id}
            to={`/project/${project.id}`}
            className="project-card"
          >
            <div className="project-card-content">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-meta">
                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <h2>No projects yet</h2>
          <p>Create your first project to get started</p>
          <Link to="/projects" className="create-project-btn">
            Create Project
          </Link>
        </div>
      )}
    </div>
  );
}