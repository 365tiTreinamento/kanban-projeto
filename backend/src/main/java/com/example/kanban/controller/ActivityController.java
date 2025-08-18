package com.example.kanban.controller;

import com.example.kanban.model.ActivityLog;
import com.example.kanban.repo.ActivityLogRepo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {
    private final ActivityLogRepo repo;
    public ActivityController(ActivityLogRepo repo) { this.repo = repo; }

    @GetMapping public List<ActivityLog> all() { return repo.findAll(); }
}
