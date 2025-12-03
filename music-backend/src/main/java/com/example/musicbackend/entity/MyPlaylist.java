package com.example.musicbackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
//------------일반 데이터 필드--------------------------
//@Table을 쓴 이유: 자바 클래스 이름은 MyPlaylist인데,
// DB 테이블 이름은 대문자와 언더바를 쓴 MY_PLAYLIST로 하고 싶어서 명시적으로 지정

//@NoArgsConstructor가 왜 필수?: JPA가 DB에서 데이터를 가져와서 자바 객체로 만들 때,
// 일단 빈 객체를 만들고 그 뒤에 값을 채워 넣는 방식을 쓰기 때문입니다. (리플렉션 기술)

@Entity //DB 테이블용 클래스
@Table(name = "MY_PLAYLIST") //DB에 있는  MY_PLAYLIST 테이블과 연결
@Getter @Setter //값을 꺼내고(GET) 넣는(SET) 함수 자동생성
@NoArgsConstructor //빈껍데기 생성자(기본생성자) 만들어줘 (JPA 규칙)

public class MyPlaylist {

    @Id //이 테이블의 PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //ID를 안넣고 저장하면 DB가 알아서 순서대로 번호를 넣어
    private Long id;

    @Column(name = "USER_ID") //1. DB 컬럼명 'USER_ID'와 매핑
    private Long userId;

    @Column(name = "TRACK_ID") //2. DB 컬럼명 'TRACK_ID'와 매핑
    private String trackId;
    // 3. @Column 없으면? -> 변수명 그대로(title) 컬럼명이 됨
    //userid: 누가 저장했는지 알아야하니 유저의 번호표만 저장
    //trackid: 스포티파이에서 관리하는 노래 고유 id
    private String title;
    private String artist;
//-----------------------------------------------------------

//----------------------이미지와 미리듣기 url--------------------------------------
    @Column(name = "ALBUM_IMAGE")
    private String albumImage;

    @Column(name = "PREVIEW_URL")
    private String previewUrl;
//---------------------------------------------

    //-------------생성시간 자동 저장 -----------------------
    @Column(name = "ADDED_AT")
    private LocalDateTime addedAt = LocalDateTime.now();
}

//@entity: db테이블과 1:1로 연결된 어노테이션, 이게없으면 db에 저장이안됨
// lombok(@getter,@setter): 귀찮은 코드를 대신 짜줌
//@id: 주민등록번호  , db테이블의 행 하나를 식별하는 유일한 값
//@column: db의 컬럼(열)이랑 짝꿍이라는 뜻
// 자바는 camelCase(소문자+대문자)를 쓰고 보통 SNAKE_CASE를 쓰기떄문에 둘을 맞추기위해 씀