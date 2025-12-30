# 🎵 Music Station (뮤직 스테이션)

Spotify와 YouTube를 결합한 AI 기반 음악 스트리밍 & 커뮤니티 플랫폼

Music Station은 Spotify의 방대한 음악 데이터와 YouTube의 영상 자원을 결합하여 사용자에게 최적화된 시청각 경험을 제공. 다크 모드 기반의 세련된 UI와 Gemini AI를 활용한 개인화된 추천 시스템이 특징

## 1. 프로젝트 개요 (Overview)

**개발 기간**:2025.11~ 2025.12

**개발 인원**: 개인 프로젝트 (Full Stack)

## 2. 기술 스택 (Tech Stack)

| 구분 | 기술 (Technology) |
| :-------- | :----------------------------------------------------------------------------- |
| Frontend | Next.js 13+ (App Router), React, Tailwind CSS, Lucide Icons |
| Backend | Spring Boot 3.x, Spring Security, Spring Data JPA |
| Database | Oracle Database (Docker Container) |
| DevOps | Docker, Docker Compose |
| Auth | JWT (Json Web Token), OAuth2.0 (Naver) |
| External API | Spotify API, YouTube Data API v3, Google Gemini API, Perspective API |

## 3. 주요 기능 상세 소개 (Key Features)

## 🏠 메인 화면 (Main Dashboard)
<img width="1916" height="910" alt="image" src="https://github.com/user-attachments/assets/593b0aef-76d9-4ae6-8ddf-ec5c6d24690a" />

**홈 화면** : 사용자의 취향에 맞는 최신 트렌드 음악과 추천 리스트를 첫 화면에 배치하여 접근성을 극대화

**사이드바**: 대시보드 내비게이션을 통해 홈, 검색, 라이브러리, 등 주요 메뉴로 즉각적인 이동이 가능

**배경화면**: 다크 모드와 대비되는 포인트 컬러를 사용하여 세련된 스트리밍 플랫폼 UI를 구현


### 🎹 지능형 스트리밍 및 플레이어 시스템

<img width="1910" height="905" alt="image" src="https://github.com/user-attachments/assets/30b6183c-93bd-4ebb-bdfe-28dd766ba563" />

 **영상 매칭 시스템**: Spotify API에서 가져온 트랙 정보(제목, 아티스트명)를 바탕으로 YouTube Data API를 자동 쿼리하여 가장 적합한 공식 뮤직비디오나 음원 영상을 매칭하여 재생
 
 **하단 고정 컨트롤러**: 페이지를 이동하더라도 음악이 끊기지 않도록 글로벌 상태 관리를 통해 플레이어를 유지. 재생/일시정지, 다음 곡/이전 곡, 및 실시간 프로그레스 바 조작이 가능
 
 **비디오 모달 인터페이스**: 영상 중심의 감상을 원하는 사용자를 위해 레이어 팝업 형태의 비디오 플레이어를 제공하며, 고화질 스트리밍을 지원

### 🔍 통합 검색 및 음악 보관함
<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/80faff08-2cbc-4b37-a1e0-1bf485807e48" />
<img width="1916" height="901" alt="image" src="https://github.com/user-attachments/assets/626bf738-0ec1-4a53-b79d-8b44300a55c0" />

**통합 검색 엔진**: Spotify의 방대한 데이터베이스를 활용하여 단순한 텍스트 검색을 넘어 앨범 아트워크, 발매일, 아티스트 상세 정보가 포함된 고품질 검색 결과를 실시간으로 제공

**저장 보관함 (My Library)**: '좋아요(하트)' 버튼 클릭 시 해당 곡의 모든 데이터를 Oracle DB에 저장합니다. 사용자는 본인이 저장한 곡들을 최근 순으로 확인하고 즉시 재생

### 🔐 보안 인증 및 회원가입 (Auth & Sign Up)

<img width="1918" height="898" alt="image" src="https://github.com/user-attachments/assets/64cf8c3d-42ae-4186-8035-d9fe1e8564a7" />
<img width="1913" height="750" alt="image" src="https://github.com/user-attachments/assets/46227ebe-1802-478a-8962-c9ef5d7e148b" />
<img width="1918" height="910" alt="image" src="https://github.com/user-attachments/assets/b8d41268-f072-4fe4-a86b-2779c8cfb88e" />

**회원가입**: 이메일 중복 확인 및 비밀번호 유효성 검사를 포함한 체계적인 가입 절차를 제공합니다. 보안을 위해 모든 비밀번호는 BCrypt 해시 함수로 암호화되어 저장

**로그인**: Spring Security를 기반으로 직접 구현한 이메일 인증 방식과 네이버 소셜 로그인(OAuth 2.0)을 통합 제공하여 접근 편의성을 높임

**JWT 세션 관리**: 로그인 성공 시 발급되는 JWT 토큰을 통해 사용자 세션을 유지하며, 비로그인 사용자의 접근을 차단하는 보호된 라우팅(Protected Routes)을 적용

### ⚙️ 사용자 설정 및 관리 (User Settings)
<img width="1919" height="904" alt="image" src="https://github.com/user-attachments/assets/f590e96e-53f8-47ca-883a-25f8ed7ed448" />


**프로필 관리**: 사용자의 닉네임을 자유롭게 수정할 수 있는 환경을 제공

  
### 🤖 AI DJ 뮤직봇 (Personalized Recommendation)
<img width="375" height="549" alt="image" src="https://github.com/user-attachments/assets/965469a3-7a80-42ae-b828-6c3328626003" />

**Gemini 기반 맞춤 추천**: 사용자가 채팅창에 입력하면 Google Gemini AI가 분석하여 곡 제목과 추천을 제공 

**대화형 인터페이스**: 챗봇 형태의 UI를 통해 사용자와 AI 간의 실시간 소통이 가능하며, 추천받은 곡을 즉시 검색으로 연결


### 🧼 AI 클린봇 방명록 (Community Governance)
<img width="1913" height="917" alt="image" src="https://github.com/user-attachments/assets/56753a07-20b1-4864-9644-c45dc5b8dd85" />


**유해성 실시간 필터링**: Perspective API를 통해 댓글의 욕설, 비방성 등을 수치화하여 분석

**자동 차단 시스템**: 유해 점수가 기준치를 초과할 경우 저장을 차단하고 사용자에게 순화된 표현을 권장하는 시스템 팝업을 표시

# 👤  마이페이지 (My Page)

<img width="1649" height="686" alt="image" src="https://github.com/user-attachments/assets/be5ca4a8-53ed-417d-874e-8c03c1681af2" />

**프로필**:로그인한 사용자의 닉네임, 이메일 주소, 그리고 연결된 계정 유형(예: Naver 계정)을 한눈에 확인할 수 있는 카드형 UI를 제공

**좋아요 표시한 곡**: 사용자가 찜한 노래 모음 페이지로 즉시 이동할 수 있는 바로가기 기능을 제공
  
**프로필 수정**: 닉네임 변경 등 사용자 정보를 유연하게 관리할 수 있는 설정 페이지를 연동

## 계정 추가 및 세션 관리

<img width="751" height="506" alt="image" src="https://github.com/user-attachments/assets/1f465751-46e6-4964-8436-a97b0356ab3f" />


  **계정 추가**: 다중 계정 사용자를 고려한 계정 추가 확장성을 확보
  
  **보안 로그아웃**: 클릭 한 번으로 안전하게 세션을 종료하고 토큰을 파기할 수 있는 직관적인 로그아웃 버튼을 배치



## 4. 시스템 아키텍처 및 환경 (Architecture)

### 🐳 Docker를 활용한 DB 인프라

데이터베이스 구축 및 유지보수의 편의성을 위해 Docker Compose를 사용

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

**현상**: 네이버 로그인 성공 후 백엔드 리다이렉트 시 프론트엔드에서 토큰 수신 불가

**해결**: `app/auth/callback` 전용 페이지를 구축하여 URL 쿼리 파라미터에서 JWT를 추출, 로컬 스토리지에 안전하게 저장한 뒤 홈으로 이동시키는 로직을 구현

### 🕒 이슈 2: 시간 동기화 문제 (Client vs Server)

**현상**: 방명록 게시글의 시간이 서버 시간과 로컬 시간이 달라 혼선 발생
**해결**: 서버 엔티티에서 `@CreationTimestamp`로 표준 시간을 기록하고, 프론트엔드 출력 시 `toLocaleString('ko-KR')`를 사용하여 한국 표준시(KST)로 변환
