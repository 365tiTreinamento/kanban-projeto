package com.example.kanban.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MovementReason {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String name;
    private String description;
    private boolean active = true;

    public static MovementReason builder() {
        return new MovementReason();
    }

    public Long getId() {
        return id;
    }

    public MovementReason setId(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public MovementReason setName(String name) {
        this.name = name;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public MovementReason setDescription(String description) {
        this.description = description;
        return this;
    }

    public boolean isActive() {
        return active;
    }

    public MovementReason setActive(boolean active) {
        this.active = active;
        return this;
    }
}
