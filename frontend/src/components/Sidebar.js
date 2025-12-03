"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Home, Search, Library, User } from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth(); // 로그인 정보 확인

  return (
    <aside className="w-64 bg-black p-6 hidden md:flex flex-col gap-6 border-r border-gray-800 shrink-0">
      {/* 🌟 로고 영역 */}
      <h1 className="text-2xl font-bold text-green-500 cursor-pointer">
        <Link href="/">Music Station</Link>
      </h1>

      {/* 🌟 메뉴 네비게이션 */}
      <nav className="flex flex-col gap-4">
        <Link
          href="/"
          className="flex items-center gap-4 text-gray-400 hover:text-white transition font-bold"
        >
          <Home /> 홈
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-4 text-gray-400 hover:text-white transition font-bold"
        >
          <Search /> 검색
        </Link>
        <Link
          href="/library"
          className="flex items-center gap-4 text-gray-400 hover:text-white transition font-bold"
        >
          <Library /> 보관함
        </Link>
      </nav>

      {/* 하단 프로필 영역 (로그인 상태에 따라 바뀜) */}
      <div className="mt-auto pt-4 border-t border-gray-800">
        <Link
          href="/profile"
          className="flex items-center gap-3 text-gray-400 hover:text-white transition group"
        >
          {user ? (
            // 로그인 했을 때: 내 프로필
            <>
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs border border-black">
                {user.nickname.substring(0, 1)}
              </div>
              <span className="font-medium text-white truncate">
                {user.nickname}
              </span>
            </>
          ) : (
            // 로그인 안 했을 때: 기본 아이콘
            <>
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <User size={18} />
              </div>
              <span className="font-medium">마이페이지</span>
            </>
          )}
        </Link>
      </div>
    </aside>
  );
}
