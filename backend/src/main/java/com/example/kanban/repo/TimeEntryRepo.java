package com.example.kanban.repo;

import com.example.kanban.model.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeEntryRepo extends JpaRepository<TimeEntry, Long> {
    java.util.List<TimeEntry> findByCardIdAndActive(Long cardId, boolean active);
}
