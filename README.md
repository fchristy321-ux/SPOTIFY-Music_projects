# 🎵 Music Station (Spotify Clone Project)

> **Spring Boot와 Next.js, 그리고 Docker를 활용하여 구축한 나만의 음악 스트리밍 플랫폼**
> Spotify API와 YouTube API를 결합하여 검색부터 전곡 재생까지 가능한 하이브리드 뮤직 플레이어입니다.

---

## 📖 프로젝트 개요

- **프로젝트명:** Music Station
- **개발 인원:** 1인 (Full-Stack Development)
- **기획 의도:**
  - Spotify API의 '30초 미리듣기' 제한을 극복하기 위해 **YouTube Data API를 융합**하여 끊김 없는 음악 감상 환경을 구현했습니다.
  - **OAuth 2.0 소셜 로그인**부터 **Docker 배포 환경**까지, 엔터프라이즈급 웹 애플리케이션의 전체 수명 주기를 경험하고자 했습니다.

---

## 🛠️ 기술 스택 (Tech Stack)

### 🎨 Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript (ES6+)
- **Styling:** Tailwind CSS (Responsive Design)
- **State Management:** React Context API (`AuthContext`)
- **HTTP Client:** Axios

### ☕ Backend

- **Framework:** Spring Boot 3.x
- **Language:** Java 17
- **Database:** Oracle Database 21c XE
- **ORM:** Spring Data JPA
- **Security:** Spring Security, OAuth2 Client (JWT & Session)

### ☁️ Infrastructure & API

- **Container:** Docker, Docker Compose
- **External APIs:**
  - Spotify Web API (음원 데이터)
  - YouTube Data API v3 (스트리밍 재생)
  - OAuth 2.0 (Kakao, Google, Naver Login)

---

## ✨ 핵심 기능 (Key Features)

### 1. 🔐 통합 로그인 시스템

- **소셜 로그인 3대장(Kakao, Google, Naver)** 연동 완료.
- **일반 회원가입/로그인** 구현 (BCrypt 암호화 적용).
- `JSESSIONID` 쿠키와 Context API를 활용한 **로그인 상태 유지** 및 **마이페이지** 구현.

### 2. 🎧 스마트 하이브리드 플레이어

- **Spotify의 메타데이터**와 **YouTube의 영상**을 실시간으로 매칭합니다.
- 사용자가 곡을 클릭하면 백엔드에서 `가수 + 제목 + lyrics` 키워드로 유튜브를 검색하여, **재생 가능한 최적의 영상 ID**를 반환합니다.
- 이를 통해 저작권 문제없이 **무료로 전곡 듣기**가 가능합니다.

### 3. 🏠 메인 및 검색 (Discovery)

- **신곡 차트:** Spotify 'New Releases' API를 통해 실시간 최신 앨범을 보여줍니다.
- **검색:** 아티스트, 트랙명으로 검색 가능하며, 검색 결과에서 즉시 재생 및 보관함 저장이 가능합니다.

### 4. 💖 나만의 보관함 (My Library)

- **DB 연동:** 마음에 드는 곡의 '하트' 버튼을 누르면 Oracle DB에 영구 저장됩니다.
- **CRUD:** 저장된 곡 목록을 조회하고 삭제할 수 있습니다.

---

## 🚀 실행 방법 (How to Run)

이 프로젝트는 **Docker Compose**를 통해 DB부터 서버까지 한 번에 실행할 수 있습니다.

### 1. 환경 변수 설정

`backend/src/main/resources/application.properties` 파일에 본인의 API 키를 입력해야 합니다.

```properties
spotify.client-id=YOUR_SPOTIFY_ID
spotify.client-secret=YOUR_SPOTIFY_SECRET
youtube.api-key=YOUR_YOUTUBE_API_KEY
# (소셜 로그인 키 설정 포함...)
```
