package com.example.kanban.repo;

import com.example.kanban.model.CardAssignee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardAssigneeRepo extends JpaRepository<CardAssignee, Long> {
    java.util.List<CardAssignee> findByCardId(Long cardId);
}
