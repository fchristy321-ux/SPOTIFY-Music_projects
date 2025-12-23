"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import CommentSection from "@/components/CommentSection";

export default function Home() {
  const [albums, setAlbums] = useState([]);
  const { playTrack } = usePlayer();

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const response = await axios.get("/api/spotify/new-releases");
        setAlbums(response.data.items);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };
    fetchNewReleases();
  }, []);

  const handleAlbumClick = async (album) => {
    try {
      const response = await axios.get(`/api/spotify/album/${album.id}/tracks`);
      const tracks = response.data.items;
      if (tracks.length === 0) return;

      const firstTrack = tracks[0];
      const artistName = firstTrack.artists[0].name;
      const trackName = firstTrack.name;

      const query = `${artistName} ${trackName} official audio`;
      const youtubeRes = await axios.get(
        `/api/spotify/youtube-video?query=${query}`
      );

      if (youtubeRes.data) {
        playTrack({
          title: trackName,
          artist: artistName,
          albumImage: album.images[0].url,
          videoId: youtubeRes.data,
        });
      } else {
        alert("재생할 수 없는 곡입니다.");
      }
    } catch (error) {
      console.error("재생 실패:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🔥 최신 발매 앨범</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {albums.map((album) => (
          <div
            key={album.id}
            onClick={() => handleAlbumClick(album)}
            className="bg-[#181818] p-4 rounded-lg transition cursor-pointer group hover:bg-[#282828]"
          >
            <div className="relative w-full aspect-square mb-4 shadow-lg">
              <Image
                src={album.images[0].url}
                alt={album.name}
                fill
                className="object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white font-bold text-3xl">
                ▶
              </div>
            </div>
            <h3 className="font-bold truncate text-white mb-1">{album.name}</h3>
            <p className="text-sm text-gray-400 truncate">
              {album.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-20 border-t border-gray-800 pt-10 mb-20">
        <h2 className="text-2xl font-bold mb-4 text-green-500">
          💬 Music Station 방명록
        </h2>
        <p className="text-gray-400 mb-6">
          자유롭게 의견을 남겨주세요. (클린봇이 욕설을 필터링합니다)
        </p>
        <CommentSection albumId="guestbook" />
      </div>
    </div>
  );
}
