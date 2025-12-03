package com.example.musicbackend.controller;

import com.example.musicbackend.entity.User;
import com.example.musicbackend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

//AuthenticationManager (인증 관리자)
//의미: 스프링 시큐리티의 최고 보안 책임자
//역할: 아이디랑 비번이 진짜 맞아? 하고 확인하는 최종 결정권자

//2.UsernamePasswordAuthenticationToken:
//의미: 임시출입증 신청서
//사용자가 입력한 이메일과 비밀번호를 이 객체에 담아서 AuthenticationManager에게 제출. 이정보로 로그인해도되나요? 물어보는 용도

//3.SecurityContextHolder
//의미: 현재 접속중인 사용자의 정보를 담아두는 금고
//로그인이 성공하면 여기에 이 사람은 인증된 홀길동이라고 저장 그러면 스프링의 다른 모든곳에서 아 지금 홍길동이 접속해있구나 알수있음

//4.HttpSession (세션)
//의미: 서버 쪽 사물함
//사용자가 로그인하면 서버에 사물함을 만들고 그안에 로그인 정보를 넣어둠 그리고 사물함 열쇠(JSESSIONID 쿠키)를 줌

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

//---------------1.회원가입-------------------------------------------------------------
    @PostMapping("/signup") //1.회원가입 요청(POST)이 오면 여기로
    public ResponseEntity<?> signup(@RequestBody User user) {
        //@RequestBody: 프론트에서 보낸 JSON 데이터를 User 객체로 변환
        try {
            //2.서비스 (AuthService)에게 이 유저 가입 시켜줘 라고 시킴
            //(비밀번호 암호화, 중복체크 등은 서비스가 알아서 함)
            authService.signup(user);

            //3.성공하면 성공 메세지 보냄
            return ResponseEntity.ok("회원가입 성공!");
        } catch (Exception e) {
            //4.실패하면(중복이메일 등) 400에러와 함꼐 이유를 알려줌
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //----------------------2.로그인-------------------------------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData, HttpServletRequest request) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            HttpSession session = request.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());

            return ResponseEntity.ok("로그인 성공");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("로그인 실패");
        }
    }
//--------------------------3.로그아웃----------------------------------------------------------------------------
    @PostMapping("/logout") // 1. 로그아웃 요청
    public ResponseEntity<?> logout(HttpServletRequest request) {
        //2. 현재 사용자의 사물함을 가져와봐 (false: 없으면 새로 만들지 마라)
        HttpSession session = request.getSession(false);
        if (session != null) {
            //3. 사물함 부셔버려!(안에 든 로그인 정보 삭제 )
            session.invalidate();
        }
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }
}