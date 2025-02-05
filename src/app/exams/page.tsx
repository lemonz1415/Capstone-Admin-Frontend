"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Search from "@/components/search";
import Button from "@/components/button/button";
import Image from "next/image";
import ToeicImg from "../../../public/images/toeic-img.png";
import { getExamAllQuery, deleteExamQuery } from "@/query/exam.query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/modal";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default function ExamManagementPage() {
  const router = useRouter();

  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchWord, setSearchWord] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExamID, setSelectedExamID] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getExamAll = async () => {
      const exams = await getExamAllQuery(searchWord);
      setFilteredData(exams);
    };

    getExamAll();
  }, [searchWord]);

  const handleSearchChange = (searchWord: string) => {
    setSearchWord(searchWord);
  };

  const handleDeleteExam = async () => {
    if (!selectedExamID) return;

    setIsLoading(true);
    try {
      const response = await deleteExamQuery(selectedExamID);
      if (response) {
        setFilteredData(
          filteredData.filter((exam) => exam.examID !== selectedExamID)
        );
        toast.success("Exam deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred while deleting the exam.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <ToastContainer />
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isLoading && setIsModalOpen(false)}
        onConfirmFetch={handleDeleteExam}
        title="Are you sure?"
        message="Do you really want to delete these exam? This process cannot be undone."
        icon={faCircleXmark}
        iconColor="text-red-500"
        actionType="delete"
      />

      <div className="flex justify-end p-6 bg-blue-100">
        <Search onChange={handleSearchChange} />
      </div>

      <div className="flex-grow p-6">
        {filteredData.length >= 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="bg-white min-h-[400px] rounded-3xl shadow hover:shadow-md transition transform hover:scale-105 cursor-pointer p-6 flex flex-col items-center justify-center border-dashed border-2 border-gray-2"
              onClick={() => router.push("/exams/create")}
            >
              <div className="text-6xl text-gray-2 mb-4">+</div>
              <div className="text-gray-2 text-center">Create New Exam</div>
            </div>

            {filteredData.map((exam) => (
              <div
                key={exam.examID}
                className="bg-white rounded-3xl shadow hover:shadow-md transition transform hover:scale-105 cursor-pointer p-6 min-h-[400px] flex flex-col flex-grow-0"
              >
                <div
                  className="flex grow-0 justify-center items-center"
                  onClick={() =>
                    router.push(`/exams/view/select-part?examID=${exam.examID}`)
                  }
                >
                  <div className="min-w-[280px] min-h-[220px]">
                    <Image
                      src={ToeicImg}
                      alt="toeic-image"
                      width={400}
                      height={32}
                    />
                  </div>
                </div>

                <div
                  className="flex flex-col mt-4 justify-center items-center"
                  onClick={() =>
                    router.push(`/exams/view/select-part?examID=${exam.examID}`)
                  }
                >
                  <div className="body-boldL text-gray-800 mb-2 w-full truncate text-center">
                    {exam.examTitle}
                  </div>
                </div>

                <div className="flex flex-row space-x-4 mt-[50px] mb-10 justify-center">
                  <div className="w-[200px] h-[60px] z-[2]">
                    <Button
                      title="Edit Title"
                      onClick={() =>
                        router.push(`/exams/edit?examID=${exam.examID}`)
                      }
                      bgColor="bg-primary-5"
                      padding="px-4 py-1"
                      fontSize="body-boldS"
                    />
                  </div>

                  <div className="w-[200px] h-[60px] z-[2]">
                    <Button
                      title="Delete Exam"
                      onClick={() => {
                        setSelectedExamID(exam.examID);
                        setIsModalOpen(true);
                      }}
                      bgColor="bg-red-3"
                      padding="px-4 py-1"
                      fontSize="body-boldS"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No exams found.</p>
        )}
      </div>
    </div>
  );
}
