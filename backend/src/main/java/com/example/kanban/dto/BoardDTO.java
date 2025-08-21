package com.example.kanban.dto;

import com.example.kanban.entity.BoardEntity;

import java.util.List;

public class BoardDTO {

    Integer id;
    String name;
    List<CardDTO> cards;

    public BoardDTO() {
    }

    public BoardDTO(BoardEntity board, List<CardDTO> cards) {
        this.id = board.getId();
        this.name = board.getName();
        this.cards = cards;
    }

    public BoardDTO(Integer id, String name, List<CardDTO> cards) {
        this.id = id;
        this.name = name;
        this.cards = cards;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<CardDTO> getCards() {
        return cards;
    }

    public void setCards(List<CardDTO> cards) {
        this.cards = cards;
    }

}
