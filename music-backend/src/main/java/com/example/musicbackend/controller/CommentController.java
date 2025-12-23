package com.example.musicbackend.controller;

import com.example.musicbackend.entity.Comment;
import com.example.musicbackend.repository.CommentRepository;
import com.example.musicbackend.service.CleanBotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CleanBotService cleanBotService;

    // 댓글 목록 조회
    @GetMapping("/{albumId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String albumId) {
        List<Comment> comments = commentRepository.findByAlbumIdOrderByCreatedAtDesc(albumId);
        return ResponseEntity.ok(comments);
    }

    // 🌟 [수정됨] 댓글 등록 (검사 후 거절 기능 추가)
    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody Comment comment) {
        try {
            // 1. 클린봇에게 검사 시킴 (문제 있으면 여기서 에러 터짐)
            cleanBotService.checkContent(comment.getContent());

            // 2. 통과했으면 DB 저장
            commentRepository.save(comment);

            return ResponseEntity.ok("댓글이 등록되었습니다.");

        } catch (RuntimeException e) {
            // 3. 욕설이 걸려서 에러가 난 경우 -> 400 에러와 함께 메시지 반환
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}