"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
// 🌟 Briefcase 추가 확인!
import { Home, Search, Library, User, Briefcase } from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-black p-6 hidden md:flex flex-col gap-6 border-r border-gray-800 shrink-0">
      <h1 className="text-2xl font-bold text-green-500 cursor-pointer">
        <Link href="/">Music Station</Link>
      </h1>

      <nav className="flex flex-col gap-4">
        <Link
          href="/"
          className="flex items-center gap-4 text-gray-400 hover:text-white transition font-bold"
        >
          <Home /> <span>홈</span>
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-4 text-gray-400 hover:text-white transition font-bold"
        >
          <Search /> <span>검색</span>
        </Link>
        <Link
          href="/library"
          className="flex items-center gap-4 text-gray-400 hover:text-white transition font-bold"
        >
          <Library /> <span>보관함</span>
        </Link>

        <Link
          href="/jobs"
          className="flex items-center gap-4 text-gray-400 hover:text-white transition font-bold"
        ></Link>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-800">
        <Link
          href="/profile"
          className="flex items-center gap-3 text-gray-400 hover:text-white transition group"
        >
          {user ? (
            <>
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs border border-black">
                {user.nickname.substring(0, 1)}
              </div>
              <span className="font-medium text-white truncate">
                {user.nickname}
              </span>
            </>
          ) : (
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
