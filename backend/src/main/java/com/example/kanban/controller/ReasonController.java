package com.example.kanban.controller;

import com.example.kanban.model.MovementReason;
import com.example.kanban.repo.MovementReasonRepo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movement-reasons")
public class ReasonController {
    private final MovementReasonRepo repo;
    public ReasonController(MovementReasonRepo repo) { this.repo = repo; }

    @GetMapping public List<MovementReason> all() { return repo.findAll(); }
}
