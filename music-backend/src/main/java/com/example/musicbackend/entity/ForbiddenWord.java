package com.example.musicbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "FORBIDDEN_WORDS")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForbiddenWord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String word; // 차단할 단어

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt = LocalDateTime.now();
}