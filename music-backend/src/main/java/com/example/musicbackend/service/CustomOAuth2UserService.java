package com.example.musicbackend.service;

import com.example.musicbackend.auth.userinfo.*;
import com.example.musicbackend.entity.User;
import com.example.musicbackend.repository.UserRepository;
import com.example.musicbackend.userinfo.GoogleUserInfo;
import com.example.musicbackend.userinfo.KakaoUserInfo;
import com.example.musicbackend.userinfo.OAuth2UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.Map;
//1.DefaultOAuth2UserService
// 의미: 스프링이 기본으로 제공하는 소셜 로그인 처리기
//이것만 써도 되지만 db에 저장하거나 네이버 로그인 같은 추가기능을 넣으려면 상속(extends)을 받아서 개조(override) 해야함

//2.OAuth2UserRequest
//의미: 로그인 요청 정보가 담긴 봉투
//이 안에 어떤 소셜(Registration ID), 엑세스 토큰은 뭔지 등이 들어있음

//3.OAuth2User
//의미: 소셜 서비스에서 받아온 사용자 정보 객체
//JSON데이터 attributes와 권한 authorities을 가지고 있음

//4.registrationId
//의미: 소셜 서비스 이름표
//google, kakao, naver 같은 문자열입니다. 이걸 보고 분기 처리(IF-ELSE)를 함

//5.OAuth2UserInfo (인터페이스)
//의미: 우리가 만든 공통 규격(어댑터)
// 구글, 카카오, 네이버가 주는 데이터 모양이 다 다르니까, 하나로 통일시키기 위해 만든 틀

//-----------------------------1.클래스 선언 ------------------------------------------------------------//
@Service //1. 비즈니스 로직을 담당하는 서비스
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired //3. 회원 정보 저장해야 하니까 창고지기(REPOSITORY)줘
    private UserRepository userRepository;

    //-------------------------------2.사용자 정보 가져오기---------------------------------------------------------------------//
    @Override //4. 기본기능 말고 내가 만든 로직으로 덮어씀
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        // 5. 일단 부모님(SUPER)한테 시켜서 소셜 서버에서 정보를 받아옴
        //(제일 어려운 통신 과정은 스프링이 다해줌 )
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 6. 어떤 소셜 서비스인지 이름표를 확인(예: KAKAO)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        //7. 받아온 정보(JSON)를 맵(MAP)으로 꺼냄
        Map<String, Object> attributes = oAuth2User.getAttributes();

        //-------------------------3.데이터 통일(어댑터 패턴 적용)---------------------------------------------------------------//

        // 8. 공통 규격(인터페이스 )변수를 준비
        OAuth2UserInfo oAuth2UserInfo = null;

        //9. 서비스 이름에 따라 알맞은 변환기를 끼움
        if (registrationId.equals("google")) {
            oAuth2UserInfo = new GoogleUserInfo(attributes); //구글용 변환기
        } else if (registrationId.equals("kakao")) {
            oAuth2UserInfo = new KakaoUserInfo(attributes); //카카오용 변환기
        } else if (registrationId.equals("naver")) {
            oAuth2UserInfo = new NaverUserInfo(attributes); // 네이버용 변환기
        }
        // WHY: KAKAO는 이메일이 KAKAO_ACCOUT안에 있고 NAVER 는 RESPONSE안에 있다 이걸 지저분하게 IF-ELSE 꺼내지않고 USERINFO 클래스에게 너가 알아서 꺼내라고 시킴

        //------------------------4.DB저장 및 업데이트 --------------------------------------------------------------//

        // 10. 통일된 규격에서 데이터를 뽑아냄 (구글 /카카오 상관없이 똑같이 씀 )
        String provider = oAuth2UserInfo.getProvider(); //KAKAO
        String providerId = oAuth2UserInfo.getProviderId(); // 12345678
        String email = oAuth2UserInfo.getEmail(); //TEST@EMAIL.COM
        String nickname = oAuth2UserInfo.getName(); // 홍길동

        //11.이 이메일로 가입된 회원이 있는지 DB에서 찾아봄
        User user = userRepository.findByEmail(email)

                //12. 없으면 (.orelseget)새로 만들어서 저장 함
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(email)
                            .nickname(nickname)
                            .provider(provider)
                            .providerId(providerId)
                            .build();
                    return userRepository.save(newUser);
                });
        //orelseget: 있으면  user쓰고 없으면 함수 실행해서 새로 만들어(newuser).

//---------------------------------5.최종리턴(세션 생성)-----------------------------------------------------------------------------//
        // 13. 스프링 시큐리티야 로그인 성공 처리해
        return new DefaultOAuth2User(
                //권한: 일반 유저
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                //사용자정보(JSON) 통쨰로 넘김
                attributes,
                //PK, 필드이름: ID(카카오), "SUB" 구글 등
                userRequest.getClientRegistration().getProviderDetails()
                        .getUserInfoEndpoint().getUserNameAttributeName()
        );
    }
}
// DefaultOAuth2User: 이 객체가 리턴되면 스프링 시큐리티가
// "아, 인증 끝났구나!" 하고 SecurityContext에 저장하고, SuccessHandler를 호출