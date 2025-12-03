package com.example.musicbackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

//1.RestTemplate
//의미: 자바가 쓰는 웹 브라우저
//우리가 크롬 주소창에 주소를 치고 엔터를 누르는 것처럼 자바코드 안에서 특정 url로 요청을 보내고 응답을 받아오는 도구

//2.ObjectMapper
//의미: json 번역기
/// 유튜브가 보내준 응답은 긴 문자열이다
// 이 번역기가 문자열을 자바객체로 바꿔줘서 우리가 데이터를 꺼낼수있게 해줌

    //3.JSONNODE
    //의미: JSON 나무의 가지
    //JSON 데이터를 트리 구조로 생각했을때 그안의 특정부분(items,id)을 가리키는 객체

    //----------------------------1.도구 준비 및  API 키 가져오기 ----------------------------------------=---//
@Service // 비즈니스 로직을 담당하는 일꾼(SERVICEW)
public class YouTubeService {

    @Value("${youtube.api-key}") //2. application.properties에서 유튜브 키를 가져와
    private String apiKey;

    //3. HTTP 요청을 보낼 도구 생성(브라우저 역할)
    private final RestTemplate restTemplate = new RestTemplate();

    //4. JSON 데이터를 분석할 도구 생성(번역기 역할)
    private final ObjectMapper objectMapper = new ObjectMapper();

//--------------------------------2.유튜브 검색 요청------------------------------------------------------

    //query: 검색할 단어(예:"NewJeans Hype Boy official audio" )
    public String searchVideoId(String query) {
        try {
            // 1. 유튜브 API 주소 만들기 (쿼리 파라미터 조합)
            String url = "https://www.googleapis.com/youtube/v3/search"
                    + "?part=snippet&type=video&maxResults=1&videoEmbeddable=true" // 기본정보 만 줘
                    + "&q=" + query //이 단어로 검색해
                    + "&key=" + apiKey; //내 API 키는 이거야

            // 2. 요청 보내기
            //getForObject(주고, 결과타입): 주소로 가서 결과를 문자열로 받아와라
            String response = restTemplate.getForObject(url, String.class);

//-----------------------------------3.JSON 데이터 해부-----------------------------------------------------------------

            //videoEmbeddable=true:외부 사이트 재생을 막아둔 영상은 아예 검색 결과에서 빼버림

            //{
            //  "items": [
            //    {
            //      "id": {
            //        "kind": "youtube#video",
            //        "videoId": "aaaaa_bbbbb"  <-- 우리가 필요한 건 이거 하나!
            //      }
            //    }
            //  ] ->>>>>>>>>>>>>>>>>>>>>>>이걸 자바코드로 뚫고 들어가는 과정

            // 3. 문자열(response)을 JSON 트리 구조(ROOT)로 변환
            JsonNode root = objectMapper.readTree(response);

            //4.items 라는 이름의 가지를 잡아
            JsonNode items = root.path("items");

            //5. items가 배열이고  내용물이 1개 이상 있니?
            if (items.isArray() && items.size() > 0) {

                //6.0번쨰 아이템 -> id-> videoId순서로 파고들어서 글자 (astext)로 꺼내라
                return items.get(0).path("id").path("videoId").asText();
            }

        } catch (Exception e) {
            System.out.println("유튜브 검색 실패: " + e.getMessage());
        }
        return null;
    }
    //path("이름"): JSON 안에서 해당 이름의 데이터를 찾아 들어감
    //
    //get(0): 리스트의 첫 번째(0번) 데이터를 가져옴
}