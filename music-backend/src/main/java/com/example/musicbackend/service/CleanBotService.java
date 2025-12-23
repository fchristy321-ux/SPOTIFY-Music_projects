package com.example.musicbackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class CleanBotService {

    @Value("${google.perspective.key}")
    private String apiKey;

    @Value("${google.perspective.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    // 🛑 차단 기준 점수 (0.0 ~ 1.0)
    // 0.70 (70%) 이상이면 욕설로 판단합니다. 너무 빡빡하면 0.80으로 올리세요.
    private static final double THRESHOLD = 0.01;

    public void checkContent(String text) {
        if (text == null || text.isEmpty()) return;

        try {
            // 1. 요청 URL 완성
            String requestUrl = apiUrl + "?key=" + apiKey;

            // 2. 요청 본문(Body) 만들기
            // JSON 구조: { "comment": {"text": "..."}, "languages": ["ko"], "requestedAttributes": {"TOXICITY": {}} }
            Map<String, Object> commentMap = new HashMap<>();
            commentMap.put("text", text);

            Map<String, Object> attributeMap = new HashMap<>();
            attributeMap.put("TOXICITY", new HashMap<>());

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("comment", commentMap);
            requestBody.put("languages", new String[]{"ko"}); // 한국어 분석 요청
            requestBody.put("requestedAttributes", attributeMap);

            // 3. 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 4. 구글 AI에게 물어보기 (POST 요청)
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(requestUrl, entity, Map.class);

            // 5. 응답 분석 (점수 꺼내기)
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null) {
                // 응답 JSON 껍질 까기: attributeScores -> TOXICITY -> summaryScore -> value
                Map<String, Object> attributeScores = (Map<String, Object>) responseBody.get("attributeScores");
                Map<String, Object> toxicity = (Map<String, Object>) attributeScores.get("TOXICITY");
                Map<String, Object> summaryScore = (Map<String, Object>) toxicity.get("summaryScore");

                Double score = (Double) summaryScore.get("value");

                // 로그에 점수 찍어보기 (나중에 지워도 됨)
                System.out.println("🤖 AI 분석 결과 - 내용: [" + text + "] / 유해성 점수: " + String.format("%.2f", score));

                // 6. 점수가 기준치(0.7)를 넘으면 에러 발생! -> 저장 안 됨
                if (score > THRESHOLD) {
                    throw new RuntimeException("AI가 감지한 부적절한 표현이 포함되어 있습니다. (유해성: " + String.format("%.0f%%", score * 100) + ")");
                }
            }

        } catch (RuntimeException e) {
            // 우리가 던진 에러는 그대로 던짐 (Controller가 잡아서 프론트에 알려줌)
            throw e;
        } catch (Exception e) {
            // 네트워크 오류 등 API 호출 실패 시
            // 1. 그냥 통과시키기 (서비스 중단 방지 - 현재 설정)
            System.err.println("🔥 구글 API 호출 실패: " + e.getMessage());

            // 2. 만약 API 고장났을 때 글 작성을 아예 막고 싶다면 아래 주석을 푸세요.
            // throw new RuntimeException("AI 필터링 서버 점검 중입니다. 잠시 후 다시 시도해주세요.");
        }
    }
}