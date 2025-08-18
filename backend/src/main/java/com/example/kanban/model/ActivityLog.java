package com.example.kanban.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ActivityLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Instant at = Instant.now();
    private String action; // CARD_MOVED, CARD_CREATED, LOGIN, LOGOUT, TIME_START, TIME_PAUSE, TIME_STOP
    private String details;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    public static ActivityLog builder() {
        return new ActivityLog();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getAt() {
        return at;
    }

    public ActivityLog setAt(Instant at) {
        this.at = at;
        return this;
    }

    public String getAction() {
        return action;
    }

    public ActivityLog setAction(String action) {
        this.action = action;
        return this;
    }

    public String getDetails() {
        return details;
    }

    public ActivityLog setDetails(String details) {
        this.details = details;
        return this;
    }

    public User getUser() {
        return user;
    }

    public ActivityLog setUser(User user) {
        this.user = user;
        return this;
    }
}
