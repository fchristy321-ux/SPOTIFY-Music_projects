"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // 로그인 정보 가져오기
import { Home, Search, Library, User } from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth(); // 전역 상태에서 유저 정보 꺼냄

  return (
    <aside className="w-64 bg-[#121212] p-6 hidden md:flex flex-col gap-4 border-r border-gray-800">
      <h1 className="text-2xl font-bold text-green-500 mb-6">Music Station</h1>

      <nav className="flex flex-col gap-4">
        <Link
          href="/"
          className="flex items-center gap-4 text-gray-400 hover:text-white transition"
        >
          <Home /> <span className="font-medium">홈</span>
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-4 text-gray-400 hover:text-white transition"
        >
          <Search /> <span className="font-medium">검색</span>
        </Link>
        <Link
          href="/library"
          className="flex items-center gap-4 text-gray-400 hover:text-white transition"
        >
          <Library /> <span className="font-medium">보관함</span>
        </Link>
      </nav>

      {/* 🌟 여기가 핵심! 로그인 여부에 따라 바뀌는 부분 */}
      <div className="mt-auto pt-4 border-t border-gray-800">
        <Link
          href="/profile"
          className="flex items-center gap-4 text-gray-400 hover:text-white transition group"
        >
          {user ? (
            // ✅ 로그인 했을 때: 내 프로필 보여주기
            <>
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {user.nickname.substring(0, 1)}
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">
                  {user.nickname}
                </span>
                <span className="text-xs text-green-500">내 정보 보기</span>
              </div>
            </>
          ) : (
            // ❌ 로그인 안 했을 때: 기본 아이콘
            <>
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <User size={18} className="text-gray-400" />
              </div>
              <span className="font-medium">마이페이지</span>
            </>
          )}
        </Link>
      </div>
    </aside>
  );
}
