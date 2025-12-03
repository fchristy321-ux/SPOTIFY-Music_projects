// 1."use client":
//의미: 이 파일은 클라이언트에서 실행
//next.js는 기본적으로 서버에서 HTML을 다 만들어서 보내주는(SSR)클릭이나 상태변경(USESTATE)같은
//동적인 기능을 쓰려면 브라우저 한테 너가 이부분 맡아 라고 알려줘야 함

//2.import ... from "lucide-react":
//의미: 예쁜 아이콘 꾸러미를 가져옴
//PLAY, HEART, PLUS같은 아이콘들을 컴포넌트 처럼 쓸수 있게 해주는 라이브러리

// 3.export default function AlbumDetail:
//이 파일의 대표 선수(메인 컴포넌트)는 Albumdetail 함수
// 다른 파일에서 import AlbumDetail 하면 이 함수를 가져다 씀

// 4.{ params }:
//의미: 주소창에 있는 변수들
//주소가 .../album/12345 라면, params 안에는 { id: "12345" } 같은 정보가 들어옴

//5.className (Tailwind CSS):
//HTML의 class와 같지만, Tailwind를 쓰면 CSS 파일 없이 클래스 이름만으로 디자인을 끝냄
//예: text-white (글자색 흰색), p-8 (안쪽 여백 8), flex (가로 정렬)

//--------------------------1.선언부-------------------------------------------------//
"use client"; //1.클라이언트 컴포넌트 선언
import { Play, Heart, Plus } from "lucide-react"; //2. 아이콘 가져오기

export default function AlbumDetail({ params }) {
  //3. 컴포넌트 시작(params 받음)

  //----------------------------2.전체 레이아웃(return 시작 )-----------------------------------------------//
  return (
    //4. 전체 컨테이너: 안쪽 여백(padding)을 8만큼 줌
    <div className="p-8">
      {/* -------------------------3.앨범 헤더(상단 정보)----------------------------------------- */}
      {/* 1. 앨범 헤더 */}
      <div className="flex gap-8 items-end mb-8">
        {/* flex:가로로 배치 , gap-8: 사이 간격 8, items-end: 아래쪽 라인 맞춤, mb-8:아래 여백 8*/}

        <img src={album.image} className="w-52 h-52 shadow-2xl" />
        {/* w-52 h-52: 너비 높이  52, shadow-2xl:그림자 아주 진하게 */}

        <div>
          <p className="text-sm font-bold uppercase">Album</p>
          {/* text-sm:글자 작게, bold: 굵게 , uppercase: 대문자로(ALBUM) */}

          <h1 className="text-5xl font-extrabold my-4">{album.name}</h1>
          {/* text-5xl: 글자 아주 크게(제목), my-4: 위아래 여백 4 */}

          <p className="text-gray-300">
            {/* text-gray-300: 연한 회색 글씨  */}
            {album.artist} • {album.releaseDate} • {album.totalTracks} songs
          </p>
        </div>
      </div>
      {/* ---------------------------4.액션 버튼(재생,좋아요 )---------------------------------------------------- */}
      {/* 2. 액션 버튼 */}
      <div className="flex items-center gap-4 mb-8">
        {/* items-center: 세로 가운데 정렬  */}
        <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition text-black">
          {/* w-14 h-14: 버튼 크기, rounded-full:완전 동그랗게 */}
          {/* bg-green: 스포티파이 초록색 배경 */}
          {/* hover:scale-105:마우스 올리면 1.05배 커짐(애니메이션) */}

          {/* 재생 아이콘 (검은색 채움) */}
          <Play fill="black" size={24} />
        </button>
        <button className="text-gray-400 hover:text-white">
          {/* 기본은 회색, 마우스 올리면 흰색으로 변함 */}

          <Heart size={32} />
          {/*하트 아이콘   */}
        </button>
        <button className="text-gray-400 hover:text-white">
          <Plus size={32} />
        </button>
      </div>
      {/* -------------------------5. 트랙리스트(곡 목록 테이블)--------------------------------------------- */}
      {/* 3. 트랙 리스트 (테이블) */}
      <div className="flex flex-col">
        {/* 세로로 배치 */}

        {/* 헤더 행(Title, Artist, time) */}
        <div className="grid grid-cols-[50px_1fr_1fr_50px] text-gray-400 border-b border-gray-800 pb-2 mb-2">
          {/* grid: 격자 무늬 배치 */}
          {/* grid-cols-[...]: 칸 크기 지정 (50px, 나머지, 나머지, 50px) */}
          {/* border-b: 아래쪽에 선 긋기 */}
          <span>#</span>
          <span>Title</span>
          <span>Artist</span>
          <span>Time</span>
        </div>

        {/* 실제 데이터 목록 (반복문)*/}
        {tracks.map((track, idx) => (
          <div
            key={track.id} //리액트가 구별할 주민등록번호
            className="grid grid-cols-[50px_1fr_1fr_50px] items-center hover:bg-white/10 p-2 rounded group"
          >
            {/* hover:bg-white/10: 마우스 올리면 배경을 10% 투명한 흰색으로 (하이라이트 효과) */}
            {/* group: 자식 요소들이 '부모가 hover 됐을 때' 반응하게 만듦 */}

            <span className="text-gray-400">{idx + 1}</span>
            {/* 순서번호 */}

            <span className="text-white font-medium">{track.name}</span>
            {/* 제목 */}

            <span className="text-gray-400">{track.artist}</span>
            {/* 가수 */}

            <span className="text-gray-400">0:30</span>
            {/* 시간 */}
          </div>
        ))}
      </div>
    </div>
  );
}
