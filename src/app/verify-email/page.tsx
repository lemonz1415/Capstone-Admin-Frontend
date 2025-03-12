"use client";

import { verifyEmailQuery } from "@/query/user.query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaRegEnvelope } from "react-icons/fa";

export default function VerifyEmailPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const onChangeOTP = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const onVerify = async () => {
    const response = await verifyEmailQuery({ email: userEmail, code: otp });

    if (response?.success) {
      toast.success("Verify success");
      setIsVerified(true);
      localStorage.setItem("isVerified", "true");
    } else {
      toast.error("Verify error");
    }
  };

  if (localStorage.getItem("isVerified") === "true") {
    router.push(`/set-password?email=${encodeURIComponent(String(userEmail))}`);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="text-blue-600 text-5xl mb-6 ml-[130px]">
          <FaRegEnvelope />
        </div>
        <h2 className="text-blue-600 text-2xl font-semibold mb-4 ml-[65px]">
          Verify Your Email
        </h2>
        {!isVerified ? (
          <p className="text-gray-700 mb-6 text-lg">
            Enter the OTP sent to your registered email address.
          </p>
        ) : (
          <p className="text-gray-700 mb-6 text-lg font-semibold text-green-600">
            Your email has been successfully verified!
          </p>
        )}

        {/* เมื่อ isVerified เป็น true จะไม่แสดง input */}
        {!isVerified ? (
          <input
            type="text"
            value={otp}
            onChange={onChangeOTP}
            className="w-full p-3 border border-gray-300 rounded-md text-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ENTER YOUR OTP"
          />
        ) : null}

        {/* หาก verified แล้ว แสดงข้อความ */}
        {isVerified ? (
          <div className="text-green-600 font-semibold text-lg text-center mt-4 p-4 border-2 border-green-500 rounded-md bg-green-100">
            Email Verified Successfully!
          </div>
        ) : (
          <button
            onClick={onVerify}
            className="w-full py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Verify
          </button>
        )}
      </div>
    </div>
  );
}
