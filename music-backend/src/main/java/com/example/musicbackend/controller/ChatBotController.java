package com.example.musicbackend.controller;

import com.example.musicbackend.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:3000") // 🌟 핵심! 프론트엔드 접속 허용
public class ChatBotController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> request) {
        // 프론트에서 보낸 메시지 받기
        String userMessage = request.get("message");

        // 서비스에게 질문하고 답 얻기
        String aiResponse = geminiService.getChatResponse(userMessage);

        // 프론트로 답장 보내기
        return ResponseEntity.ok(Map.of("response", aiResponse));
    }
}