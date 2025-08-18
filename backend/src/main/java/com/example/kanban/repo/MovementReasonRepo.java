package com.example.kanban.repo;

import com.example.kanban.model.MovementReason;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovementReasonRepo extends JpaRepository<MovementReason, Long> {
    
}
