package com.example.kanban.service;

import com.example.kanban.entity.BoardEntity;
import com.example.kanban.entity.CardEntity;
import com.example.kanban.repository.BoardRepository;
import org.springframework.stereotype.Service;

@Service
public class BoardService {

    private final BoardRepository boardRepository;

    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    public BoardEntity getBoardFull(Integer id) {
        return boardRepository.findBoardWithAllRelations(id)
                .orElseThrow(() -> new RuntimeException("Board not found"));
    }

    public BoardEntity getBoardWithLists(Integer id) {
        return boardRepository.findBoardWithLists(id)
                .orElseThrow(() -> new RuntimeException("Board not found"));
    }

    public CardEntity getCardFull(Integer cardId) {
        return boardRepository.findCardWithAllRelations(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
    }

}