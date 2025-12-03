"use client";

import { X } from "lucide-react";

export default function YouTubePlayer({
  isOpen,
  onClose,
  trackName,
  artist,
  videoId,
}) {
  // 열리지 않았거나 ID가 없으면 아무것도 안 그림
  if (!isOpen || !videoId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-[#181818] rounded-xl shadow-2xl w-full max-w-3xl relative border border-gray-800 overflow-hidden">
        {/* 헤더바 */}
        <div className="flex justify-between items-center p-4 bg-black/60">
          <h2 className="text-white text-lg font-bold truncate pr-4 flex items-center gap-2">
            🎵 <span className="text-green-500">{trackName}</span> - {artist}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={28} />
          </button>
        </div>

        {/* 플레이어 영역 (순수 iframe 사용 - 에러 없음) */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            width="100%"
            height="100%"
            // 🚀 autoplay=1: 자동 재생
            // 🚀 origin=http://localhost:3000: 보안 정책 준수
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&origin=http://localhost:3000`}
            title="YouTube music player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
