package com.example.kanban.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "card_history")
public class CardHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "type")
    private String type;

    @Column(name = "description")
    private String description;

    @Column(name = "current_worked_time")
    private Long currentWorkedTime;


    @ManyToOne
    @JoinColumn(name = "card_id")
    private CardEntity card;

    public CardHistoryEntity() {
    }

    public CardHistoryEntity(Integer id, String type, String description, Long currentWorkedTime, CardEntity card) {
        this.id = id;
        this.type = type;
        this.description = description;
        this.currentWorkedTime = currentWorkedTime;
        this.card = card;
    }

    public Integer getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public Long getCurrentWorkedTime() {
        return currentWorkedTime;
    }

    public CardEntity getCard() {
        return card;
    }

}
