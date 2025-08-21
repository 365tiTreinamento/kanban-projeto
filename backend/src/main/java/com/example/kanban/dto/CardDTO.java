package com.example.kanban.dto;

import com.example.kanban.entity.CardEntity;
import com.example.kanban.entity.CardHistoryEntity;
import com.example.kanban.entity.CheckListEntity;
import com.example.kanban.entity.LabelEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.List;

public class CardDTO {

    Integer id;

    String name;
    String description;

    Long workedTime;

    Integer boardId;

    List<CardHistoryEntity> history;
    List<CheckListEntity> checklists;
    List<LabelEntity> labels;

    public CardDTO() {
    }

    public CardDTO(CardEntity card) {
        this.id = card.getId();
        this.name = card.getName();
        this.description = card.getDescription();
        this.workedTime = card.getWorkedTime();
        this.boardId = card.getBoardId();
    }

    public CardDTO(Integer id, String name, String description, Long workedTime, Integer boardId,
                   List<CardHistoryEntity> history, List<CheckListEntity> checklists, List<LabelEntity> labels) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.workedTime = workedTime;
        this.boardId = boardId;
        this.history = history;
        this.checklists = checklists;
        this.labels = labels;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getWorkedTime() {
        return workedTime;
    }

    public void setWorkedTime(Long workedTime) {
        this.workedTime = workedTime;
    }

    public Integer getBoardId() {
        return boardId;
    }

    public void setBoardId(Integer boardId) {
        this.boardId = boardId;
    }

    public List<CardHistoryEntity> getHistory() {
        return history;
    }

    public void setHistory(List<CardHistoryEntity> history) {
        this.history = history;
    }

    public List<CheckListEntity> getChecklists() {
        return checklists;
    }

    public void setChecklists(List<CheckListEntity> checklists) {
        this.checklists = checklists;
    }

    public List<LabelEntity> getLabels() {
        return labels;
    }

    public void setLabels(List<LabelEntity> labels) {
        this.labels = labels;
    }

}
