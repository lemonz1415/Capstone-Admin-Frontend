"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "@/components/button/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/modal";
import { getExamPreviewQuery, editExamQuery } from "@/query/exam.query";

export default function EditExamPage() {
  const router = useRouter();
  const params = useParams();
  const { examID } = params;

  const [examTitle, setExamTitle] = useState("");
  const [initialTitle, setInitialTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const examData = await getExamPreviewQuery(Number(examID));
        if (examData) {
          setExamTitle(examData[0].examTitle);
          setInitialTitle(examData[0].examTitle);
        } else {
          toast.error("Exam not found.");
          router.push("/exams");
        }
      } catch (error) {
        toast.error("An error occurred while fetching exam data.");
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [examID, router]);

  const handleSave = async () => {
    if (examTitle?.trim() === initialTitle) {
      return;
    }

    if (examTitle.trim() === "") {
      setError("Exam title cannot be empty.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirmModal = async () => {
    try {
      setIsSaving(true);
      await editExamQuery({
        examID: Number(examID),
        examTitle: examTitle.trim(),
      });

      toast.success("Exam title updated successfully!", {
        position: "top-right",
        autoClose: 1000,
      });

      setTimeout(() => router.push("/exams"), 1000);
    } catch (err) {
      console.error("Error updating title:", err);
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const isConfirmDisabled = examTitle.trim() === "" || examTitle.trim() === initialTitle || isSaving;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-10">
      <ToastContainer />
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSaving && setIsModalOpen(false)}
        onConfirmFetch={handleConfirmModal}
        title="Confirm Exam Title"
        message={`Are you sure you want to update the exam title to "${examTitle}"?`}
        icon={faCircleQuestion}
        iconColor="text-blue-500"
        confirmText="Confirm"
        cancelText="Cancel"
      />
      <div className="bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-primary-5 text-white flex items-center justify-center rounded-full mr-4 shadow">
            <span className="font-bold text-2xl">📝</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Edit Exam Title
          </h2>
        </div>
        <div className="text-gray-600 mb-4">
          Update the exam title. Make sure it is unique and reflects the purpose
          of the exam.
        </div>
        <input
          id="examTitle"
          type="text"
          placeholder="e.g., TOEIC Listening Practice Test"
          value={examTitle}
          disabled={isSaving}
          onChange={(e) => {
            setExamTitle(e.target.value);
            setError(null);
          }}
          className={`w-full p-4 border rounded-lg shadow-sm focus:outline-none text-gray-800 text-lg ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-primary-5 focus:border-primary-5"
          }`}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <div className="mt-4 flex justify-end space-x-4">
          <Button
            title="Back"
            onClick={() => router.push("/exams")}
            bgColor="bg-gray-3"
            fontSize="body-boldM"
            disabled={isSaving}
          />
          <Button
            title="Confirm"
            onClick={handleSave}
            bgColor="bg-primary-5"
            fontSize="body-boldM"
            disabled={isConfirmDisabled}
          />
        </div>
      </div>
    </div>
  );
}
