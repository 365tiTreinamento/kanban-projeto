package com.example.kanban.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TimeEntry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY) private Card card;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY) private User user;
    @Enumerated(EnumType.STRING) private TimeClassification classification;
    private Instant startedAt;
    private Instant endedAt;
    private boolean active;
    private String note;
    private String columnNameAtStart;

    public static TimeEntry builder() {
        return new TimeEntry();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Card getCard() {
        return card;
    }

    public TimeEntry setCard(Card card) {
        this.card = card;
        return this;
    }

    public User getUser() {
        return user;
    }

    public TimeEntry setUser(User user) {
        this.user = user;
        return this;
    }

    public TimeClassification getClassification() {
        return classification;
    }

    public TimeEntry setClassification(TimeClassification classification) {
        this.classification = classification;
        return this;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public TimeEntry setStartedAt(Instant startedAt) {
        this.startedAt = startedAt;
        return this;
    }

    public Instant getEndedAt() {
        return endedAt;
    }

    public TimeEntry setEndedAt(Instant endedAt) {
        this.endedAt = endedAt;
        return this;
    }

    public boolean isActive() {
        return active;
    }

    public TimeEntry setActive(boolean active) {
        this.active = active;
        return this;
    }

    public String getNote() {
        return note;
    }

    public TimeEntry setNote(String note) {
        this.note = note;
        return this;
    }

    public String getColumnNameAtStart() {
        return columnNameAtStart;
    }

    public TimeEntry setColumnNameAtStart(String columnNameAtStart) {
        this.columnNameAtStart = columnNameAtStart;
        return this;
    }
}
