package com.example.musicbackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getChatResponse(String userMessage) {
        try {
            // 🚨 [핵심 수정] 주소 뒤에 키를 붙이는 게 아니라,
            // HTTP 헤더(Header)에 'x-goog-api-key'라는 이름으로 키를 담아 보냅니다.
            // 이게 구글 API의 정석 인증 방식입니다. (403 에러 해결)

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", apiKey); // 🔑 여기에 키를 숨겨서 보냄!

            // [디버깅] 요청 정보 확인
            System.out.println("🚀 [Gemini] 요청 주소: " + apiUrl);
            System.out.println("🔑 [Gemini] 헤더에 키 탑재 완료");

            // 요청 본문(Body) 만들기
            Map<String, Object> requestBody = new HashMap<>();

            // 대화 내용
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(Map.of("text", userMessage)));
            contents.add(content);
            requestBody.put("contents", contents);

            // 안전 설정
            List<Map<String, String>> safetySettings = new ArrayList<>();
            safetySettings.add(Map.of("category", "HARM_CATEGORY_HARASSMENT", "threshold", "BLOCK_NONE"));
            safetySettings.add(Map.of("category", "HARM_CATEGORY_HATE_SPEECH", "threshold", "BLOCK_NONE"));
            safetySettings.add(Map.of("category", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold", "BLOCK_NONE"));
            safetySettings.add(Map.of("category", "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold", "BLOCK_NONE"));
            requestBody.put("safetySettings", safetySettings);

            // 헤더와 바디를 합체
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // API 호출 (apiUrl은 순수한 주소 그대로 사용)
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

            // 응답 처리
            String jsonResponse = response.getBody();
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode candidates = rootNode.path("candidates");

            if (candidates.isMissingNode() || candidates.isEmpty()) {
                return "AI가 답변을 생성하지 못했습니다.";
            }

            JsonNode contentNode = candidates.get(0).path("content");
            JsonNode partsNode = contentNode.path("parts");

            if (partsNode.isEmpty()) {
                return "답변 내용이 없습니다.";
            }

            return partsNode.get(0).path("text").asText();

        } catch (HttpClientErrorException e) {
            System.err.println("🔥 API 호출 에러 코드: " + e.getStatusCode());
            System.err.println("🔥 에러 메시지: " + e.getResponseBodyAsString());
            return "AI 연결 오류: " + e.getStatusCode();
        } catch (Exception e) {
            e.printStackTrace();
            return "알 수 없는 오류가 발생했습니다.";
        }
    }
}