package com.example.kanban.repo;

import com.example.kanban.model.KColumn;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KColumnRepo extends JpaRepository<KColumn, Long> {
    
}
