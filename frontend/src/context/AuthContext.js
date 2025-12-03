"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. 앱 켜질 때 로그인 상태 확인
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const config = {
        withCredentials: true, // 쿠키(세션) 포함
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };

      // 🚨 [수정] localhost로 요청
      const response = await axios.get(
        "http://localhost:8080/api/user/me",
        config
      );

      setUser(response.data);
      console.log("로그인 확인 완료:", response.data.nickname);
    } catch (error) {
      console.log("비로그인 상태");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 2. 소셜 로그인 토큰 처리
  const loginWithToken = (token) => {
    localStorage.setItem("accessToken", token);
    checkLoginStatus();
    router.push("/profile");
  };

  // 3. 로그아웃
  const logout = async () => {
    try {
      // 🚨 [수정] localhost로 요청
      await axios.post("http://localhost:8080/api/auth/logout");
    } catch (e) {
      console.error(e);
    }

    localStorage.removeItem("accessToken");
    setUser(null);
    router.push("/profile");
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
