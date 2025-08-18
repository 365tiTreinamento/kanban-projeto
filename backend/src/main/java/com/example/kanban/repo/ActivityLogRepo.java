package com.example.kanban.repo;

import com.example.kanban.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepo extends JpaRepository<ActivityLog, Long> {
    
}
