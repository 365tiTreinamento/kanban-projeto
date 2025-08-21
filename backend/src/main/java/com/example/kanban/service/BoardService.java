package com.example.kanban.service;

import com.example.kanban.dto.BoardDTO;
import com.example.kanban.dto.CardDTO;
import com.example.kanban.entity.BoardEntity;
import com.example.kanban.entity.CardEntity;
import com.example.kanban.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private CardHistoryRepository cardHistoryRepository;

    @Autowired
    private CheckListRepository checkListRepository;

    @Autowired
    private LabelRepository labelRepository;

    public BoardDTO getBoardFull(Integer id) {
        Optional<BoardEntity> foundBoard = boardRepository.findBoard(id);
        if (foundBoard.isPresent()) {
            BoardEntity board = foundBoard.get();
            List<CardEntity> cards = cardRepository.findCardsByBoardId(id);

            return new BoardDTO(board, mergeCardRelations(cards));
        }

        return null;
    }

    private List<CardDTO> mergeCardRelations(List<CardEntity> cards) {
        if (cards == null || cards.isEmpty()) return Collections.emptyList();

        List<CardDTO> dtoCards = cards.stream().map(CardDTO::new).toList();
        for (CardDTO dtoCard : dtoCards) {
            dtoCard.setHistory(cardHistoryRepository.findAllByCardId(dtoCard.getId()));
            dtoCard.setChecklists(checkListRepository.findAllByCardId(dtoCard.getId()));
            dtoCard.setLabels(labelRepository.findAllByCardId(dtoCard.getId()));
        }

        return dtoCards;
    }

    public BoardEntity getBoard(Integer id) {
        return boardRepository.findBoard(id)
                .orElseThrow(() -> new RuntimeException("Board not found"));
    }

}