// app/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginQuery } from "@/query/auth.query";
import { useAuth } from "@/contexts/auth.context";

const Login = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const onLogin = async () => {
    try {
      const data = await loginQuery({ email, password });

      const { accessToken, refreshToken } = data;

      login(accessToken, refreshToken);

      router.push("/questions");
    } catch (err) {
      setError(
        "Login failed. Please check your credentials or try again later."
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left section (illustration) */}
      <div className="flex-1 flex justify-center items-center bg-blue-600">
        <img
          src="/images/illustration.png" // ใส่ path ของภาพในโปรเจ็กต์ของคุณ
          alt="Illustration"
          className="w-3/4 max-w-sm"
        />
      </div>

      {/* Right section (login form) */}
      <div className="flex-1 flex justify-center items-center bg-white p-8">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Hello!</h1>
          <p className="text-gray-600 mb-8">Sign Up to Get Started</p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="mb-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <button
            onClick={onLogin}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            Login
          </button>

          <a
            href="#"
            className="block text-center text-blue-600 mt-4 hover:underline"
          >
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
