package com.example.musicbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.Track;
//기초용어 사전

//@Value:
//설정 파일에 있는 값을 쏙 뺴와라
//자바 코드안에 비밀번호를 직접 적으면 해킹위험도 있고
// 수정도 힘듬 그래서 설정파일에 따로적고 어노테이션으로 주입 받음

//@Bean
//의미: 이 메서드가 반환하는 객체(물건)를 스프링 창고에 잘 보관해둬라
// 내가 만든 클래스(service,controller)는 어노테이션만 붙이면 스프링이 알아서 관리하지만
//남이 만든 라이브러리(spotifyapi)는 스프링이 모른다 그래서 "내가 조립했으니까 잘 챙겨"리고 @Bean을 붙여 직접 등록

//BUilder:
//복잡한 객체를 단계별로 조립하는 방식
//new SpotifyApi(id, secret, uri, ...) 처럼 괄호 안에 순서 맞춰 넣는 건 헷갈리니까,
// .setID().setSecret().build() 처럼 명확하게 하나씩 세팅하는 방식입니다.

//-------------------------------설정파일 선언 ---------------------------------------------//
@Configuration // 스프링아 설정(조립)파일이야 앱켜자마자 읽어
//해석: 프로그램이 시작될때 가장 먼저 읽히는 설정 파일임을 명시
public class SpotifyConfig {
//--------------------------------------------------------------------------------------------//

    //------------------------재료 준비----------------------------------------------//
    @Value("${spotify.client-id}") // application.properties에서 'spotify.client-id' 값을 찾아서
    private String clientId;// 이 변수에 넣어라.
    @Value("${spotify.client-secret}") //'spotify.client-id' 값을 찾아서
    private String clientSecret; // 이 변수에 넣어라.
    //${...}: 스프링의 프로퍼티 치환 문법.
    //why:
    // 보안: 코드를 깃허브에 올려도 실제 비밀번호가 들어있는 properties 파일만 숨기면 안전
    //유지보수: 비밀번호가 바뀌면 코드를 컴파일할 필요없이 텍스트(properties)만 고치면 됨
//------------------------------------------------------------------------------------//
    //-----------------------------------조립 및 등록--------------------------------------------//
    @Bean
    public SpotifyApi spotifyApi() {
        return new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRedirectUri(SpotifyHttpManager.makeUri("http://127.0.0.1:8080/login/oauth2/code/spotify"))
                .build();
    }

    }
