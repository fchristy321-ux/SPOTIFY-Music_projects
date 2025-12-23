"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Trash2, PlayCircle } from "lucide-react";
import YouTubePlayer from "@/components/YouTubePlayer";

export default function LibraryPage() {
  const [myTracks, setMyTracks] = useState([]);

  // 유튜브 플레이어 상태
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({ name: "", artist: "" });
  const [videoId, setVideoId] = useState(null);

  // 보관함 목록 불러오기
  const fetchLibrary = async () => {
    try {
      // 🌟 localhost:8080 API 호출
      const response = await axios.get("http://localhost:8080/api/library", {
        withCredentials: true,
      });
      setMyTracks(response.data);
    } catch (error) {
      console.error("보관함 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  // 삭제 기능
  const handleDelete = async (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/library/${id}`, {
        withCredentials: true,
      });
      fetchLibrary(); // 목록 갱신
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  // 재생 기능
  const handlePlay = async (track) => {
    try {
      const query = `${track.artist} ${track.title} official audio`;
      const youtubeRes = await axios.get(
        `http://localhost:8080/api/spotify/youtube-video?query=${query}`
      );

      if (youtubeRes.data) {
        setCurrentTrack({ name: track.title, artist: track.artist });
        setVideoId(youtubeRes.data);
        setIsPlayerOpen(true);
      } else {
        alert("영상을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("재생 실패:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">💖 좋아요 표시한 곡</h1>

      {myTracks.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">
          아직 저장된 노래가 없습니다. 검색해서 하트를 눌러보세요!
        </p>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-[50px_1fr_1fr_100px] gap-4 text-gray-400 text-sm border-b border-gray-800 pb-2 px-4">
            <span>#</span>
            <span>제목</span>
            <span>가수</span>
            <span className="text-center">관리</span>
          </div>

          {myTracks.map((track, index) => (
            <div
              key={track.id}
              className="grid grid-cols-[50px_1fr_1fr_100px] gap-4 items-center hover:bg-[#2a2a2a] p-3 rounded-md group transition"
            >
              <div className="text-gray-400 group-hover:hidden">
                {index + 1}
              </div>
              <button
                onClick={() => handlePlay(track)}
                className="hidden group-hover:block text-white hover:text-green-500"
              >
                <PlayCircle size={20} />
              </button>

              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10 shrink-0">
                  <Image
                    src={track.albumImage || "/default-album.png"} // 이미지가 없을 때 대비
                    alt={track.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <span className="font-bold text-white truncate">
                  {track.title}
                </span>
              </div>

              <div className="text-gray-400 truncate">{track.artist}</div>

              <div className="text-center">
                <button
                  onClick={() => handleDelete(track.id)}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <YouTubePlayer
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        trackName={currentTrack.name}
        artist={currentTrack.artist}
        videoId={videoId}
      />
    </div>
  );
}
