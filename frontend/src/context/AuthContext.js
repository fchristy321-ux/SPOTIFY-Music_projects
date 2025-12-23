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

  // 2. 내 정보 가져오기 (통합 함수)
  const checkLoginStatus = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const config = {
        withCredentials: true, // 쿠키(일반 로그인) 포함
        headers: token ? { Authorization: `Bearer ${token}` } : {}, // 토큰(소셜) 포함
      };

      // 🚨 주소 통일: localhost
      const response = await axios.get(
        "http://localhost:8080/api/user/me",
        config
      );

      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 3. 일반 로그인 성공 시
  const manualLogin = async () => {
    await checkLoginStatus();
    router.push("/profile");
  };

  // 4. 소셜 로그인 성공 시
  const loginWithToken = (token) => {
    localStorage.setItem("accessToken", token);
    checkLoginStatus();
    router.push("/profile");
  };

  // 5. 로그아웃
  const logout = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/logout");
    } catch (e) {
      console.error(e);
    }

    localStorage.removeItem("accessToken");
    setUser(null);
    router.push("/profile");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithToken, manualLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
