"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Plus, CheckCircle2, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // 만약 로그인이 안 되어 있다면 로그인 페이지로 보냄
  if (!user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-white animate-in fade-in duration-500">
      {/* 타이틀 */}
      <h1 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight">
        누구의 음악인가요?
      </h1>

      {/* 프로필 리스트 컨테이너 */}
      <div className="flex flex-wrap justify-center gap-8">
        {/* 1. 현재 로그인된 내 프로필 (선택됨) */}
        <Link href="/profile">
          <div className="group flex flex-col items-center gap-4 cursor-pointer">
            {/* 프로필 이미지 박스 */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-md bg-purple-600 flex items-center justify-center text-5xl font-bold text-white shadow-lg group-hover:ring-4 ring-white transition relative overflow-hidden">
              {user.nickname.substring(0, 1)}
              {/* 로그인 중 표시 뱃지 */}
              <div className="absolute top-2 right-2">
                <CheckCircle2
                  className="text-green-400 bg-black rounded-full"
                  size={24}
                />
              </div>
              {/* 호버 시 딤드 효과 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
            </div>
            {/* 이름 */}
            <span className="text-gray-400 group-hover:text-white text-lg md:text-xl font-medium transition">
              {user.nickname}
            </span>
          </div>
        </Link>

        {/* 2. 계정 추가 버튼 (+) */}
        <Link href="/sign-in">
          <div className="group flex flex-col items-center gap-4 cursor-pointer">
            {/* 플러스 아이콘 박스 */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-md bg-[#181818] border-2 border-gray-600 flex items-center justify-center text-gray-400 shadow-lg group-hover:bg-white group-hover:text-black group-hover:border-transparent transition">
              <Plus size={64} />
            </div>
            {/* 텍스트 */}
            <span className="text-gray-400 group-hover:text-white text-lg md:text-xl font-medium transition">
              계정 추가
            </span>
          </div>
        </Link>
      </div>

      {/* 하단 관리 버튼 (장식용) */}
      <button className="mt-16 px-8 py-2 border border-gray-500 text-gray-500 text-sm tracking-widest uppercase hover:border-white hover:text-white transition">
        프로필 관리
      </button>
    </div>
  );
}
