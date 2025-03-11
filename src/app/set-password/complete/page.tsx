"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function SetPasswordCompletePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
          Create New Password Complete!
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Your password has been successfully updated. You can now use your new
          password to log in.
        </p>
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-lg hover:bg-blue-700 transition duration-200"
          onClick={() => router.push("/login")}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
