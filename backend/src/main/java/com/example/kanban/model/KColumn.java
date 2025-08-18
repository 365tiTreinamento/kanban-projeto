package com.example.kanban.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name = "columns")
public class KColumn {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int position;

    @ManyToOne(fetch = FetchType.LAZY)
    private Project project;

    @OneToMany(mappedBy = "column", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")
    private List<Card> cards;

    public static KColumn builder() {
        return new KColumn();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public KColumn setName(String name) {
        this.name = name;
        return this;
    }

    public int getPosition() {
        return position;
    }

    public KColumn setPosition(int position) {
        this.position = position;
        return this;
    }

    public Project getProject() {
        return project;
    }

    public KColumn setProject(Project project) {
        this.project = project;
        return this;
    }

    public List<Card> getCards() {
        return cards;
    }

    public KColumn setCards(List<Card> cards) {
        this.cards = cards;
        return this;
    }
}
