//1.useSearchParams
//의미 : 주소창 물음표 뒤에 있는 값들을 읽어오는 도구
//주소가 .../callback?token=abcde 라면 여기서 token이라는 이름표를 찾아내 abcde라는 값을 꺼낼수있게 해줌

//2.AuthContext & loginWithToken
//의미:전역 로그인 관리소 와 토큰으로 로그인하는 기능
//이 페이지는 토큰을 받기만 하고 실제 로그인 처리는 전문기관인 AuthContext에게 맡김

//3.useEffect
//의미: 화면이 켜지자마자 실행해라
//사용자가 이 페이지에 도착하는 순간 즉시 주소창을 검사해야하므로 사용

//4.searchParams.get("token")
//의미:주소창 파라미터 중 token의 값을 줘라

//---------------------1.도구준비---------------------------------------------------------/
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation"; //2. 주소창 읽기 도구
import { useAuth } from "@/context/AuthContext"; //3.로그인 관리소 연결

export default function AuthCallbackPage() {
  //4.주소창 검색 도구 (searchparams)를 준비
  const searchParams = useSearchParams();

  //5.관리소 (authcontext)에서 토큰 로그인 기능(loginwithtoken)을 빌려옴
  const { loginWithToken } = useAuth(); // Context에서 함수 가져옴

  //-------------------2.토큰 추출 및 처리 -----------------------------------------------------
  useEffect(() => {
    //1.주소창에 token= 뒤에 있는 글자를 가져와
    const token = searchParams.get("token");

    if (token) {
      // 2. 오? 토큰이 있네?
      console.log("토큰 수신 성공:", token);

      //3.관리소야 이 초큰 가지고 로그인 처리 좀 해줘 (localStorage 저장 + 유저 정보 조회 + 페이지 이동)
      loginWithToken(token);
    } else {
      //4. 토큰이없네?
      alert("로그인 실패: 토큰이 없습니다.");

      //5.다시 로그인 화면으로 돌아가라
      window.location.href = "/profile";
    }
    //6.주소창이 바뀌거나 로그인 함수가 바뀌면 다시 실행해
  }, [searchParams, loginWithToken]);
  //why use effect? : 페이지가 렌덜링 된 직후에 자동으로 토큰을 검사해야 하기 때문

  //loginwithtoken이 하는일:
  //1.localstorage에 토큰 저장
  //2.axios 헤더에 토큰 넣고 백엔드에 나 누구야? 요청
  //3.성공하면 /profile로 이동

  //------------------------3.화면 표시(로딩중)-----------------------------------------//

  return (
    // 검정색 배경, 화면 중앙 정렬
    <div className="flex h-screen items-center justify-center bg-black text-white">
      {/* 반짝거리는(animate-pulse)텍스트표시 */}
      <p className="text-xl animate-pulse">
        로그인 처리 중입니다... 잠시만 기다려주세요.
      </p>
    </div>
  );
}
