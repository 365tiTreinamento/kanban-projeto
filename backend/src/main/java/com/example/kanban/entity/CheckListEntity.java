package com.example.kanban.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "checklist")
public class CheckListEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;


    @Column(name = "card_id")
    private Integer cardId;

    public CheckListEntity() {
    }

    public CheckListEntity(Integer id, String name, Integer cardId) {
        this.id = id;
        this.name = name;
        this.cardId = cardId;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getCardId() {
        return cardId;
    }

}
