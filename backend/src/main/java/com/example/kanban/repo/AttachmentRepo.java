package com.example.kanban.repo;

import com.example.kanban.model.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepo extends JpaRepository<Attachment, Long> {
    
}
