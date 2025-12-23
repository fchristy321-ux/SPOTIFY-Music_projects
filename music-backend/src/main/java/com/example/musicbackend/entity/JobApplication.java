package com.example.musicbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "JOB_APPLICATIONS")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "JOB_TITLE")
    private String jobTitle;

    private String company;
    private String message;

    @Column(name = "APPLIED_AT")
    private LocalDateTime appliedAt = LocalDateTime.now();
}