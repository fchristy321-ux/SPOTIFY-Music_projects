//1. useSearchParams
//의미: 주소창의 물음표 뒤를 읽는 돋보기
//주소가 .../callback?token=abcde123 이라면, 여기서 token이라는 이름표를 찾아내 abcde123 값을꺼냄

//2.useRouter
//의미: 페이지 이동 네비게이션
//router.push("/")라고 하면 "메인 화면으로 이동해라는 명령

//3.useEffect
//의미: 화면이 켜지자마자 실행해

//4.loginWithToken
//의미: 토큰으로 로그인 시켜주는 함수
//AuthContext에서 만들었던 함수입니다. (토큰 저장 + 유저 정보 가져오기 + 페이지 이동)

//---------------------------1.도구준비------------------------------------------//
"use client"; //1. 브라우저에서 작동하는 페이지임을 선언

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; //2. Next.js의 이동 /주소 읽기 도구
import { useAuth } from "@/context/AuthContext"; //3. 전약 로그인 관리소

export default function AuthCallbackPage() {
  const router = useRouter(); //4. 페이지 이동 도구 준비
  const searchParams = useSearchParams(); //5.주소창 읽기 도구 준비
  const { loginWithToken } = useAuth(); // Context에서 로그인 함수 가져오기

  //---------------------------2.토큰 낚아채기---------------------------------------------------//

  useEffect(() => {
    // 1. "주소창(?token=...)에서 'token' 값을 꺼내와라."
    const token = searchParams.get("token");

    if (token) {
      // 토큰이 있네? 성공 -> 로그 찍어보기
      console.log("토큰 받음:", token);

      //context애 이 토큰으로 로그인 처리 좀 해줘 (localstorage저장 )
      loginWithToken(token);

      // 4.처리가 끝났으면 메인 홈('/')으로 보내버려
      router.push("/");
    } else {
      // 5. "토큰이 없네? (실패/잘못된 접근)" -> 경고창 띄우기
      alert("로그인에 실패했습니다.");

      // 6. "로그인 페이지로 쫓아내."
      router.push("/sign-in");
    }
  }, [searchParams, router, loginWithToken]); //이 변수들이 준비되면 실행해라

  //-----------------3.로딩화면(사용자가 잠깐 보는 화면)--------------------------------------------------------//
  return (
    //화면 정중앙에 배치(검은 배경, 흰 글씨)
    <div className="flex items-center justify-center h-screen bg-black text-white">
      {/* 반짝거리는(animate-pulse)효과로 처리중임을 알림  */}
      <p className="text-xl animate-pulse">로그인 처리 중입니다...</p>
    </div>
  );
}
// 이화면은 언제보이는가?: 백엔드에서 넘어와서 -> 토큰을 저장 -> 홈으로 이동하기 전까지의 아주 짧은 찰나 동안만 보임
