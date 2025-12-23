"use client";

import { usePlayer } from "@/context/PlayerContext";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronDown,
  Maximize2,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function BottomPlayer() {
  const {
    currentTrack,
    isPlaying,
    isExpanded,
    setIsPlaying,
    togglePlay,
    toggleExpand,
  } = usePlayer();

  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  useEffect(() => {
    if (!currentTrack?.videoId) return;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(initPlayer, 100);
        return;
      }

      if (playerRef.current) {
        playerRef.current.loadVideoById(currentTrack.videoId);
        if (isPlaying) playerRef.current.playVideo();
        return;
      }

      playerRef.current = new window.YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId: currentTrack.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            setIsPlayerReady(true);
            event.target.playVideo();
            setIsPlaying(true);
          },
          onStateChange: (event) => {
            if (event.data === 0) setIsPlaying(false);
            if (event.data === 2) setIsPlaying(false);
            if (event.data === 1) setIsPlaying(true);
          },
        },
      });
    };

    initPlayer();
  }, [currentTrack?.videoId]);

  useEffect(() => {
    if (playerRef.current && isPlayerReady && playerRef.current.playVideo) {
      if (isPlaying) {
        if (playerRef.current.getPlayerState() !== 1) {
          playerRef.current.playVideo();
        }
      } else {
        if (playerRef.current.getPlayerState() === 1) {
          playerRef.current.pauseVideo();
        }
      }
    }
  }, [isPlaying, isPlayerReady]);

  if (!currentTrack) return null;

  return (
    <>
      {/* ==========================================
          1. 확장된 플레이어 화면
         ========================================== */}
      <div
        // 🚨 [수정됨] z-[100] -> z-100, translate-y-[100%] -> translate-y-full
        className={`fixed inset-0 z-100 bg-black transition-all duration-500 ease-in-out flex flex-col ${
          isExpanded
            ? "translate-y-0 opacity-100 visible"
            : "translate-y-full opacity-0 invisible"
        }`}
      >
        <button
          onClick={toggleExpand}
          // 🚨 [수정됨] z-[110] -> z-110
          className="absolute top-6 left-6 text-white z-110 p-2 bg-black/50 rounded-full hover:bg-white/20 transition"
        >
          <ChevronDown size={32} />
        </button>

        <div className="flex-1 flex items-center justify-center bg-black relative w-full h-full">
          {currentTrack.albumImage && (
            <div className="absolute inset-0 opacity-40 blur-3xl z-0">
              <Image
                src={currentTrack.albumImage}
                alt="background"
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="relative w-full max-w-5xl aspect-video shadow-2xl z-10 bg-black rounded-xl overflow-hidden pointer-events-none">
            <div id="youtube-player" className="w-full h-full"></div>
          </div>
        </div>

        {/* 🚨 [수정됨] bg-gradient-to-t -> bg-linear-to-t, z-[110] -> z-110 */}
        <div className="h-40 bg-linear-to-t from-black via-black/90 to-transparent flex flex-col items-center justify-center gap-6 pb-10 z-110">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-1">
              {currentTrack.title}
            </h2>
            <p className="text-gray-400 text-lg">{currentTrack.artist}</p>
          </div>
          <div className="flex items-center gap-10">
            <SkipBack
              size={36}
              className="text-gray-400 cursor-pointer hover:text-white transition"
            />
            <button
              onClick={togglePlay}
              className="bg-white text-black rounded-full p-5 hover:scale-105 transition flex items-center justify-center shadow-lg"
            >
              {isPlaying ? (
                <Pause size={36} fill="black" />
              ) : (
                <Play size={36} fill="black" className="ml-1" />
              )}
            </button>
            <SkipForward
              size={36}
              className="text-gray-400 cursor-pointer hover:text-white transition"
            />
          </div>
        </div>
      </div>

      {/* ==========================================
          2. 하단 미니 플레이어 (고정바)
         ========================================== */}
      <div
        className="fixed bottom-0 left-0 right-0 h-24 bg-[#181818] border-t border-gray-800 flex items-center justify-between px-6 z-50 cursor-pointer hover:bg-[#222] transition-colors"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-4 w-1/3">
          <div className="relative w-14 h-14 rounded overflow-hidden shadow-md bg-gray-800">
            {currentTrack.albumImage && (
              <Image
                src={currentTrack.albumImage}
                alt="album"
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-white font-bold truncate text-sm md:text-base">
              {currentTrack.title}
            </span>
            <span className="text-gray-400 text-xs truncate">
              {currentTrack.artist}
            </span>
          </div>
        </div>

        <div
          className="flex gap-4 md:gap-6 items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <SkipBack
            size={24}
            className="text-gray-400 hover:text-white cursor-pointer transition"
          />
          <button
            onClick={togglePlay}
            className="bg-white rounded-full p-2 hover:scale-105 transition flex items-center justify-center shadow-sm"
          >
            {isPlaying ? (
              <Pause size={20} fill="black" />
            ) : (
              <Play size={20} fill="black" className="ml-0.5" />
            )}
          </button>
          <SkipForward
            size={24}
            className="text-gray-400 hover:text-white cursor-pointer transition"
          />
        </div>

        <div className="w-1/3 flex justify-end">
          <Maximize2
            size={20}
            className="text-gray-400 hover:text-white transition"
          />
        </div>
      </div>
    </>
  );
}
