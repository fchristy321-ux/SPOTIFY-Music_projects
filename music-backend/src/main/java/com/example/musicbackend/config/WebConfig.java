// 중요한 단어 정리
//CORS:
//교차 출처 리소스 공유 -> 비유: 비자 발급
//웹브라우저는 보안때문에 서로 다른 동네 끼리 데이터를 주고받는 걸 기본적 으로 막아둠

//Next.js 동네: localhost:3000
//Spring Boot 동네: localhost:8080
//브라우저: 포트가 달라서 차단함
//그래서 그 차단을 풀어주는 허가증을 발급하는 코드임

//@Configuration
//의미: 설정파일
//스프링부트가 켜질때 어노테이션에 붙은 파일들을 읽고 적용

//WebMvcConfigurer
//의미: 웹 서버 설정을 커스텀 할 수있는 메뉴판
//스프링의 기본 웹 설정에 규칙(cors)를 추가하고싶을떄 상속

package com.example.musicbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//-------------------------1.설정클래스 설정---------------------------------------------//
@Configuration // 설정 파일
public class WebConfig implements WebMvcConfigurer {
    //웹설정을 수정
    //해석: 스프링에게 웹 설정을 좀 건드린다고 신고하는 부분
    //-----------------------------------------------------------------//

    //--------------------------CORS 규칙 추가----------------------------------------//
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        //registry: CORS규칙 등록 대장
        registry.addMapping("/**") // 어떤 주소를 허용할까?
                .allowedOrigins("http://localhost:3000") // 누가 요청하는 걸 허용 ?
                .allowedMethods("GET", "POST", "PUT", "DELETE");  //어떤 행동을 할까?
        //addMapping("/**"):
        //우리 서버의 모든 주소(/**)에 대해 이 규칙을 적용
        //EX) /api/spotify, /api/library

        //allowedOrigins("http://localhost:3000"):
        //의미:  여기에 * (모두 허용)을 넣을 수도 있지만, 보안상 특정 주소만 적어주는 게 좋다

        //allowedMethods(...):
        //의미: "데이터를 가져가고(GET), 저장하고(POST), 수정하고(PUT), 삭제하는(DELETE) 것까지만 허용해라."
    }
}

