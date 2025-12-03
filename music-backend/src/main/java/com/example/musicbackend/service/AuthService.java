package com.example.musicbackend.service;

import com.example.musicbackend.entity.User;
import com.example.musicbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

//1.SERVICE
//의미: 핵심 업무를 처리하는 곳
//스프링에게 중요한 일을 하니까 빈으로 등록해서 관리

//2.passwordencoder
//의미: 비밀번호 분쇄기
//사용자가 입력한 비밀번호를 그대로 db에 저장하면 안됨
//기계에 넣으면 알아볼수 없는 문자열로 바꿔줌

//3.RuntimeException
//의미: 실행 중에 발생한 돌발 상황(에러)
//이미 가입된 이메일인데? 같은 문제가 생기면 작업을 즉시 중단하고 에러를 던짐

//4.isPresent()
//의미: 상자안에 내용물이 들어있나?
//db에서 찾아보고 결과가 있으면 true, 없으면 false

//---------------------------------1. 클래스 및 도구 준비 ----------------------------------------------------------//
@Service //1. 비즈니스 로직을 담당하는 authservice
public class AuthService {

    @Autowired //2. 회원 정보 저장할 창고지기(respository) 좀 빌려줘
    private UserRepository userRepository;

    @Autowired //3. 비밀번호 암호화할 기계 좀 빌려줘
    private PasswordEncoder passwordEncoder;

    //해석: 회원가입을 처리하려면 db 접근 도구(userrepository)와 보안도구(passwordeccoder)가 필요하니 스프링한테 달라고 (autowired)요청

    //-------------------------------2.회원가입 메서드 시작 -------------------------------------------------------//
    //외부에서 호출할때 user객체(이메일,비번,닉네임 등이 담김)를 줌
    public User signup(User user) {

        //-----------------------------3.중복 체크--------------------------------------------------------//
        //1.창고지기야 이 이메일(user.getemail)가진 사람있나 찾아
        //2. .ispresent(): 찾은 결과가 존재해?
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {

            //3.존재한다면 true 아니면 에러를 던져라
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        //findByEmail: 아까 UserRepository에서 우리가 만든 그 메서드 결과는 optional<user>상자에 담김
        //throw: 컨트롤러에게 에러메세지를 던짐 그럼 프론트엔드는 이미 존재하는 이메일이라고 뜸

        //------------------------------------4. 비밀번호 암호화 및 설정 --------------------------------------------------------//

        // 1.사용자가 입력한 비밀번호(get)를 암호화기계 (encode)에 넣고 돌려라
        //2. 그 결과 (암호문)를 다시 유저 객체에 저장( set)해라
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        //3.가입 경로는  LOCAL로 도장을 찍어라
        //(소셜 로그인은 google, kakao 등이 들어감 )
        user.setProvider("local");
//------------------------------------------5.최종 저장--------------------------------------------------------
        //4. 모든 준비가 끝난 유저 객체를 창고지기에게 넘겨서 저장 해라
        // 5. 저장된 결과를 반환해라
        return userRepository.save(user);
    }
}