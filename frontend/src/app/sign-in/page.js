"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthForm from "@/components/AuthForm"; // 👈 컴포넌트 불러오기

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-10 text-white">로딩 중...</div>}>
      <SignInContent />
    </Suspense>
  );
}

function SignInContent() {
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState(null);

  // URL에 '?error'가 있으면 에러 메시지 설정
  useEffect(() => {
    if (searchParams.get("error") !== null) {
      setErrorMsg(
        "로그인에 실패했습니다. 아이디를 확인하거나 회원가입 해주세요."
      );
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] p-4">
      {/* 에러 메시지를 props로 전달! */}
      <AuthForm errorMsg={errorMsg} />
    </div>
  );
}
