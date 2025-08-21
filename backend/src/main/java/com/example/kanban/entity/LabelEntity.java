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


    @ManyToOne
    @JoinColumn(name = "card_id")
    private CardEntity card;

    public LabelEntity() {
    }

    public LabelEntity(Integer id, String name, String color, CardEntity card) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.card = card;
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

    public CardEntity getCard() {
        return card;
    }

}
