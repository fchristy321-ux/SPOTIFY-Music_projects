package com.example.musicbackend.repository;

import com.example.musicbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

//Optional<T>:
//의미: 있을수도있고 없을수도 있는 상자
//db에서 회원을 찾았는데 없을수도 있다
//옛날엔 null을 줬는데 그러다  NullPointerException 에러가 터지는 일이 많음 그래서  빈 상자(Optional.empty)"를 대신 줘서 안전하게 처리

//findByEmail
//의미: "이메일로 찾아라" (SELECT * FROM users WHERE email = ?)
//SQL을 안 써도, 메서드 이름만 보고 스프링이 알아서 SQL을 만들어줌

//----------------------1.인터페이스 선언 ---------------------------------------------------------//
public interface UserRepository extends JpaRepository<User,Long> {
    //해석: user 테이블을 관리하는 저장소
    //User의 PK(ID)는 Long(숫자) 타입
    //JpaRepository를 상속받았으므로 save(저장), findById(ID로 찾기), delete(삭제) 등은 이미 다 가지고 있음

    //Email 컬럼 값이 파라미터(email)와 같은 유저를 찾아서, Optional 상자에 담아
    Optional<User> findByEmail(String email);
}
