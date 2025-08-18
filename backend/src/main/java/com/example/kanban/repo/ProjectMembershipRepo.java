package com.example.kanban.repo;

import com.example.kanban.model.ProjectMembership;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectMembershipRepo extends JpaRepository<ProjectMembership, Long> {
    java.util.List<ProjectMembership> findByProjectId(Long projectId);
}
