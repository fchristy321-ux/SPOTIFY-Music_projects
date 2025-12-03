# 🎵 Music Station (Spotify Clone Project)

> **Spring Boot와 Next.js, 그리고 Docker를 활용하여 구축한 음원 스트리밍 서비스 클론 프로젝트입니다.**
> 실제 Spotify API를 연동하여 최신 앨범 조회, 검색, 30초 미리듣기 기능을 구현하였습니다.

---

## 📖 프로젝트 개요

- **프로젝트명:** Music Station
- **개발 인원:** 1인 개인 프로젝트
- **주요 목표:**
  - **Enterprise Architecture:** Frontend와 Backend를 분리하고, Docker Container 기반의 개발 환경을 구축합니다.
  - **API Integration:** 외부 API(Spotify)의 인증(Auth) 및 데이터 통신 과정을 백엔드에서 직접 처리합니다.
  - **Modern Frontend:** Next.js(App Router)와 Tailwind CSS를 활용하여 반응형이고 트렌디한 UI를 구현합니다.

---

## 🛠️ 기술 스택 (Tech Stack)

### 🎨 Frontend

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (v4)
- **Library:** Axios, Lucide-react (Icons)
- **Deployment:** Nginx (Dockerized)

### ☕ Backend

- **Framework:** Spring Boot 3.x
- **Language:** Java 17
- **Build Tool:** Gradle
- **API:** Spotify Web API Java
- **Security:** CORS Configuration

### 🗄️ Infrastructure & Database

- **Database:** Oracle Database 21c XE (Docker)
- **Container:** Docker, Docker Compose

---

## 🏛️ 시스템 아키텍처 (Architecture)

1.  **Client (Next.js):** 사용자의 브라우저에서 실행되며 UI를 렌더링합니다. Spotify API에 직접 접근하지 않고, Spring Boot 서버로 데이터를 요청합니다.
2.  **Server (Spring Boot):** 클라이언트의 요청을 받아 Spotify 서버와 통신합니다. **Client ID/Secret을 백엔드에서 관리**하여 보안성을 높였습니다.
3.  **External API (Spotify):** 실제 음원 메타데이터와 미리듣기 URL을 제공합니다.

---

## ✨ 주요 기능 (Key Features)

### 1. 🔥 최신 앨범 조회 (New Releases)

- 메인 화면 접속 시, Spring Boot가 Spotify API를 호출하여 최신 발매된 앨범 리스트를 가져옵니다.
- **Next.js Image Optimization**을 사용하여 고화질 앨범 아트를 최적화하여 렌더링합니다.
- 앨범 클릭 시 해당 앨범의 **1번 트랙을 자동으로 미리듣기 재생**합니다.

### 2. 🔍 음악 검색 (Search)

- 가수명, 트랙명, 앨범명으로 음악을 검색할 수 있습니다.
- 검색 결과 리스트에서 원하는 곡을 클릭하면 **Audio 객체를 생성하여 30초 미리듣기**를 재생합니다.
- 재생 중인 곡은 **시각적 효과(테두리, 아이콘 변경)**를 주어 사용자 경험(UX)을 향상시켰습니다.

### 3. 🎧 오디오 플레이어 구현

- HTML5 `Audio` API를 활용하여 별도의 라이브러리 없이 미리듣기 기능을 구현했습니다.
- 중복 재생 방지 로직을 적용하여, 새로운 곡을 클릭하면 이전 곡이 자동으로 멈춥니다.

### 4. 🌑 다크 모드 UI

- Tailwind CSS를 활용하여 Spotify 특유의 다크 테마를 완벽하게 재현했습니다.
- 반응형 그리드 시스템(`grid-cols`)을 적용하여 모바일과 데스크톱 환경 모두를 지원합니다.

---

## 🚀 실행 방법 (How to Run)

이 프로젝트는 **Docker Compose**를 통해 데이터베이스를 포함한 개발 환경을 한 번에 실행할 수 있도록 구성되었습니다.

### 1. 필수 요구 사항

- Docker Desktop 설치 및 실행
- Node.js (v18 이상)
- Java JDK 17 이상

### 2. 설치 및 실행

```bash
# 1. 저장소 클론
git clone [https://github.com/](https://github.com/)[본인아이디]/music-station.git
cd music-station

# 2. 데이터베이스 실행 (Oracle)
docker-compose up -d

# 3. 백엔드 실행
cd backend
./gradlew bootRun

# 4. 프론트엔드 실행
cd ../frontend
npm install
npm run dev

3. 접속
Frontend: http://localhost:3000

Backend API: https://www.google.com/search?q=http://127.0.0.1:8080
```
