package com.example.musicbackend.auth.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

//1.JWT
//사용자의 정보를 암호화된 문자열 하나로 만드는 것
//구조:헤더 + 내용 + 서명 3부분으로 나눠져있음

//2.Claims
//토큰 안에 적혀있는 정보들
// 토큰주인은 test@email.com이고 유효기간은 1일 -> 이런것들을 클레임

//3.Sign
//의미: 도장찍기
//비밀키를 사용해서 토큰에 암호화 도장을 찍는다
// 해커가 내용을 몰래 바꾸면 도장 모양이 깨지기 때문에 위조여부를 알수있음

//---------------------------1.설정 및 초기화 --------------------------------------------------//
@Component //1. 스프링 빈으로 등록 (다른 곳에서 @Autowired로 쓸 수 있게)
public class JwtTokenProvider {

    private final Key key; //암호화할 떄 쓸 진짜 열쇠 객체
    private final long validityInMilliseconds; //토큰 유효 시간

    //2. 생성자: application.properties에서 설정값을 가져옴
    public JwtTokenProvider(@Value("${jwt.secret}") String secret,
                            @Value("${jwt.expiration}") long validityInMilliseconds) {

        //3.문자열 비밀번호(secret)를  -> 바이트(숫자)로 쪼개서 -> 암호화 전용 키 (key 개체)로 변환
        this.key = Keys.hmacShaKeyFor(secret.getBytes());


        // 유효기간 저장
        this.validityInMilliseconds = validityInMilliseconds;
    }
    //keys.hmacshaketfor(...): properties에 적은 영어 단어 비밀키를 자바 보안시스템이 이햐할 수 있는 암호화 키 객체로 바꿔주는 과정
    //@Value("${...}"): 설정 파일(application.properties)에서 jwt.secret이라고 적힌 값을 뽑아옴
    //
    //secret.getBytes(): 컴퓨터는 'apple' 같은 글자를 모릅니다. 이걸 [97, 112, 112, ...] 같은 숫자 배열(byte array)로 바꿈
    //
    //Keys.hmacShaKeyFor(...): 그 숫자 배열을 재료로 써서, HMAC-SHA라는 강력한 암호화 알고리즘을 돌릴 수 있는 '마스터 키 객체'를 만듬

//------------------------------------2. 토큰 생성(createtoken)----------------------------------------------------------//

    public String createToken(String email) {
        Date now = new Date(); //현재 시간
        Date validity = new Date(now.getTime() + validityInMilliseconds); // 만료 시간 (현재 +1)

        return Jwts.builder() //1. 토큰 빌더 시작
                .setSubject(email) //2.이 토큰의 주인(subject)은 이메일
                .setIssuedAt(now) //3. 토큰 발행
                .setExpiration(validity) //4. 이때까지만 유효
                .signWith(key, SignatureAlgorithm.HS256) //5. 비밀키로 도장을 찍음
                .compact(); //6.문자열로 암축해서 내보냄
    }
    // setsubject: 토큰의 주인공을 식별하는 값. 보총 id(pk)나 이메일을 넣음
    //signwith: 이게 없으면 토큰을 위조 할 수 있음

    //Jwts.builder(): 토큰을 조립하는 공정을 시작.
    //
    //setSubject: 토큰의 주인공을 적음. (여기선 이메일)
    //
    //signWith:이 서명이 없으면 누구나 내용을 위조. 서버만 알고 있는비밀키(key)로 암호화 도장을 찍어서, 나중에 위조 여부를 판별
    //
    //compact: 완성된 토큰 객체를 eyJh... 같은 긴 문자열로 바꿈

    //-----------------------------------3.토큰검사(validatetoken)-검표--------------------------------------------------------//

    public boolean validateToken(String token) {
        try {
            //1.토큰 해석기(PARSER)를 조립
            //2. 우리집 비밀키를 세팅(이 키로 안열리면 위조된것)
            //3.해석기를 완성(BUILD)
            //4.가져온 토큰을 뜯어봐라(parseClaimsJws)
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);

            return true; //2. 에러없이 열리면 유효한 초큰
        } catch (JwtException | IllegalArgumentException e) {
            //유효기간이 지났거나 비밀키가 안 맞거나 토큰이 깨져있으면 에러남
            return false; //가짜토큰
        }
    }
    //역할: 요청이 들어올떄마다 JwtAuthenticationFilter가 이 메서드를 호출해서 이 사람 들여보내도되> 하고 물어봄

    //---------------------------------4.정보추출(getemail)--------------------------------------------------------------//


    public String getEmail(String token) {
        //토큰을 열어서 (parse) -> 몸통(body)을 보고 -> 주인(subject)을 꺼냄
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }
}
//용도: 토큰이 유효하다는게 확인되면 그래서 이게 누구건데? 하고 db에서 유저ㅗ를 찾기위해 이메일을 꺼내는 과정

//---------------------------- 묶어서 설명-------------------------------------------//
//JwtTokenProvider 생성: 공장 문을 열면서(@Component), 금고(properties)에서 비밀번호를 꺼내와 **마스터 키(key)**를 깎아둠.
//
//createToken: 손님이 오면 마스터 키로 도장(signWith)을 찍은 출입증(토큰)을 만들어줌. 유효기간도 적어줌
//
//validateToken: 손님이 다시 왔을 때, 출입증을 기계에 넣고 마스터 키를 대봄(setSigningKey). 도장 모양이 일치하고 날짜가 안 지났으면 통과.
//
//getEmail: 통과된 출입증을 자세히 들여다보고(parse), "test@email.com" 하고 알아냄.