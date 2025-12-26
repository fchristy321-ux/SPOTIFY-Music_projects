markdown
# 🎵 Music Station (뮤직 스테이션)

Spotify와 YouTube를 결합한 AI 기반 음악 스트리밍 & 커뮤니티 플랫폼

Music Station은 Spotify의 방대한 음악 데이터와 YouTube의 영상 자원을 결합하여 사용자에게 최적화된 시청각 경험을 제공함. 다크 모드 기반의 세련된 UI와 Gemini AI를 활용한 개인화된 추천 시스템이 특징임.

## 📷 서비스 미리보기 (Screenshots)

| 메인 홈 (최신 앨범 탐색) | 통합 검색 및 하단 플레이어 |
|---|---|
| ![메인 홈](https://via.placeholder.com/400x250?text=Main+Home) | ![통합 검색 및 하단 플레이어](https://via.placeholder.com/400x250?text=Search+and+Player) |

| AI DJ 뮤직봇 대화 | AI 클린봇 방명록 |
|---|---|
| ![AI DJ 뮤직봇 대화](https://via.placeholder.com/400x250?text=AI+DJ+Chat) | ![AI 클린봇 방명록](https://via.placeholder.com/400x250?text=AI+Cleanbot+Guestbook) |

## 1. 프로젝트 개요 (Overview)

*   **개발 기간**: 2024.12 ~ (진행 중)
*   **개발 인원**: 개인 프로젝트 (Full Stack)
*   **디자인 컨셉**: 사용자 몰입감을 극대화하는 다크 테마(Dark Mode) 및 직관적인 사이드바 내비게이션 레이아웃 적용.
*   **주요 목표**: 메타데이터 검색과 영상 스트리밍의 유기적 결합, AI 기반의 건전한 커뮤니티 환경 조성임.

## 2. 기술 스택 (Tech Stack)

| 구분      | 기술 (Technology)                                        |
| :-------- | :------------------------------------------------------- |
| Frontend  | Next.js 13+ (App Router), React, Tailwind CSS, Lucide Icons |
| Backend   | Spring Boot 3.x, Spring Security, Spring Data JPA        |
| Database  | Oracle Database (Docker Container)                       |
| DevOps    | Docker, Docker Compose                                   |
| Auth      | JWT (Json Web Token), OAuth2.0 (Naver)                   |
| External API | Spotify API, YouTube Data API v3, Google Gemini API, Perspective API |

## 3. 주요 기능 상세 소개 (Key Features)

### 🎹 지능형 스트리밍 및 플레이어 시스템

*   **데이터 매시업 재생**: Spotify API에서 가져온 트랙 정보(제목, 아티스트명)를 바탕으로 YouTube Data API를 자동 쿼리하여 가장 적합한 공식 뮤직비디오나 음원 영상을 매칭하여 재생함.
*   **하단 고정형 컨트롤러**: 페이지를 이동하더라도 음악이 끊기지 않도록 글로벌 상태 관리를 통해 플레이어를 유지함. 재생/일시정지, 다음 곡/이전 곡, 셔플, 반복 재생 및 실시간 프로그레스 바 조작이 가능함.
*   **비디오 모달 인터페이스**: 영상 중심의 감상을 원하는 사용자를 위해 레이어 팝업 형태의 비디오 플레이어를 제공하며, 고화질 스트리밍을 지원함.

### 🔍 정밀 검색 및 나만의 음악 보관함

*   **통합 검색 엔진**: Spotify의 방대한 데이터베이스를 활용하여 단순한 텍스트 검색을 넘어 앨범 아트워크, 발매일, 아티스트 상세 정보가 포함된 고품질 검색 결과를 실시간으로 제공함.
*   **영구 저장 보관함 (My Library)**: '좋아요(하트)' 버튼 클릭 시 해당 곡의 모든 메타데이터를 Oracle DB에 저장함. 사용자는 본인이 저장한 곡들을 최근 순으로 확인하고 즉시 재생하거나 삭제할 수 있음.
*   **반응형 리스트 UI**: 데스크톱뿐만 아니라 모바일에서도 곡 정보를 한눈에 볼 수 있도록 최적화된 리스트 레이아웃을 제공함.

### 🛡️ 보안 인증 및 사용자 경험

*   **하이브리드 로그인**: Spring Security를 기반으로 직접 구현한 이메일/비밀번호 인증 방식과 네이버 소셜 로그인(OAuth 2.0)을 통합 제공하여 회원가입 허들을 낮춤.
*   **JWT 세션 관리**: 로그인 시 발급되는 JWT를 통해 보안을 유지하며, 사용자별 개인화된 보관함 데이터를 안전하게 관리함. 비로그인 시에는 '좋아요' 및 'AI 챗봇' 등 특정 기능에 대한 접근을 제한하여 회원가입을 유도함.

### 🤖 AI DJ 뮤직봇 (Personalized Recommendation)

*   **Gemini 기반 맞춤 추천**: 사용자가 채팅창에 "비 오는 날 듣기 좋은 감성적인 노래 추천해줘"와 같은 자연어를 입력하면 Google Gemini AI가 맥락을 분석하여 곡 제목과 추천 사유를 대화형으로 제공함.
*   **대화형 인터페이스**: 챗봇 형태의 UI를 통해 사용자와 AI 간의 실시간 소통이 가능하며, 추천받은 곡을 즉시 검색으로 연결할 수 있는 경험을 선사함.

### 🧼 AI 클린봇 방명록 (Community Governance)

*   **유해성 실시간 필터링**: 사용자가 방명록을 작성하면 Perspective API가 문장을 분석하여 욕설, 비방, 공격적 언어를 수치화함.
*   **자동 차단 시스템**: 분석된 유해 점수가 설정된 임계치(Threshold)를 넘을 경우 DB 저장을 사전에 차단하고, 사용자에게 순화된 표현을 권장하는 시스템 팝업을 띄워 건전한 커뮤니티를 유지함.
*   **타임라인 관리**: `@CreationTimestamp`를 활용하여 작성 시점을 정확하게 기록하고, 사용자 지역에 맞는 한국 표준시(KST)로 정렬하여 제공함.

## 4. 시스템 아키텍처 및 환경 (Architecture)

### 🐳 Docker를 활용한 DB 인프라

데이터베이스 구축 및 유지보수의 편의성을 위해 Docker Compose를 사용함.

yml
version: '3.8'
services:
oracle-db:
image: gvenzl/oracle-xe:slim
container_name: music-db
ports:
- "1522:1521"
environment:
- ORACLE_PASSWORD=oracle
volumes:
- ./oracle-data:/opt/oracle/oradata


## 5. 트러블 슈팅 (Troubleshooting)

### ⚡ 이슈 1: OAuth2 소셜 로그인 후 Callback 처리

*   **현상**: 네이버 로그인 성공 후 백엔드 리다이렉트 시 프론트엔드에서 토큰 수신 불가함.
*   **해결**: `app/auth/callback` 전용 페이지를 구축하여 URL 쿼리 파라미터에서 JWT를 추출, 로컬 스토리지에 안전하게 저장한 뒤 홈으로 이동시키는 로직을 구현함.

### 🕒 이슈 2: 시간 동기화 문제 (Client vs Server)

*   **현상**: 방명록 게시글의 시간이 서버 시간과 로컬 시간이 달라 혼선 발생함.
*   **해결**: 서버 엔티티에서 `@CreationTimestamp`로 표준 시간을 기록하고, 프론트엔드 출력 시 `toLocaleString('ko-KR')`를 사용하여 사용자 지역에 맞는 한국 표준시(KST)로 변환함.
