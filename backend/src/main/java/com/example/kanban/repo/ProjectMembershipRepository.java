package com.kanban.repository;

import com.kanban.model.Project;
import com.kanban.model.ProjectMembership;
import com.kanban.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMembershipRepository extends JpaRepository<ProjectMembership, Long> {
    
    Optional<ProjectMembership> findByProjectAndUser(Project project, User user);
    
    boolean existsByProjectAndUser(Project project, User user);
    
    List<ProjectMembership> findByProject(Project project);
    
    @Query("SELECT pm.project FROM ProjectMembership pm WHERE pm.user = :user")
    List<Project> findProjectsByUser(@Param("user") User user);
    
    void deleteByProjectAndUser(Project project, User user);
}