import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PlayerProvider } from "@/context/PlayerContext";
import Sidebar from "@/components/Sidebar";
import BottomPlayer from "@/components/BottomPlayer";
import ChatBot from "@/components/ChatBot"; // 챗봇 임포트

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
            {/* 상단: 사이드바 + 메인 콘텐츠 */}
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />

              <main className="flex-1 bg-gradient-to-b from-[#1e1e1e] to-[#121212] overflow-y-auto p-8 pb-24">
                {/* pb-24: 하단 플레이어에 가려지지 않게 여백 확보 */}
                {children}
              </main>
            </div>

            {/* 🌟 챗봇 위치 변경: main 밖으로 빼서 화면 위에 항상 떠있게 함 */}
            <ChatBot />

            {/* 하단 플레이어 */}
            <BottomPlayer />
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
