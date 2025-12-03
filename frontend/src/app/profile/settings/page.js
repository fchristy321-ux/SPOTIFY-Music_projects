"use client";
import { ArrowLeft, ShieldCheck, Bell, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const MenuRow = ({ icon, title, desc }) => (
    <div className="flex items-center gap-4 p-4 hover:bg-[#222] rounded-lg cursor-pointer transition">
      <div className="text-gray-400">{icon}</div>
      <div>
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-white">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft /> 돌아가기
      </button>

      <h1 className="text-3xl font-bold mb-8">설정</h1>

      <div className="bg-[#181818] rounded-xl p-2">
        <MenuRow
          icon={<Bell />}
          title="알림 설정"
          desc="푸시 알림 및 이메일 수신 여부"
        />
        <MenuRow
          icon={<ShieldCheck />}
          title="개인정보 및 보안"
          desc="비밀번호 변경 및 계정 보안"
        />
        <MenuRow
          icon={<Smartphone />}
          title="기기 관리"
          desc="로그인된 기기 목록 확인"
        />
      </div>
    </div>
  );
}
