"use client";

import { setPasswordQuery } from "@/query/user.query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // เพิ่มไอคอน

export default function SetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordNotMatch, setIsPasswordNotMatch] = useState("");
  const [regexError, setRegexError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // state สำหรับเปิด/ปิดการแสดง password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // state สำหรับเปิด/ปิดการแสดง confirm password

  const checkPasswordCriteria = (password: string) => {
    return {
      lengthValid: password.length >= 8,
      containsNumber: /\d/.test(password),
      containsLowercase: /[a-z]/.test(password),
      containsUppercase: /[A-Z]/.test(password),
      containsSpecialChar: /[!@#$%^&*(),.?":{}|<>_]/.test(password),
    };
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordInput = e.target.value;
    setPassword(passwordInput);
  };

  const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //check criteria all cases
    const criteria = checkPasswordCriteria(password);
    if (
      !criteria.lengthValid &&
      !criteria.containsNumber &&
      !criteria.containsUppercase &&
      !criteria.containsLowercase &&
      !criteria.containsSpecialChar
    ) {
      setRegexError(true);
      return;
    } else {
      setRegexError(false);
    }

    //check match
    if (password !== confirmPassword) {
      setIsPasswordNotMatch("Passwords must be identical");
      return;
    } else {
      setIsPasswordNotMatch("");
    }

    if (!isPasswordNotMatch && !regexError) {
      const response = await setPasswordQuery({
        email: userEmail,
        password: password,
      });

      if (!response?.success) {
        toast.error(`error: ${response?.message}`);
        return;
      }
      localStorage.setItem("SetPassword", "true");
      router.push("/set-password/complete");
    }
  };

  const passwordCriteria = checkPasswordCriteria(password);

  if (localStorage.getItem("SetPassword") === "true") {
    router.push("/set-password/complete");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-right" />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
          Create new password
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your new password below to complete the reset process
        </p>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-lg text-gray-700">
              Password<span className="text-red-500"> *</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // เปลี่ยน type ของ input
                value={password}
                onChange={onPasswordChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span
                className="absolute right-3 top-5 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)} // toggle การแสดง password
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-lg text-gray-700">
              Confirm password<span className="text-red-500"> *</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"} // เปลี่ยน type ของ input
                value={confirmPassword}
                onChange={onConfirmPasswordChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span
                className="absolute right-3 top-5 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // toggle การแสดง confirm password
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {isPasswordNotMatch && (
              <p className="text-red-500 text-sm mt-1">Password not match!!!</p>
            )}
          </div>

          {/* Checklist for password criteria */}
          <div className="text-sm text-gray-700 mb-4">
            <ul>
              <li
                className={`${
                  passwordCriteria.lengthValid
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {passwordCriteria.lengthValid ? "✔" : "-"} At least 8 characters
              </li>
              <li
                className={`${
                  passwordCriteria.containsNumber
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {passwordCriteria.containsNumber ? "✔" : "-"} Must contain a
                number
              </li>
              <li
                className={`${
                  passwordCriteria.containsLowercase
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {passwordCriteria.containsLowercase ? "✔" : "-"} Must contain a
                lowercase letter
              </li>
              <li
                className={`${
                  passwordCriteria.containsUppercase
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {passwordCriteria.containsUppercase ? "✔" : "-"} Must contain an
                uppercase letter
              </li>
              <li
                className={`${
                  passwordCriteria.containsSpecialChar
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {passwordCriteria.containsSpecialChar ? "✔" : "-"} Must contain
                a special character
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
}
