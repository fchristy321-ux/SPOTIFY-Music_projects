//1."use client"
//의미:이 페이지는 브라우저에서 움직이는 화면이다
//클릭하고,재생하고,삭제하는 동작이있으니까 클라이언트 컴포넌트여야함

//2.useState
//의미: 화면의 기억장치
//MYTRACKS: 불러온 노래 목록을 기억함
//isplayeropen: 플레이어가 열렸는지 기억
//값이 바뀌면 화면이 자동으로 새로 그려짐

//useEffect
//의미:화면 켜질때 실행할 명령
//이 페이지에 들어오자마자([]) 보관함 목록을 불러와라(fetchLibrary)라고 시키는 용도

//map
//의미: 반복해서 그리기
//노래가 10곡이면 <DIV>태그를 10번쓰는게 아니라 MAP을 써서 자동으로 10개를 그림

// ----------------리액트 필수 지식 ---------------------------------------------------------
//1. Client Component ("use client")
//의미: 브라우저(클라이언트)에서 자바스크립트를 실행하여 상호작용(클릭, 상태 변경)을 처리하는 컴포넌트
//Why: Next.js 13+ (App Router)는 기본적으로 모든 컴포넌트를 **서버 컴포넌트(Server Component)**로 만듭니다.
// 서버 컴포넌트는 HTML만 띡 보내주고 자바스크립트 기능(useState, useEffect 등)이 작동하지 않습니다.
// 우리는 버튼을 누르고 화면을 바꿔야 하므로, "use client"를 선언하여 **"이건 브라우저에서 돌릴 거야!"**라고 명시

//2.Hooks (use...)
//의미: 함수형 컴포넌트에서 상태(State)와 생명주기(Lifecycle) 기능을 "낚아채서(Hook)" 사용할 수 있게 해주는 도구
//useState: 컴포넌트의 **"기억 장치"**입니다. 값이 바뀌면 리액트가 알아서 화면을 다시 그림(Re-rendering).
//useEffect: 컴포넌트의 **"수명 주기 관리자"**입니다. 화면이 처음 나타날 때(Mount), 사라질 때(Unmount), 특정 값이 바뀔 때(Update) 실행할 코드를 정함

//3.Async/Await (비동기 처리)
//의미: "오래 걸리는 작업(API 호출)을 할 때, 결과가 올 때까지 기다렸다가(await) 다음 줄을 실행해라.
//Why: 자바스크립트는 성격이 급해서(Non-blocking), 데이터를 다 받아오기도 전에 다음 코드를 실행해 버립니다. 그러면 데이터가 없어서 에러가 나겠죠? 그래서 await로 "잠깐 멈춰!"라고 신호를 주는 것

//4.Axios
//의미: 브라우저가 서버에게 데이터를 요청할 때 쓰는 **"가장 인기 있는 배달원(HTTP Client)
//Why: 기본 fetch 함수보다 사용법이 더 직관적이고, 자동으로 JSON 변환을 해주며, 에러 처리가 더 편리해서 씀

//---------------------------------------------------------------------------------------------------------//
"use client"; //1. 클라이언트 컴포넌임을 선언

import { useEffect, useState } from "react"; //2. 리액트의 핵심 훅 가져오기
import axios from "axios"; //3.API 통신 도구 가져오기
import Image from "next/image"; //4.Next.js 전용 이미지 최적화 컴포넌트
import { Trash2, PlayCircle } from "lucide-react"; //5,아이콘 가져오기
import YouTubePlayer from "@/components/YouTubePlayer"; // 6. 우리가 만든 플레이어 컴포넌트 가져오기
//Image (Next.js): 일반 <img> 태그 대신 이걸 쓰면, 이미지를 자동으로 압축하고(WebP), 화면 크기에 맞춰 리사이징하고,
// 화면에 보일 때만 로딩(Lazy Loading)해서 성능을 엄청나게 높여줌

//---------------------------1.상태준비---------------------------------------------
export default function LibraryPage() {
  //1.노래 목록 저장할 바구니(처음엔 비어있음[])
  const [myTracks, setMyTracks] = useState([]);

  // 2.유튜브 플레이어 관련 상태들
  const [isPlayerOpen, setIsPlayerOpen] = useState(false); //플레이어 열림/닫힘
  const [currentTrack, setCurrentTrack] = useState({ name: "", artist: "" }); //현재 곡 정보
  const [videoId, setVideoId] = useState(null); //유튜브 영상 ID

  //const [변수명, set변수명]:myTracks는 값을 읽을 때 쓰고, setMyTracks는 값을 바꿀 때 씁니다.
  // 직접 myTracks = [...] 이렇게 바꾸면 리액트가 모름

  //---------------------------2.보관함 불러오기(fetchLibrary)----------------------------------------------//
  const fetchLibrary = async () => {
    // 비동기 함수 선언
    try {
      //1.백엔드에 내 보관함 목록 줘 요청(GET)
      //withCredentials: true -> "내 쿠키(로그인 정보)도 같이 보낼게" (필수!)
      //await: 응답이 올 때까지 여기서 기다림 (안 기다리면 response가 undefined 뜸)
      const response = await axios.get("http://localhost:8080/api/library", {
        withCredentials: true,
      });
      //// 2. 받아온 데이터(response.data)를 내 바구니(myTracks)에 담기
      // 이 순간, 리액트가 "어? 데이터가 바뀌었네?" 하고 화면을 다시 그림 (Re-rendering)      setMyTracks(response.data);
    } catch (error) {
      console.error("보관함 불러오기 실패:", error);
    }
  };
  //withCredentials: true: 이게 없으면 백엔드는 "너 누구야?" 하고 401 에러를 뱉음.
  // 브라우저에 저장된 JSESSIONID 쿠키를 백엔드로 전송해서 "나 아까 로그인한 홍길동이야"라고 증명하는 옵션

  //----------------------------최초실행--------------------------------------------------//
  //3.화면이 켜지자마자 fetchlibrary 실행
  useEffect(() => {
    fetchLibrary();
  }, []); //의존성 배열이 빈 배열[] 이면 최초 1회만 실행해라 라는 뜻

  //--------------------------3.삭제기능(handleDelete)--------------------------------------------------//

  const handleDelete = async (id) => {
    //1.wlsWK 지울건지 물어봄
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      //2, 백엔드에 이 ID 노래 지워줘 요청 (DELETE)
      await axios.delete(`http://localhost:8080/api/library/${id}`, {
        withCredentials: true,
      });
      //3.지웠으니까 목록 다시 불러오기
      fetchLibrary();
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };
  //-----------------------------4.재생 기능------------------------------------------------//
  // 보관함에서도 재생 되게 추가
  const handlePlay = async (track) => {
    try {
      //1.검색어 만들기 (가수+ 제목 + official audio)
      const query = `${track.artist} ${track.title} official audio`;

      //2. 백엔드에 유튜브 ID 요청
      const youtubeRes = await axios.get(
        `http://localhost:8080/api/spotify/youtube-video?query=${query}`
      );
      //3.ID 있으면 플레이어 세팅하고 열기
      if (youtubeRes.data) {
        setCurrentTrack({ name: track.title, artist: track.artist });
        setVideoId(youtubeRes.data);
        setIsPlayerOpen(true);
      } else {
        alert("영상을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("재생 실패:", error);
    }
  };
  //----------------------5. 화면 그리기-------------------------------------------------
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">💖 나만의 보관함</h1>
      {/* 1.목록이 비었을때 보여줄 화면 */}
      {myTracks.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">
          아직 저장된 노래가 없습니다. 검색해서 추가해보세요!
        </p>
      ) : (
        // 2. 목록이 있을 때 (테이블 형태)
        <div className="space-y-2">
          <div className="grid grid-cols-[50px_1fr_1fr_100px] gap-4 text-gray-400 text-sm border-b border-gray-800 pb-2 px-4">
            <span>#</span>
            <span>제목</span>
            <span>가수</span>
            <span className="text-center">관리</span>
          </div>
          {/* 3. 실제 노래 리스트 반복 출력 */}
          {myTracks.map((track, index) => (
            <div
              key={track.id}
              className="grid grid-cols-[50px_1fr_1fr_100px] gap-4 items-center hover:bg-[#2a2a2a] p-3 rounded-md group transition"
            >
              {/* 4. 순서 번호 (마우스 올리면 재생 버튼으로 바뀜) */}
              <div className="text-gray-400 group-hover:hidden">
                {index + 1}
              </div>
              <button
                onClick={() => handlePlay(track)}
                className="hidden group-hover:block text-white hover:text-green-500"
              >
                <PlayCircle size={20} />
              </button>

              {/* 5. 앨범 이미지 + 제목 */}
              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10">
                  <Image
                    src={track.albumImage}
                    alt={track.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <span className="font-bold text-white truncate">
                  {track.title}
                </span>
              </div>
              {/* 6. 가수 이름 */}
              <div className="text-gray-400 truncate">{track.artist}</div>
              {/* 7. 삭제 버튼 (휴지통 아이콘) */}
              <div className="text-center">
                <button
                  onClick={() => handleDelete(track.id)}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* 8. 유튜브 플레이어 (평소엔 숨겨져 있음) */}
      <YouTubePlayer
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        trackName={currentTrack.name}
        artist={currentTrack.artist}
        videoId={videoId}
      />
    </div>
  );
}
