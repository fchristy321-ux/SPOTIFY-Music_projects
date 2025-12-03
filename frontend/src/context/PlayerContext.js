"use client";

import { createContext, useContext, useState } from "react";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  // 1. 현재 재생 중인 트랙 정보
  const [currentTrack, setCurrentTrack] = useState(null);
  // 2. 재생/일시정지 상태
  const [isPlaying, setIsPlaying] = useState(false);
  // 3. 플레이어 확장 여부 (위로 펼치기)
  const [isExpanded, setIsExpanded] = useState(false);

  // 음악 재생 함수
  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setIsExpanded(true); // 재생 시 자동으로 펼치기 (원치 않으면 false)
  };

  // 일시정지/재생 토글
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // 플레이어 접었다 펴기
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isExpanded,
        setIsPlaying, // 플레이어 내부에서 상태 변경용
        setIsExpanded,
        playTrack,
        togglePlay,
        toggleExpand,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
