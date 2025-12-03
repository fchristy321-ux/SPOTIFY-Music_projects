"use client";

import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";
import {
  LogOut,
  User,
  Heart,
  UserPen,
  Settings,
  Plus,
  Clock,
} from "lucide-react";

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

      {/* === 바로가기 카드 === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <Link href="/library">
          <div className="bg-[#181818] p-5 rounded-xl flex items-center gap-4 hover:bg-[#222] transition cursor-pointer border border-transparent hover:border-green-500/30">
            <div className="p-3 bg-pink-500/20 rounded-full text-pink-500">
              <Heart size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-bold text-lg">좋아요 표시한 곡</h3>
            </div>
          </div>
        </Link>
        <Link href="/profile/edit">
          <div className="bg-[#181818] p-5 rounded-xl flex items-center gap-4 hover:bg-[#222] transition cursor-pointer border border-transparent hover:border-blue-500/30">
            <div className="p-3 bg-blue-500/20 rounded-full text-blue-500">
              <UserPen size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">프로필 수정</h3>
            </div>
          </div>
        </Link>
      </div>

      <div className="h-px bg-gray-800 my-8"></div>

      {/* === 메뉴 리스트 === */}
      <div className="flex flex-col gap-6 text-lg font-medium px-2">
        {/* 🚨 [수정됨] 계정 추가 버튼 -> 프로필 선택 화면으로 이동 */}
        <Link
          href="/profile/accounts"
          className="flex items-center gap-5 hover:text-gray-300 transition cursor-pointer"
        >
          <Plus size={24} className="text-gray-400" />
          <span>계정 추가 (Add account)</span>
        </Link>

        <Link
          href="/profile/history"
          className="flex items-center gap-5 hover:text-gray-300 transition cursor-pointer"
        >
          <Clock size={24} className="text-gray-400" />
          <span>최근 감상 목록</span>
        </Link>

        <Link
          href="/profile/settings"
          className="flex items-center gap-5 hover:text-gray-300 transition cursor-pointer"
        >
          <Settings size={24} className="text-gray-400" />
          <span>설정 및 개인정보</span>
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
