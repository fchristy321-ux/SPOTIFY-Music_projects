package com.example.musicbackend.auth;

import com.example.musicbackend.auth.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

//1.Handler
//의미: 처리담당자
//특정 사건이 발생했을때 뒷수습을 담담하는 코드. 여기서는 로그인성공 사건을 처리

//2.SimpleUrlAuthenticationSuccessHandler
//의미: 로그인 성공하면 특정 URL로 보내주는 기본 기능을 가진 부모 클래스
//부모를 상속 받아서(extends)받아서  그냥 보내지 말고 토큰도 같이 보내줘 라고 기능을 튜닝

//3.Redirect
//의미: 자동이동
//서버가 브라우저에게 너 여기있지말고 저 주소로가 하고 명령함 (로그인이 끝나면 메인페이지로 이동함)

//4.UriComponentsBuilder
//의미: 주소 조립 공구
//주소 뒤에 ?token=abcde... 처럼 글자를 붙일 때, 오타 없이 안전하게 만들어주는 도구

//--------------------------------------1.클래스 선언 및 도구 준비 ------------------------------------------------------//
@Component //1. 스프링아, 이 핸들러도 bean 등록해서 관리해 (SecurityConfig에서 쓰려고 )
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider tokenProvider; //2.토큰 발급기

    //3, 생성자 스프링이 발급기를 주입
    public OAuth2SuccessHandler(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }
    // extends ...: "나는 로그인 성공 처리를 할 줄 아는 녀석이야"라고 명찰을 다는 것

//-----------------------------------------2.성공 시 실행되는 메서드 -----------------------------------------------------//
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        // HttpServletRequest request: 사용자가 보낸 요청 정보
        // HttpServletResponse response: 우리가 보낼 응답 정보 (리다이렉트 명령을 여기에 담음)
        // Authentication authentication: 로그인에 성공한 사용자 정보 (카카오/구글에서 받아온 것)

//----------------------------3.사용자 정보 꺼내기 ------------------------------------------------------------------------
        // 1.인증 정보(authentication)에서 알맹이를 꺼내는데 그게 OAuth2User(소셜 유저)
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // 2. "그 유저의 속성들(이름, 이메일 등)을 맵(Map)으로 꺼내
        Map<String, Object> attributes = oAuth2User.getAttributes();

        //----------------------4.이메일 추출(플랫폼별 분기 처리 )--------------------------------------------------------------//

        // 2. 이메일 추출 (카카오, 네이버, 구글에 따라 다름 - 간소화 버전)
        String email = null;
        //A. 카카오야? (kakao_account라는 상자가 있냐? )
        if (attributes.containsKey("kakao_account")) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            email = (String) kakaoAccount.get("email");
        }
        //B. 네이버야?(response라는 상자가 있냐?)
        else if (attributes.containsKey("response")) {
            Map<String, Object> responseMap = (Map<String, Object>) attributes.get("response");
            email = (String) responseMap.get("email");
        }
        //c.구글이야?(그냥 바로 email을 줌 )
        else {
            email = (String) attributes.get("email");
        }
        //------------------------------5.토큰 생성---------------------------------------------------------//

        // 3. 이메일을 찾았으니 토큰 발급기야 이사람용 출입증(JWT) 하나 만들어
        String token = tokenProvider.createToken(email);

//------------------------------------6.프론트엔드로 배달----------------------------------------------------------------//
        // 4. 프론트엔드로 토큰을 가지고 이동!
        // (http://localhost:3000/auth/callback?token=xxxxx)
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/auth/callback")
                .queryParam("token", token) //"...?token=만든토큰 을 붙여라."
                .build().toUriString(); //결과: http://localhost:3000/auth/callback?token=eyJ...

        //5. "자, 이제 저 주소로 가라!(sendRedirect)" 하고 브라우저에게 명령
        getRedirectStrategy().sendRedirect(request, response, targetUrl);

        //getRedirectStrategy(): "이동 전략 담당자".
        //
        //sendRedirect(...): "여기로 이동시켜!"

        //결과: 사용자의 브라우저는 백엔드에서 일을 마치자마자 순식간에 프론트엔드의 /auth/callback 페이지로 이동하게 되고, 주소창에는 토큰이 매달려 있게됨

    }
}