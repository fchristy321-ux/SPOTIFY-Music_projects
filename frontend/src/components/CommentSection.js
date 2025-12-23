"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { MessageSquare, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// 🌟 날짜 포맷팅 함수 (한국 시간 형식)
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);

  // 예: "2025. 12. 23. 오후 02:30" 형식으로 변환
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // 오전/오후 표시
  });
};

export default function CommentSection({ albumId = "guestbook" }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // 댓글 불러오기
  const fetchComments = async () => {
    if (!albumId) return;

    try {
      // 백엔드에서 댓글 목록 가져오기 (시간 순 정렬됨)
      const res = await axios.get(`/api/comments/${albumId}`);
      setComments(res.data);
    } catch (err) {
      console.error("댓글 로딩 실패:", err);
    }
  };

  // 앨범 ID가 바뀌면 댓글 다시 불러오기
  useEffect(() => {
    fetchComments();
  }, [albumId]);

  // 댓글 등록하기
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!user) return alert("로그인이 필요합니다.");

    setIsProcessing(true);

    try {
      await axios.post("/api/comments", {
        albumId: albumId,
        content: input,
        author: user.nickname,
      });

      setInput(""); // 입력창 비우기
      await fetchComments(); // 목록 갱신
    } catch (err) {
      // 클린봇이나 서버 에러 메시지 표시
      alert(err.response?.data || "댓글 등록 실패");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#181818] p-6 rounded-xl border border-gray-800">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <MessageSquare /> AI 클린봇 방명록 ({comments.length})
      </h3>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isProcessing ? "AI 검사 중..." : "댓글을 입력하세요..."}
          disabled={!user || isProcessing}
          className="flex-1 bg-[#2a2a2a] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!user || isProcessing}
          className="bg-green-500 text-black p-3 rounded-lg hover:bg-green-400 disabled:opacity-50 transition"
        >
          {isProcessing ? "⏳" : <Send size={20} />}
        </button>
      </form>

      {/* 댓글 목록 */}
      <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            첫 번째 댓글을 남겨보세요!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-700 pb-3 last:border-0"
            >
              <div className="flex justify-between mb-1 items-end">
                <span className="font-bold text-green-400">
                  {comment.author}
                </span>

                {/* 🌟 날짜 표시 부분 수정됨 */}
                <span className="text-xs text-gray-500">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-300 break-words">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
