"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmFetch: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: IconDefinition;
  iconColor?: string;
  actionType?: "delete" | "default";
}

export default function Modal({
  isOpen,
  onClose,
  onConfirmFetch,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon = faCircleXmark,
  iconColor = "text-red-500",
  actionType = "default",
}: ModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirmFetch();
      //   toast.success("Action completed successfully!", {
      //     position: "top-right",
      //     autoClose: 3000,
      //   });
    } catch (error: any) {
      //   toast.error("An error occurred. Please try again.", {
      //     position: "top-right",
      //     autoClose: 3000,
      //   });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-[90%] max-w-xl shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <FontAwesomeIcon icon={icon} className={`text-6xl ${iconColor}`} />
        </div>

        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        <p className="text-gray-400 mb-10">{message}</p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-8 py-2 bg-gray-300 rounded-md text-gray-800 hover:bg-gray-400"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-8 py-2 ${
              isLoading
                ? actionType === "delete"
                  ? "bg-red-300"
                  : "bg-blue-300"
                : actionType === "delete"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white rounded-md`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
