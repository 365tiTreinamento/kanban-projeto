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


    @ManyToOne
    @JoinColumn(name = "card_id")
    private CardEntity card;

    public CheckListEntity() {
    }

    public CheckListEntity(Integer id, String name, CardEntity card) {
        this.id = id;
        this.name = name;
        this.card = card;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public CardEntity getCard() {
        return card;
    }

}
