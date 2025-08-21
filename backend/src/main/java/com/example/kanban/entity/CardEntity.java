package com.example.kanban.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "card")
public class CardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "worked_time")
    private Long workedTime;

    @Column(name = "board_id")
    private Integer boardId;

    public CardEntity() {
    }

    public CardEntity(Integer id, String name, String description, Long workedTime, Integer boardId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.workedTime = workedTime;
        this.boardId = boardId;
    }

    public Integer getId() {
        return id;
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

}
