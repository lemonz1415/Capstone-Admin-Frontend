// app/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginQuery } from "@/query/auth.query";
import { useAuth } from "@/contexts/auth.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import loginBackground from "../../../../public/images/login-bg.jpg";
import Image from "next/image";

const Background = () => (
  <div className="absolute inset-0 w-full h-full">
    <Image
      src={loginBackground}
      alt="Heading Background"
      fill
      style={{ objectFit: "cover" }}
    />
  </div>
);

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
    <div className="flex min-h-screen justify-center items-center text-white p-20">
      {/* Left section (illustration) */}
      <Background />
      <div className="flex-[2] flex flex-col justify-center items-center text-white p-16 relative z-10">
        <h2 className="text-6xl font-extrabold mb-4 shadow-lg border-b pb-4">
          <span className="text-[#005CC4]">Welcome to</span> <br /> Management
          System
        </h2>
        <p className="text-lg text-blue-200 text-center max-w-lg mb-4 shadow-md">
          Sign in to Manage Your Account and Questions.
        </p>
      </div>

      {/* Right section (login form) */}
      <div className="flex-1 flex justify-center items-center bg-[#003BA7] bg-opacity-90 rounded-xl p-12 max-w-[460px] shadow-xl relative z-10">
        <div className="w-full space-y-6">
          <h1 className="text-3xl font-semibold text-white text-center">
            Log In
          </h1>
          <p className="text-sm text-blue-200 text-center">
            Enter your email and password to access your account.
          </p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="flex items-center border border-white rounded-lg shadow-sm p-3 focus-within:ring focus-within:ring-blue-500">
            <FontAwesomeIcon icon={faEnvelope} className="text-white mr-3" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full focus:outline-none bg-transparent text-white"
            />
          </div>

          <div className="flex items-center border border-white rounded-lg shadow-sm p-3 focus-within:ring focus-within:ring-blue-500">
            <FontAwesomeIcon icon={faKey} className="text-white mr-3" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full focus:outline-none bg-transparent text-white"
            />
          </div>

          <button
            onClick={onLogin}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-600 transition-all"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
