package com.example.musicbackend.config;

import com.example.musicbackend.auth.OAuth2SuccessHandler;
import com.example.musicbackend.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
//1.@Configuration:  설정파일, 스프링이 시작될때 가장 먼저 읽어서 적용
//2.@Bean: 메서드가 반환하는 개체를 스프링 컨테이너에 보관
//3.SecurityFilterChain: 보안 검문소들의 집합. 요청이 들어오면 체인에 있는 여러 필터(검문소)들을 통과
//4.HttpSecurity: 웹 보안 설정을 구성하는 빌더 객체 (권한, 로그인, 로그아웃 등을 설정)
//5. CORS(Cross-Origin Resource Sharing): 다른 출처(도메인,포트)끼리 자원을 공유하는 것을 허용하는 정책(3000번 포트의 프론트엔드가 8080번 백엔드에 접속할 수 있게 해주는 허가증)
//6. CSRF (Cross-Site Request Forgery): 사이트 간 요청 위조 해커가 사용자의 권한을 도용해 요청을 보내는 공격 REST API는 보통 세션을 쓰지않음

//------------------------------------1.클래스및 필드 선언 --------------------------------------------------------------------------------//
@Configuration //1. 이 파일은 설정 파일 (BEAN 등록소)
public class SecurityConfig { //1. 설정 파일 선언

    //2.소셜 로그인 시 사용자 정보를 가져올 서비스 (CustomOAuth2UserService)
    private final CustomOAuth2UserService customOAuth2UserService;

    //3.로그인 성공시 처리할 핸들러(토큰 발급 등)
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    //4. 생성자 주입: 스프링이 알아서 위 두 서비스를 채워줌
    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService, OAuth2SuccessHandler oAuth2SuccessHandler) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

//---------------------------------------------------------------------
// -------2.비밀번호 암호화 및 인증 관리자 등록------------------------//
    @Bean //5. 암호화 기계 등록
    public PasswordEncoder passwordEncoder() {
        //BCrypt라는 강력한 암호화 방식을 사용한다
        return new BCryptPasswordEncoder();
    }

    @Bean //6. 인증 담당자 등록 (일반 로그인 시 필요)
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {

        //스프링의 기본 인증 관리자를 가져와서 빈으로 등록
        return authenticationConfiguration.getAuthenticationManager();
    }

    //---------------------------------3.보안 필터 ---------------------------------------------------------------------------------//
    @Bean //2. 이 메서드가 리턴하는 객체를 스프링이 관리 (보안설정 등록)
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                //3.csrf(사이트 간 요청 위조)보안끄기/ (REST API 세션대신 토큰을  쓰거나 독립적이므로 보통은 끔)
                .csrf(csrf -> csrf.disable())

                //4.cors(교차 출처 리소스 공유)설정 적용 (3000번 포트 허용)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                //5.URL별 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // "/", "/LOGIN"등은 누구나 들어 올 수 있음(.permitAll)
                        .requestMatchers("/", "/api/spotify/**", "/api/auth/**", "/login/**", "/oauth2/**", "/error").permitAll()

                        // 그 외 나머지(.anyRequest)는 로그인한 사람만(.authenticated)
                        .anyRequest().authenticated()
                )
                //6. 소셜 로그인 설정
                .oauth2Login(oauth2 -> oauth2
                        //로그인 필요시 스프링 기본창 말고 우리 프론트 페이지로 가라
                        .loginPage("http://localhost:3000/sign-in") // 프론트엔드 주소 (localhost)
                        //성공하면 이 핸들러를 실행해라
                        .successHandler(oAuth2SuccessHandler)
                        //사용자 정보를 가져오는 서비스는 이거다
                        .failureUrl("http://localhost:3000/sign-in?error=true")
                        //사용자 정보 가져오기 설정
                        .userInfoEndpoint(userInfo ->
                                //사용자 정보를 가져오는 서비스(일꾼) 등록
                                userInfo.userService(customOAuth2UserService))
                )

                //7.로그아웃 설정
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout") // 이 주소로 요청오면 로그아웃 시킴
                        .logoutSuccessUrl("http://localhost:3000/sign-in?logout=true") //세션 쿠키 삭제
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                );

        return http.build();
    }

//-------------------------CORS설정 상세(문지기 설정)----------------------------------------------------------------
    @Bean // CORS 설정 객체 등록
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        //15. 허용할 프론트엔드 주소(중요)
        //"http://localhost:3000" 에서 오는 요청만 받아줌
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));

        // 16. 허용할 HTTP 메서드 (GET, POST 등 다 허용)
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 17. 허용할 헤더 (모든 헤더 허용)
        configuration.setAllowedHeaders(List.of("*"));

        // 18. 자격 증명(쿠키, 인증 헤더) 허용
        // "로그인 정보(쿠키)를 주고받을 수 있게 해줘"
        configuration.setAllowCredentials(true); // 쿠키 허용

        // 19. 이 설정을 모든 경로("/**")에 적용
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}