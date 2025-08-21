package com.example.kanban.controller;

import com.example.kanban.entity.BoardEntity;
import com.example.kanban.service.BoardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/boards")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping("/{id}/full")
    public ResponseEntity<BoardEntity> getBoardFull(@PathVariable Integer id) {
        return ResponseEntity.ok(boardService.getBoardFull(id));
    }

    @GetMapping("/{id}/lists")
    public ResponseEntity<BoardEntity> getBoardWithLists(@PathVariable Integer id) {
        return ResponseEntity.ok(boardService.getBoardWithLists(id));
    }

}