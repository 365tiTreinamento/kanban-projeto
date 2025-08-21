package com.kanban.controller;

import com.kanban.model.Project;
import com.kanban.model.ProjectMembership;
import com.kanban.model.User;
import com.kanban.service.ProjectService;
import com.kanban.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    // Criar novo projeto
    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Project project, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email);
            
            Project createdProject = projectService.createProject(project, user);
            return ResponseEntity.ok(createdProject);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar projeto: " + e.getMessage());
        }
    }

    // Listar todos os projetos do usuário
    @GetMapping
    public ResponseEntity<List<Project>> getUserProjects(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email);
            
            List<Project> projects = projectService.getUserProjects(user);
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Buscar projeto por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email);
            
            Project project = projectService.getProjectById(id, user);
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar projeto: " + e.getMessage());
        }
    }

    // Atualizar projeto
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Project projectDetails, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email);
            
            Project updatedProject = projectService.updateProject(id, projectDetails, user);
            return ResponseEntity.ok(updatedProject);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar projeto: " + e.getMessage());
        }
    }

    // Deletar projeto
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email);
            
            projectService.deleteProject(id, user);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar projeto: " + e.getMessage());
        }
    }

    // Adicionar membro ao projeto
    @PostMapping("/{projectId}/members")
    public ResponseEntity<?> addMember(@PathVariable Long projectId, @RequestBody ProjectMembership membership, Authentication authentication) {
        try {
            String email = authentication.getName();
            User currentUser = userService.findByEmail(email);
            
            ProjectMembership addedMember = projectService.addMember(projectId, membership, currentUser);
            return ResponseEntity.ok(addedMember);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao adicionar membro: " + e.getMessage());
        }
    }

    // Remover membro do projeto
    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<?> removeMember(@PathVariable Long projectId, @PathVariable Long userId, Authentication authentication) {
        try {
            String email = authentication.getName();
            User currentUser = userService.findByEmail(email);
            
            projectService.removeMember(projectId, userId, currentUser);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao remover membro: " + e.getMessage());
        }
    }

    // Listar membros do projeto
    @GetMapping("/{projectId}/members")
    public ResponseEntity<?> getProjectMembers(@PathVariable Long projectId, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email);
            
            List<ProjectMembership> members = projectService.getProjectMembers(projectId, user);
            return ResponseEntity.ok(members);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao listar membros: " + e.getMessage());
        }
    }
}