package com.example.kanban.controller;

import com.example.kanban.model.TimeClassification;
import com.example.kanban.model.TimeEntry;
import com.example.kanban.model.User;
import com.example.kanban.service.TimeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

record StartReq(TimeClassification classification, String note) {}
record PauseReq(TimeClassification classification, String note) {}
record NoteReq(String note) {}

@RestController
@RequestMapping("/api/cards/{cardId}/time")
public class TimeController {
    private final TimeService timeService;
    public TimeController(TimeService timeService) { this.timeService = timeService; }

    @PostMapping("/start")
    public TimeEntry start(@PathVariable Long cardId, @RequestBody StartReq req, @AuthenticationPrincipal User user) {
        return timeService.start(cardId, user, req.classification(), req.note());
    }

    @PostMapping("/pause")
    public TimeEntry pause(@PathVariable Long cardId, @RequestBody PauseReq req, @AuthenticationPrincipal User user) {
        return timeService.pause(cardId, user, req.classification(), req.note());
    }

    @PostMapping("/stop")
    public TimeEntry stop(@PathVariable Long cardId, @RequestBody NoteReq req, @AuthenticationPrincipal User user) {
        return timeService.stop(cardId, user, req.note());
    }

    @GetMapping("/report")
    public Map<String, Long> report(@PathVariable Long cardId) { return timeService.reportByClassification(cardId); }
}
