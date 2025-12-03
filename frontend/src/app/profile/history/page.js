"use client";
import { ArrowLeft, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft /> 돌아가기
      </button>

      <div className="flex items-center gap-3 mb-8">
        <Clock size={32} className="text-green-500" />
        <h1 className="text-3xl font-bold">최근 감상 목록</h1>
      </div>

      {/* 임시 UI (나중에 DB 연동) */}
      <div className="text-center py-20 bg-[#181818] rounded-xl">
        <p className="text-gray-400 text-lg">아직 감상 기록이 없습니다.</p>
        <p className="text-sm text-gray-600 mt-2">
          음악을 재생하면 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}
