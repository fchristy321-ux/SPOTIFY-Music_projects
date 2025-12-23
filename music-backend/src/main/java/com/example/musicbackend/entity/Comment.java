package com.example.musicbackend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp; // 1. 이거 추가!

import java.time.LocalDateTime;

@Entity
@Table(name = "COMMENTS")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ALBUM_ID")
    private String albumId;

    @Column(nullable = false)
    private String content;

    private String author;

    // 🌟 [수정된 부분]
    // = LocalDateTime.now()를 지우고 어노테이션을 붙입니다.
    // DB에 저장될 때 자동으로 현재 서버 시간(12월 23일...)이 들어갑니다.
    @CreationTimestamp
    @Column(name = "CREATED_AT", updatable = false) // 수정 불가 옵션 추가
    private LocalDateTime createdAt;
}