"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/button/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/modal";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { createExamQuery, getExamByTitleQuery } from "@/query/exam.query";

export default function CreateExamPage() {
  const router = useRouter();
  const [examTitle, setExamTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmTitle = async () => {
    if (!examTitle.trim()) {
      return;
    }

    try {
      const exams = await getExamByTitleQuery({ examTitle: examTitle.trim() });

      //validate
      if (exams.length > 0) {
        const errorMessage =
          "This title is already in use. Please choose a different title.";
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      } else if (examTitle?.trim().length > 30) {
        const errorMessage = "The exam title must be 30 characters or less.";
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      setIsModalOpen(true);
    } catch (error) {
      const errorMessage =
        "An error occurred while checking the exam title. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleConfirmModal = async () => {
    setIsLoading(true);
    try {
      const examData = { examTitle };
      const response = await createExamQuery(examData);

      if (response) {
        toast.success("Exam title confirmed!", {
          position: "top-right",
          autoClose: 1600,
        });
        const examID = response.examID;

        setTimeout(() => {
          router.push(`/exams/create/select-part?examID=${examID}`);
        }, 2000);
      } else {
        throw new Error("Failed to create exam.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleConfirmTitle();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-10">
      <ToastContainer />
      <Modal
        onClose={() => !isLoading && setIsModalOpen(false)}
        isOpen={isModalOpen}
        onConfirmFetch={handleConfirmModal}
        title="Confirm Exam Title"
        message={`Are you sure you want to use the exam title "${examTitle}"?`}
        icon={faCircleQuestion}
        iconColor="text-blue-500"
      />
      <div className="bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-primary-5 text-white flex items-center justify-center rounded-full mr-4 shadow">
            <span className="font-bold text-2xl">📝</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Exam Title</h2>
        </div>
        <div className="text-gray-600 mb-4">
          Give your exam a name that reflects its purpose. This title will
          appear in your exam list.
        </div>
        <input
          id="examTitle"
          type="text"
          placeholder="e.g., TOEIC Listening Practice Test"
          value={examTitle}
          onChange={(e) => {
            setExamTitle(e.target.value);
            setError(null);
          }}
          disabled={isLoading}
          onKeyDown={handleKeyPress}
          ref={inputRef}
          className={`w-full p-4 border rounded-lg shadow-sm focus:outline-none text-gray-800 text-lg ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-primary-5 focus:border-primary-5"
          }`}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <div className="mt-4 flex justify-end">
          <Button
            title="Back"
            onClick={() => router.push("/exams")}
            bgColor="bg-gray-3"
            fontSize="body-boldM"
            disabled={isLoading}
          />
          <Button
            title="Confirm"
            onClick={handleConfirmTitle}
            bgColor="bg-primary-5"
            fontSize="body-boldM"
            disabled={isLoading || !examTitle.trim()}
          />
        </div>
      </div>
    </div>
  );
}
