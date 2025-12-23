package com.example.musicbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.Collections;

@SpringBootApplication
public class MusicBackendApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(MusicBackendApplication.class);

        // 🌟 포트를 8080으로 강제 설정 (application.properties보다 우선순위 높음)
        app.setDefaultProperties(Collections.singletonMap("server.port", "8080"));

        // 🚀 서버 실행 (딱 한 번만 호출해야 합니다!)
        app.run(args);
    }
}