"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Search, Heart } from "lucide-react";
import YouTubePlayer from "@/components/YouTubePlayer";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [tracks, setTracks] = useState([]);

  // 유튜브 플레이어 상태
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({ name: "", artist: "" });
  const [videoId, setVideoId] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword) return;

    try {
      // 검색은 쿠키 필요 없음 (GET)
      const response = await axios.get(
        `http://localhost:8080/api/spotify/search?q=${keyword}`
      );
      setTracks(response.data.items);
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  const handleSaveTrack = async (e, track) => {
    e.stopPropagation();

    if (!confirm(`'${track.name}' 곡을 보관함에 저장하시겠습니까?`)) return;

    try {
      const trackData = {
        trackId: track.id,
        title: track.name,
        artist: track.artists[0].name,
        albumImage: track.album.images[0].url,
        previewUrl: track.preview_url,
      };

      // 🚨 핵심 수정: localhost 사용 + withCredentials
      await axios.post("http://localhost:8080/api/library", trackData, {
        withCredentials: true,
      });

      alert("저장되었습니다! 💖");
    } catch (error) {
      // 🚨 핵심 수정: 에러가 아니라 '중복 알림'으로 처리
      const errorMsg = error.response?.data || "저장에 실패했습니다.";
      alert(errorMsg);
    }
  };

  const handlePlay = async (track) => {
    const trackName = track.name;
    const artistName = track.artists[0].name;

    try {
      const query = `${artistName} ${trackName} official audio`;
      const youtubeRes = await axios.get(
        `http://localhost:8080/api/spotify/youtube-video?query=${query}`
      );

      if (youtubeRes.data) {
        setCurrentTrack({ name: trackName, artist: artistName });
        setVideoId(youtubeRes.data);
        setIsPlayerOpen(true);
      } else {
        alert("영상을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("영상 검색 실패:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">🔍 검색하기</h1>

      <form onSubmit={handleSearch} className="mb-8 flex gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="노래 제목이나 가수를 입력하세요"
            className="w-full bg-[#242424] text-white rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-black font-bold px-6 py-3 rounded-full hover:scale-105 transition"
        >
          검색
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            onClick={() => handlePlay(track)}
            className="relative flex items-center gap-4 p-3 rounded-md cursor-pointer transition group hover:bg-[#2a2a2a]"
          >
            {/* 🚨 [수정됨] flex-shrink-0 -> shrink-0 */}
            <div className="relative w-16 h-16 shrink-0 shadow-md">
              <Image
                src={track.album.images[0].url}
                alt={track.name}
                fill
                className="object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white font-bold text-xl">
                ▶
              </div>
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <h3 className="font-bold truncate text-white group-hover:text-green-500 transition">
                {track.name}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {track.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
            <button
              onClick={(e) => handleSaveTrack(e, track)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-green-500 hover:scale-110 transition z-10"
            >
              <Heart />
            </button>
          </div>
        ))}
      </div>

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
