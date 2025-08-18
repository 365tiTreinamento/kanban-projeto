package com.example.kanban.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Attachment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String filename;
    private String url;
    private String contentType;
    private long size;
    private boolean isLogo;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    private Card card;
}
