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
//
//@Configuration (설정): "이 파일은 스프링 부트의 설정 파일입니다. 서버가 켜질 때 이 내용을 읽어서 환경을 구성하세요."
//
//@Bean (빈): "이 메서드가 반환하는 객체(도구)를 **스프링 컨테이너(창고)**에 넣어두세요. 다른 곳에서 필요할 때 꺼내 쓰게요."
//
//SecurityFilterChain (보안 체인): "들어오는 모든 요청이 통과해야 하는 보안 검문소들의 연속된 관문"입니다.
//
//CSRF (사이트 간 요청 위조): 해커가 내 권한을 도용해 몰래 요청을 보내는 공격입니다. REST API는 세션 의존도가 낮아 보통 끕니다.
//
//CORS (교차 출처 리소스 공유): "도메인이나 포트가 다른 곳(프론트 3000 <-> 백엔드 8080)끼리 데이터를 주고받을 수 있게 허락해 주는 정책"입니다.
//
//        BCrypt: 비밀번호를 복호화가 불가능한 방식으로 암호화하는 강력한 알고리즘입니다.
// 1. 설정 클래스 선언: 스프링이 시작될 때 이 파일을 읽어서 보안 설정을 적용합니다.
@Configuration
public class SecurityConfig {

    // 2. 소셜 로그인 로직을 담당하는 서비스 (우리가 만든 CustomOAuth2UserService)
    private final CustomOAuth2UserService customOAuth2UserService;

    // 3. 로그인 성공 시 후처리를 담당하는 핸들러 (JWT 발급, 리다이렉트 등)
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    // 4. 생성자 주입: 스프링이 알아서 위 두 가지 구성요소를 채워줍니다.
    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService, OAuth2SuccessHandler oAuth2SuccessHandler) {
        this.customOAuth2UserService = customOAuth2UserService;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    // ---------------------------------------------------------------------
    // 🔒 5. 비밀번호 암호화 및 인증 관리자 등록
    // ---------------------------------------------------------------------

    @Bean // 암호화 도구 등록
    public PasswordEncoder passwordEncoder() {
        // BCrypt라는 강력한 해시 함수를 사용하여 비밀번호를 암호화합니다.
        // (DB에 비밀번호를 그대로 저장하지 않기 위함)
        return new BCryptPasswordEncoder();
    }

    @Bean // 인증 관리자 등록 (일반 로그인 시 필요)
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        // 스프링 시큐리티의 기본 인증 관리자를 가져와서 빈으로 등록합니다.
        // (Controller에서 로그인 검사할 때 쓰입니다)
        return authenticationConfiguration.getAuthenticationManager();
    }

    // ---------------------------------------------------------------------
    // 🛡️ 6. 보안 필터 체인 (핵심 설정)
    // ---------------------------------------------------------------------

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // [CSRF 비활성화]
                // REST API는 세션 대신 토큰을 주로 사용하므로, CSRF 보호를 끕니다.
                .csrf(csrf -> csrf.disable())

                // [CORS 설정 적용]
                // 프론트엔드(3000번 포트)가 백엔드 API를 사용할 수 있게 허용합니다.
                // (아래 corsConfigurationSource 메서드의 설정을 따름)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // [URL별 권한 설정]
                // 어떤 주소는 누구나 갈 수 있고, 어떤 주소는 로그인해야 갈 수 있는지 정합니다.
                .authorizeHttpRequests(auth -> auth
                        // permitAll(): 로그인 없이 접근 허용
                        // "/", 스포티파이 API, 인증 API, 로그인 페이지, 에러 페이지 등은 누구나 접근 가능
                        .requestMatchers(
                                "/",
                                "/api/spotify/**",
                                "/api/auth/**",
                                "/api/library/**", // (참고: 보관함 조회 등도 일단 허용하거나 필요시 막음)
                                "/api/user/**",
                                "/api/comments/**",
                                "/login/**",
                                "/oauth2/**",
                                "/error",
                                "/api/chatbot/",
                                "/api/jobs/**"
                        ).permitAll()

                        // authenticated(): 그 외 나머지 모든 요청은 로그인을 해야만 접근 가능
                        .anyRequest().authenticated()
                )

                // [OAuth2 소셜 로그인 설정]
                .oauth2Login(oauth2 -> oauth2
                        // 로그인 페이지 설정
                        // 인증이 필요한 페이지에 접근하면, 스프링 기본창 대신 우리 프론트엔드 로그인 페이지로 보냅니다.
                        .loginPage("http://localhost:3000/sign-in")

                        // 로그인 성공 핸들러
                        // 카카오/구글 로그인이 성공하면 이 핸들러(oAuth2SuccessHandler)를 실행해라.
                        // (여기서 JWT 토큰을 만들어서 프론트로 보내줍니다)
                        .successHandler(oAuth2SuccessHandler)

                        // 로그인 실패 시 이동할 주소 (에러 파라미터 포함)
                        .failureUrl("http://localhost:3000/sign-in?error=true")

                        // 사용자 정보 가져오기 설정
                        .userInfoEndpoint(userInfo -> userInfo
                                // 소셜 서버에서 사용자 정보를 가져오는 역할을 'customOAuth2UserService'에게 맡깁니다.
                                .userService(customOAuth2UserService)
                        )
                )

                // [로그아웃 설정]
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout") // 프론트에서 이 주소로 요청을 보내면 로그아웃 처리
                        .logoutSuccessUrl("http://localhost:3000/sign-in?logout=true") // 로그아웃 성공 시 이동할 주소
                        .deleteCookies("JSESSIONID") // 브라우저에 저장된 세션 쿠키 삭제
                        .permitAll() // 로그아웃 기능은 누구나 사용 가능
                );

        return http.build(); // 설정 완료된 보안 체인 반환
    }

    // ---------------------------------------------------------------------
    // 🚪 7. CORS 설정 (문지기 설정)
    // ---------------------------------------------------------------------

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 허용할 프론트엔드 주소 (가장 중요!)
        // "http://localhost:3000" 에서 오는 요청만 문을 열어줍니다.
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));

        // 허용할 HTTP 메서드 (GET, POST, PUT, DELETE 등 모두 허용)
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 모든 헤더 허용 (토큰 등을 헤더에 담아야 하므로)
        configuration.setAllowedHeaders(List.of("*"));

        // 자격 증명(쿠키/세션/인증헤더) 허용
        // "로그인 정보(쿠키)를 주고받는 것을 허락합니다."
        configuration.setAllowCredentials(true);

        // 위 설정을 모든 경로("/**")에 적용합니다.
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}