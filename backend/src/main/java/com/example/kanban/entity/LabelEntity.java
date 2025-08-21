package com.example.kanban.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "label")
public class LabelEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "color")
    private String color;


    @Column(name = "card_id")
    private Integer cardId;

    public LabelEntity() {
    }

    public LabelEntity(Integer id, String name, String color, Integer cardId) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.cardId = cardId;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getColor() {
        return color;
    }

    public Integer getCardId() {
        return cardId;
    }

}
