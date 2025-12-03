"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [nickname, setNickname] = useState(user?.nickname || "");

  const handleUpdate = (e) => {
    e.preventDefault();
    alert(`닉네임이 '${nickname}'(으)로 변경되었습니다! (DB 연동 필요)`);
    // 여기에 나중에 백엔드 API 호출 코드 넣으면 됨
    router.push("/profile");
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 text-white">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8"
      >
        <ArrowLeft /> 돌아가기
      </button>

      <h1 className="text-3xl font-bold mb-8">프로필 수정</h1>

      <form onSubmit={handleUpdate} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            이메일 (변경 불가)
          </label>
          <input
            type="text"
            value={user?.email || ""}
            disabled
            className="w-full p-4 rounded bg-[#222] text-gray-500 border border-gray-700 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-4 rounded bg-[#2A2A2A] text-white border border-gray-700 focus:border-green-500 outline-none"
          />
        </div>
        <button className="bg-white text-black font-bold py-4 rounded-full hover:scale-105 transition">
          저장하기
        </button>
      </form>
    </div>
  );
}
