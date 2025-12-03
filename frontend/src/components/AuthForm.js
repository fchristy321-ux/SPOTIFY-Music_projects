"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AuthForm({ errorMsg: propErrorMsg }) {
  const router = useRouter();
  // 🚨 [수정] 127.0.0.1 -> localhost 로 통일
  const OAUTH_URL = "http://localhost:8080/oauth2/authorization";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState(propErrorMsg);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.type]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      // 🚨 [수정] localhost로 요청
      await axios.post("http://localhost:8080/api/auth/login", formData, {
        withCredentials: true, // 쿠키 저장 필수
      });

      // 🚨 [중요] 로그인 성공 시 강제로 페이지 새로고침하며 이동
      // (새로고침을 해야 브라우저가 쿠키를 확실하게 인식합니다)
      window.location.href = "/profile";
    } catch (error) {
      console.error("로그인 실패:", error);
      setErrorMsg("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm gap-6">
      <h1 className="text-3xl font-bold text-center mb-2 text-white">로그인</h1>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md flex items-center gap-3 text-sm w-full">
          <AlertCircle size={20} />
          <div className="flex-1">
            <p className="font-bold">로그인 실패</p>
            <p>{errorMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-1">
          <label className="text-gray-400 text-xs ml-1">이메일</label>
          <input
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 rounded bg-[#2A2A2A] text-white border border-gray-700 focus:outline-none focus:border-green-500 transition"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-gray-400 text-xs ml-1">비밀번호</label>
          <input
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="p-3 rounded bg-[#2A2A2A] text-white border border-gray-700 focus:outline-none focus:border-green-500 transition"
          />
        </div>
        <button
          type="submit"
          className="bg-[#1DB954] p-3 rounded font-bold text-black hover:bg-[#1ed760] transition transform active:scale-95 mt-2"
        >
          로그인
        </button>
      </form>

      <div className="text-center text-sm text-gray-400 w-full">
        <span>아직 계정이 없으신가요? </span>
        <Link
          href="/signup"
          className="text-white underline hover:text-green-400 font-bold ml-1"
        >
          회원가입 하기
        </Link>
      </div>

      <div className="flex items-center gap-2 my-2 w-full">
        <div className="h-px bg-gray-700 flex-1"></div>
        <span className="text-gray-500 text-xs">또는</span>
        <div className="h-px bg-gray-700 flex-1"></div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <a
          href={`${OAUTH_URL}/kakao`}
          className="transition hover:opacity-90 active:scale-95"
        >
          <div className="bg-[#FEE500] text-black py-3 rounded font-bold text-center flex items-center justify-center gap-2 relative">
            <span className="absolute left-4 text-xl">💬</span>
            카카오로 시작하기
          </div>
        </a>
        <a
          href={`${OAUTH_URL}/google`}
          className="transition hover:opacity-90 active:scale-95"
        >
          <div className="bg-white text-black py-3 rounded font-bold text-center flex items-center justify-center gap-2 relative">
            <span className="absolute left-4 text-xl">G</span>
            구글로 시작하기
          </div>
        </a>
        <a
          href={`${OAUTH_URL}/naver`}
          className="transition hover:opacity-90 active:scale-95"
        >
          <div className="bg-[#03C75A] text-white py-3 rounded font-bold text-center flex items-center justify-center gap-2 relative">
            <span className="absolute left-4 text-xl font-black">N</span>
            네이버로 시작하기
          </div>
        </a>
      </div>
    </div>
  );
}
