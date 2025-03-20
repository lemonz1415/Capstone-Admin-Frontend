"use client";

import { refreshAccessTokenQuery } from "@/query/auth.query";
import { fetchMe } from "@/query/user.query";
import { checkTokenValidity } from "@/util/auth";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface JwtPayload {
  email: string;
  user_id: number;
  exp: number;
  iat: number;
}

type User = {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  DOB: string;
  is_active: number;
  is_verify: number;
  permissions: string[];
};

interface AuthContextType {
  isLoggedIn: boolean;
  isFetching: boolean;
  setIsFetching: (v: boolean) => void;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  // isPermissioned: (permission: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  //----------------
  // ACTION
  //----------------

  const login = (accessToken: string, refreshToken: string) => {
    console.log("login");
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    router.push(`/auth/login`);
  };

  // VALIDATE TOKEN
  useEffect(() => {
    const checkTokens = async () => {
      console.log("check main token");
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!accessToken || !refreshToken) {
        logout();
        router.push("/auth/login");
        return;
      }

      const isTokenValid = await checkTokenValidity();
      console.log(`Is token valid: ${isTokenValid}`);

      if (!isTokenValid) {
        try {
          await refreshAccessTokenQuery(refreshToken);
          window.location.reload();
        } catch (error) {
          logout();
        }
      }
    };

    checkTokens();
  }, [logout, router]);

  //----------------
  // AUTH CONTEXT
  //----------------

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isFetching,
        setIsFetching,
        login,
        logout,
        user,
        setUser,
        // isPermissioned,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ฟังก์ชันตรวจสอบความถูกต้องของ Token
// const isTokenValid = (token: string): boolean => {
//   try {
//     // ตัด "Bearer " ออกจาก token ถ้ามี
//     const tokenValue = token.startsWith("Bearer ") ? token.slice(7) : token;

//     const payload = JSON.parse(atob(tokenValue.split(".")[1]));
//     const currentTime = Math.floor(Date.now() / 1000);
//     return payload.exp > currentTime;
//   } catch (error) {
//     console.error("Invalid token:", error);
//     return false;
//   }
// };
