"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  // 초기값: user가 있으면 user.nickname, 없으면(로딩 중이면) 빈 문자열 ""
  const [nickname, setNickname] = useState(user?.nickname || "");

  const handleUpdate = (e) => {
    e.preventDefault(); // 폼 제출 시 새로고침 방지

    // (임시) 알림창 띄우기
    alert(`닉네임이 '${nickname}'(으)로 변경되었습니다! (DB 연동 필요)`);
    // 실제로는 여기서 axios.put('/api/user', { nickname }) 같은 요청을 보냄

    // 수정 끝나면 프로필 화면으로 이동
    router.push("/profile");
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 text-white">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => router.back()} // 브라우저의 '뒤로가기'와 똑같은 기능
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8"
      >
        <ArrowLeft /> 돌아가기
      </button>

      <h1 className="text-3xl font-bold mb-8">프로필 수정</h1>

      {/* 폼 시작 */}
      <form onSubmit={handleUpdate} className="flex flex-col gap-6">
        {/* 이메일 입력칸 (수정 불가) */}
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

        {/* 닉네임 입력칸 (수정 가능) */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-4 rounded bg-[#2A2A2A] text-white border border-gray-700 focus:border-green-500 outline-none"
          />
        </div>

        {/* 저장 버튼 */}
        <button className="bg-white text-black font-bold py-4 rounded-full hover:scale-105 transition">
          저장하기
        </button>
      </form>
    </div>
  );
}
