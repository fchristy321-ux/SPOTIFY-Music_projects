package com.example.musicbackend.service;

import com.example.musicbackend.entity.User;
import com.example.musicbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;

//1. UserDetailsService
//의미: 유저 정보를 가져오는 기능을 정의한 약속
//스프링 시큐리티는 기본적으로 유저 정보를 가져오는 방법(loadUserByUsername)을 모름
//그래서 이 인터페이스를 상속 받아 DB에서는 이렇게 가져오면 돼 라고 알려줌

//2.loadUserByUsername
//의미: 아이디로 유저 정보를 불러옴
//username은 꼭 닉네임일 필요가 없다. 로그인id로 이메일을 쓰니까 여기선 이메일이 username이 됨

//3.userdetail
//의미: 스프링 시큐리티가 이해할 수 있는 형태의 회원증
//db의 user엔티티는 스프링이 모름 그래서 스프링이 아는 표준 규격(userdetails)로 변환

//4.UsernameNotFoundException
//의미: 그런 아이디 가진 사람 없음
//db를 뒤져봤는데 없으면 이 에러를 던짐 그럼 로그인 실패처리됨

//------------------------------1.클래스 선언 및 도구 준비 ---------------------------------------------------------//
@Service //1. 인증 로직을 담당하는 서비스
public class CustomUserDetailsService implements UserDetailsService {//2.유저정보를 가져오는 역할


    @Autowired //3,db봐야하니까 창고지기(repository)줘
    private UserRepository userRepository;

    //해석: 구현(implements)함으로써, 스프링이 로그인 시 이 클래스를 자동으로 찾아서 쓰게 만듬

    //---------------------------2.유저 조회------------------------------------------------------------//

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        //email: 사용자가 로그인 화면에 입력한 이메일

        //1.repository야 이 이메일 가진 사람 찾아
        User user = userRepository.findByEmail(email)

                //2.없으면 (orelsethrow)에러를 던져라
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

//        findByEmail: UserRepository에 만들어둔 메서드
//        orElseThrow: 값이 있으면 user에 담고, 없으면 괄호 안의 에러를 발생

        //-------------------------3.userdetails로 변환 및 반환--------------------------------------------------------------//
        //3. 찾은 유저 정보를 스프링 표준 회원증(userdetails)에 옮겨 적어줌
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), //아이디
                user.getPassword(), //비밀번호(password-암호화된 상태)
                //권한 목록(여기선 무조건 role_user 하나만 줌 )
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
//new org.springframework...User(...): 스프링 시큐리티가 제공하는  user클래스

//여기에 아이디 비밀번호 권한을 넣어주면 스프링이 알아서 입력한 비밀번호와 이 db비밀번호가 일치하는지 검사