package com.example.kanban.controller;

import com.example.kanban.model.Project;
import com.example.kanban.service.BoardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/boards")
public class BoardController {
    private final BoardService boardService;
    public BoardController(BoardService boardService) { this.boardService = boardService; }

    @GetMapping("/{projectId}")
    public Project get(@PathVariable Long projectId) { return boardService.getProject(projectId); }
}
