package com.example.kanban.controller;

import com.example.kanban.model.Card;
import com.example.kanban.model.User;
import com.example.kanban.service.BoardService;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

record MoveReq(@NotNull Long toColumnId, @NotNull Long reasonId, String note) {}
record CreateCardReq(@NotNull Long columnId, @NotNull String title, String description) {}

@RestController
@RequestMapping("/api/cards")
public class CardController {
    private final BoardService boardService;
    public CardController(BoardService boardService) { this.boardService = boardService; }

    @PostMapping
    public Card create(@RequestBody CreateCardReq req) {
        return boardService.createCard(req.columnId(), req.title(), req.description());
    }

    @PostMapping("/{id}/move")
    public Card move(@PathVariable Long id, @RequestBody MoveReq req, @AuthenticationPrincipal User user) {
        return boardService.moveCard(id, req.toColumnId(), req.reasonId(), req.note(), user);
    }
}
