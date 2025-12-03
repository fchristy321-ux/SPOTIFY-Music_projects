"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.nickname) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      // 🚨 [수정] localhost로 요청
      await axios.post("http://localhost:8080/api/auth/signup", formData);
      alert("회원가입이 완료되었습니다! 로그인 해주세요. 🎉");
      router.push("/sign-in");
    } catch (error) {
      alert("회원가입 실패");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white p-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <Link
          href="/sign-in"
          className="self-start text-gray-400 hover:text-white transition flex items-center gap-1 mb-2"
        >
          <ArrowLeft size={20} /> 로그인으로 돌아가기
        </Link>

        <h1 className="text-3xl font-bold text-center mb-4">회원가입</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-xs ml-1 font-bold">
              이메일
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="p-3 rounded bg-[#2A2A2A] text-white border border-gray-700 focus:outline-none focus:border-green-500 transition"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-xs ml-1 font-bold">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              className="p-3 rounded bg-[#2A2A2A] text-white border border-gray-700 focus:outline-none focus:border-green-500 transition"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-xs ml-1 font-bold">
              닉네임
            </label>
            <input
              type="text"
              name="nickname"
              placeholder="예: 코딩왕"
              value={formData.nickname}
              onChange={handleChange}
              className="p-3 rounded bg-[#2A2A2A] text-white border border-gray-700 focus:outline-none focus:border-green-500 transition"
            />
          </div>

          <button
            type="submit"
            className="bg-[#1DB954] p-3 rounded-full font-bold text-black hover:bg-[#1ed760] transition transform active:scale-95 mt-4 flex items-center justify-center gap-2"
          >
            <UserPlus size={20} /> 가입하기
          </button>
        </form>
      </div>
    </div>
  );
}
