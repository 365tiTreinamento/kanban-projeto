package com.example.kanban.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.List;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Card {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 4000)
    private String description;
    private String flagColor; // hex
    private String logoUrl;
    private Instant createdAt = Instant.now();
    private Instant dueAt;

    private int position;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    private KColumn column;

    @OneToMany(mappedBy = "card", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TimeEntry> timeEntries;

    @OneToMany(mappedBy = "card", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CardAssignee> assignees;

    @OneToMany(mappedBy = "card", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attachment> attachments;

    public static Card builder() {
        return new Card();
    }

    public Long getId() {
        return id;
    }

    public Card setId(Long id) {
        this.id = id;
        return this;
    }

    public String getTitle() {
        return title;
    }

    public Card setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public Card setDescription(String description) {
        this.description = description;
        return this;
    }

    public String getFlagColor() {
        return flagColor;
    }

    public Card setFlagColor(String flagColor) {
        this.flagColor = flagColor;
        return this;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public Card setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
        return this;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Card setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public Instant getDueAt() {
        return dueAt;
    }

    public Card setDueAt(Instant dueAt) {
        this.dueAt = dueAt;
        return this;
    }

    public int getPosition() {
        return position;
    }

    public Card setPosition(int position) {
        this.position = position;
        return this;
    }

    public KColumn getColumn() {
        return column;
    }

    public Card setColumn(KColumn column) {
        this.column = column;
        return this;
    }

    public List<TimeEntry> getTimeEntries() {
        return timeEntries;
    }

    public Card setTimeEntries(List<TimeEntry> timeEntries) {
        this.timeEntries = timeEntries;
        return this;
    }

    public List<CardAssignee> getAssignees() {
        return assignees;
    }

    public Card setAssignees(List<CardAssignee> assignees) {
        this.assignees = assignees;
        return this;
    }

    public List<Attachment> getAttachments() {
        return attachments;
    }

    public Card setAttachments(List<Attachment> attachments) {
        this.attachments = attachments;
        return this;
    }
}
