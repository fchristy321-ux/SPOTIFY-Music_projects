package com.example.musicbackend.controller;

import com.example.musicbackend.entity.User;
import com.example.musicbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

//SecurityContextHolder (보안 금고)
//의미: 현재 접속중인 사용자의 신분증이 보관된 곳
//로그인에 성공하면 스프링 시큐리티가 여기에 사용자 정보(Authentication)를 넣어둠. 그냥 여기서 꺼내 쓰기만하면됨


//Authentication (인증 객체)
//의미:사용자의 신분증
//이 안에 principal(본인 정보), Authorities(권한)등이 있다

//Principal(주체/본인)
//의미: 로그인한 사용자 본체
//소셜 로그인한 사람은 OAuth2User라는 명찰을 달고
// 일반 로그인한 사람은 UserDetails라는 명찰을 달고 있다
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

// -------------------------1.현재 접속자 정보 가져오기--------------------------------------------------------
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo() {
        //1.금고에서 신분증을 꺼낸다
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        //2.신분증이 없거나 로그인 안된 상태(anonymousUser)라면 쫓아냄
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body("로그인되지 않았습니다.");
        }

        //3.신분증 주인(Principal)을 꺼냄 (아직 누군지 모름 object 타입)
        Object principal = authentication.getPrincipal();
        String email = null;

        // anonymousUser: 스프링 시큐리티는 로그인 안한 사람한테도 익명 유저 라는 가짜 이름을 붙여준다 그래서 이것도 걸러야함

//----------------------------------------2.소셜 로그인 유저 처리 ------------------------------------------------------//
        //4. 너 소셜로그인(OAuth2User)냐?
        if (principal instanceof OAuth2User) {
            OAuth2User oauthUser = (OAuth2User) principal;
            Map<String, Object> attributes = oauthUser.getAttributes(); //JSON 데이터 꺼내기

            //5. 카카오, 네이버 , 구글마다 이메일 위치가 달라서 맞춰서 꺼냄
            if (attributes.containsKey("kakao_account")) {
                //카카오: kakao_account -> email
                Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
                email = (String) kakaoAccount.get("email");
            } else if (attributes.containsKey("response")) {
                //네이버: response -> email
                Map<String, Object> response = (Map<String, Object>) attributes.get("response");
                email = (String) response.get("email");
            } else {
                //구글: 그냥 email
                email = (String) attributes.get("email");
            }
//            instanceof: "너 혹시 ~타입이니?" 하고 물어보는 키워드

            //---------------------------------3.일반 로그인 유저 처리----------------------------------------------------//
          //6. 아니면, 일반 로그인(UserDetails)이야?
        } else if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            //일반 로그인은 username이 곧 이메일이다
            email = userDetails.getUsername();
        }

//-------------------------------------4.DB 조회 및 응답----------------------------------------------------------
        //7.이메일을 찾으면 DB에서 진짜회원 정보를 조회
        if (email != null) {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null)
                //8.찾아서 회원정보(json)를 줌
                return ResponseEntity.ok(user);
        }
        //9.이메일은 있는데 db에 없다(404 not found )
        return ResponseEntity.status(404).body("회원 정보를 찾을 수 없습니다.");
    }
}