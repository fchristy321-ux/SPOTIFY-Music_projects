package com.example.musicbackend.repository;

import com.example.musicbackend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // 특정 앨범의 댓글만 최신순으로 가져오기
    List<Comment> findByAlbumIdOrderByCreatedAtDesc(String albumId);
}