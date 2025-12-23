"use client";

import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";
import { Heart, UserPen, Plus } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  // 비로그인 상태
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] p-4">
        <AuthForm />
      </div>
    );
  }

  // 로그인 상태
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-white">
      {/* === 프로필 헤더 === */}
      <div className="bg-[#181818] p-8 rounded-2xl flex items-center gap-6 shadow-lg mb-8">
        <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-inner shrink-0">
          {user.nickname.substring(0, 1)}
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-1">{user.nickname}</h2>
          <p className="text-gray-400 text-sm mb-3">{user.email}</p>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/50">
            {user.provider || "Email"} 계정
          </span>
        </div>
      </div>

      {/* === 바로가기 카드 (여기가 핵심!) === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {/* 1. 좋아요 표시한 곡 (클릭 시 /library 이동) */}
        <Link href="/library" className="block group">
          <div className="bg-[#181818] p-5 rounded-xl flex items-center gap-4 transition cursor-pointer border border-transparent group-hover:bg-[#222] group-hover:border-green-500/30">
            <div className="p-3 bg-pink-500/20 rounded-full text-pink-500">
              <Heart size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">좋아요 표시한 곡</h3>
              <p className="text-xs text-gray-500 mt-1">내가 찜한 노래 모음</p>
            </div>
          </div>
        </Link>

        {/* 2. 프로필 수정 */}
        <Link href="/profile/edit" className="block group">
          <div className="bg-[#181818] p-5 rounded-xl flex items-center gap-4 transition cursor-pointer border border-transparent group-hover:bg-[#222] group-hover:border-blue-500/30">
            <div className="p-3 bg-blue-500/20 rounded-full text-blue-500">
              <UserPen size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">프로필 수정</h3>
              <p className="text-xs text-gray-500 mt-1">닉네임 변경하기</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="h-px bg-gray-800 my-8"></div>

      {/* === 메뉴 리스트 === */}
      <div className="flex flex-col gap-6 text-lg font-medium px-2">
        <Link
          href="/profile/accounts"
          className="flex items-center gap-5 hover:text-gray-300 transition cursor-pointer"
        >
          <Plus size={24} className="text-gray-400" />
          <span>계정 추가 (Add account)</span>
        </Link>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-800 text-center">
        <button
          onClick={logout}
          className="px-8 py-3 rounded-full border border-gray-600 text-white font-bold hover:bg-white hover:text-black transition"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
