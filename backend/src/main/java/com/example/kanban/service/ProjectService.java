package com.kanban.service;

import com.kanban.model.Project;
import com.kanban.model.ProjectMembership;
import com.kanban.model.User;
import com.kanban.repository.ProjectRepository;
import com.kanban.repository.ProjectMembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectMembershipRepository projectMembershipRepository;

    @Autowired
    private UserService userService;

    public Project createProject(Project project, User owner) {
        project.setCreatedAt(LocalDateTime.now());
        Project savedProject = projectRepository.save(project);
        
        // Adicionar o criador como owner do projeto
        ProjectMembership ownership = new ProjectMembership();
        ownership.setProject(savedProject);
        ownership.setUser(owner);
        ownership.setRole("OWNER");
        projectMembershipRepository.save(ownership);
        
        return savedProject;
    }

    public List<Project> getUserProjects(User user) {
        return projectMembershipRepository.findProjectsByUser(user);
    }

    public Project getProjectById(Long id, User user) {
        Optional<Project> projectOpt = projectRepository.findById(id);
        if (projectOpt.isEmpty()) {
            throw new RuntimeException("Projeto não encontrado");
        }
        
        Project project = projectOpt.get();
        if (!hasAccess(project, user)) {
            throw new RuntimeException("Acesso negado ao projeto");
        }
        
        return project;
    }

    public Project updateProject(Long id, Project projectDetails, User user) {
        Optional<Project> projectOpt = projectRepository.findById(id);
        if (projectOpt.isEmpty()) {
            throw new RuntimeException("Projeto não encontrado");
        }
        
        Project project = projectOpt.get();
        if (!isOwner(project, user)) {
            throw new RuntimeException("Apenas o owner pode atualizar o projeto");
        }
        
        project.setName(projectDetails.getName());
        project.setDescription(projectDetails.getDescription());
        
        return projectRepository.save(project);
    }

    public void deleteProject(Long id, User user) {
        Optional<Project> projectOpt = projectRepository.findById(id);
        if (projectOpt.isEmpty()) {
            throw new RuntimeException("Projeto não encontrado");
        }
        
        Project project = projectOpt.get();
        if (!isOwner(project, user)) {
            throw new RuntimeException("Apenas o owner pode deletar o projeto");
        }
        
        projectRepository.delete(project);
    }

    public ProjectMembership addMember(Long projectId, ProjectMembership membership, User currentUser) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            throw new RuntimeException("Projeto não encontrado");
        }
        
        Project project = projectOpt.get();
        if (!isOwner(project, currentUser)) {
            throw new RuntimeException("Apenas o owner pode adicionar membros");
        }
        
        // Verificar se o usuário já é membro
        Optional<ProjectMembership> existingMembership = projectMembershipRepository
            .findByProjectAndUser(project, membership.getUser());
        
        if (existingMembership.isPresent()) {
            throw new RuntimeException("Usuário já é membro deste projeto");
        }
        
        membership.setProject(project);
        return projectMembershipRepository.save(membership);
    }

    public void removeMember(Long projectId, Long userId, User currentUser) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            throw new RuntimeException("Projeto não encontrado");
        }
        
        Project project = projectOpt.get();
        if (!isOwner(project, currentUser)) {
            throw new RuntimeException("Apenas o owner pode remover membros");
        }
        
        Optional<User> userToRemoveOpt = userService.findById(userId);
        if (userToRemoveOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }
        
        User userToRemove = userToRemoveOpt.get();
        Optional<ProjectMembership> membershipOpt = projectMembershipRepository
            .findByProjectAndUser(project, userToRemove);
        
        if (membershipOpt.isEmpty()) {
            throw new RuntimeException("Usuário não é membro deste projeto");
        }
        
        ProjectMembership membership = membershipOpt.get();
        if ("OWNER".equals(membership.getRole())) {
            throw new RuntimeException("Não é possível remover o owner do projeto");
        }
        
        projectMembershipRepository.delete(membership);
    }

    public List<ProjectMembership> getProjectMembers(Long projectId, User user) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            throw new RuntimeException("Projeto não encontrado");
        }
        
        Project project = projectOpt.get();
        if (!hasAccess(project, user)) {
            throw new RuntimeException("Acesso negado ao projeto");
        }
        
        return projectMembershipRepository.findByProject(project);
    }

    private boolean hasAccess(Project project, User user) {
        return projectMembershipRepository.existsByProjectAndUser(project, user);
    }

    private boolean isOwner(Project project, User user) {
        Optional<ProjectMembership> membership = projectMembershipRepository
            .findByProjectAndUser(project, user);
        
        return membership.isPresent() && "OWNER".equals(membership.get().getRole());
    }
}