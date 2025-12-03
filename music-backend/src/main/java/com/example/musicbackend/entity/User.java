package com.example.musicbackend.entity;

import jakarta.persistence.*;
import lombok.*;

//@Entity:
//의미: 이클래스는 DB테이블과 1:1로 매칭
//자바객체(USER)를 만들면 DB에 행이 생기고 객체를 지우면 DB에서도 지워진다

//@Table(name = "USERS")
//의미: DB 테이블 이름은 USERS로 해줘
//왜? ORACLE DB에는 USER라는 예약어가 있어서 테이블 이름을 그냥 USER로 하면 에러가난다 그래서 USERS로  이름을 바꿈

//@BUILDER
//의미: 객체를 만들 때 생성자(new User(...)) 대신 더 명확한 방법 (User.builder()...build())을 쓰겠다."
//필드가 많을 때 순서를 헷갈리지 않게 해주는 유용한 도구

//Unique
//의미: 중복금지
//이메일은 사람을 구별하는 ID역할을 하므로 똑같은 이메일이 2개 있으면 안됨

@Entity // 1. JPA 관리 대상 선언
@Table(name = "USERS") // 2. 테이블 이름 지정 (Oracle 예약어 충돌 방지)
@Getter @Setter // 3. 모든 필드의 get/set 메서드 자동 생성
@NoArgsConstructor //4. 기본 생성자 생성 (JPA가 데이터 읽어올 때 필요함)
@AllArgsConstructor // 5. 모든 필드가 들어간 생성자 생성 (Builder 패턴이 씀)
@Builder // 6. 객체 생성 시 가독성을 높여주는 패턴 적용

// @Builder 사용 예시:
//Java
//// 이렇게 명확하게 값을 넣을 수 있음
//User.builder()
//    .email("test@test.com")
//    .nickname("홍길동")
//    .build();
public class User {
//-------------------------------기본키 설정----------------------------------------------//-
    @Id //1. 주민등록번호 (Primary key)
    @GeneratedValue(strategy = GenerationType.IDENTITY)  //2. 번호 자동증가 (1,2,3...)
    @Column(name = "USER_ID") //3.DB컬럼명은 USER_ID
    private Long userId;

    //해석:회원마다 부여되는 고유번호

//--------------------------핵심정보 (이메일,닉네임 )------------------------------------------------------------//
    @Column(nullable = false, unique = true)  //1. 필수 입력(not null) + 중복 불가 (unique)
    private String email;

    private String nickname; //2. 닉네임(보통은 중복 허용)

    private String provider;
    //nullable = false: 이메일 없는 회원은 가입할 수 없음
    // unique = true: 이미 가입된 이메일로 또 가입할 수

    //-----------------------------------4.소셜 로그인 정보 --------------------------------------------------------//
    private String providerId; //가입 경로
    private String password; //소셜 서비스 쪽의 고유 id(식별자)

    //왜 필요한가?
    //나중에 사용자가 로그인할 때, "이 사람은 카카오로 가입했네? 카카오에 물어봐야지" 하고 판단하는 근거가 됨
    //일반 로그인(회원가입)인 경우 provider에 "local"이라고 적음
}