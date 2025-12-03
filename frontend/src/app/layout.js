import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PlayerProvider } from "@/context/PlayerContext"; // 👈 추가
import Sidebar from "@/components/Sidebar";
import BottomPlayer from "@/components/BottomPlayer"; // 👈 추가

export const metadata = {
  title: "Music Station",
  description: "My Music Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="flex h-screen flex-col bg-black text-white">
        <AuthProvider>
          <PlayerProvider>
            {" "}
            {/* 👈 AuthProvider 안에 PlayerProvider 추가 */}
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] overflow-y-auto p-8 pb-24">
                {/* pb-24: 하단 플레이어 가리지 않게 여백 추가 */}
                {children}
              </main>
            </div>
            {/* 🌟 여기에 진짜 플레이어 장착! */}
            <BottomPlayer />
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
