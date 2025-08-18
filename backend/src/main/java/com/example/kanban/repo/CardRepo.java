package com.example.kanban.repo;

import com.example.kanban.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepo extends JpaRepository<Card, Long> {
    
}
