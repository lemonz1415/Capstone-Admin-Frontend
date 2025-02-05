"use client";

import {
  useRouter,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeadphones,
  faBook,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/button/button";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getExamPreviewQuery } from "@/query/exam.query";

export default function SelectPart() {
  const disabledParts = [1, 2, 3, 4, 6, 7];
  const router = useRouter();
  // const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // const { examID } = params;
  const examID = searchParams.get("examID");
  const [examTitle, setExamTitle] = useState("");
  const [examParts, setExamParts] = useState<any[]>([]);
  const isViewMode = pathname.includes("/view/");

  console.log(examID);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const data = await getExamPreviewQuery(Number(examID));
        if (data && data.length > 0) {
          setExamTitle(data[0]?.examTitle);

          const groupedData = data.reduce((acc: any, item: any) => {
            const sectionIndex = acc.findIndex(
              (section: any) => section.section === item.sectionName
            );
            if (sectionIndex === -1) {
              acc.push({
                section: item.sectionName,
                parts: [
                  {
                    id: item.typeID,
                    partName: item.partName,
                    noOfQuestion: item.questionCount,
                  },
                ],
              });
            } else {
              acc[sectionIndex].parts.push({
                id: item.typeID,
                partName: item.partName,
                noOfQuestion: item.questionCount,
              });
            }
            return acc;
          }, []);

          setExamParts(groupedData);
        } else {
          toast.error("Exam not found.");
          router.push("/exams");
        }
      } catch (error) {
        console.error("Error fetching exam data:", error);
        toast.error("Error loading exam data.");
        router.push("/exams");
      }
    };

    if (examID) {
      fetchExamData();
    }
  }, [examID, router]);

  const handleCreateQuestion = (sectionName: string, partID: number) => {
    router.push(
      `/exams/create/select-part/${sectionName.toLowerCase()}?examID=${examID}&partID=${partID}`
    );
  };

  const handleViewQuestions = (sectionName: string, partID: number) => {
    router.push(
      `/exams/view/select-part/${sectionName.toLowerCase()}?examID=${examID}&partID=${partID}`
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-10">
      <div className="flex justify-between items-center px-6 py-4 bg-blue-100 shadow-md rounded-md">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 p-6 bg-primary-5 text-white flex items-center justify-center rounded-full shadow">
            <span className="body-boldL">📝</span>
          </div>
          <div className="body-boldL text-blue-900">
            Exam Title: {examTitle}
          </div>
        </div>
      </div>

      <div className="transition-all duration-700 ease-in-out mt-10 opacity-100 translate-y-0">
        {examParts.length > 0 ? (
          examParts.map((section) => (
            <div key={section.section} className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg ${
                    section.section === "Listening"
                      ? "bg-blue-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={
                      section.section === "Listening" ? faHeadphones : faBook
                    }
                    className="text-lg"
                  />
                </div>
                <div className="text-2xl font-semibold text-gray-800">
                  {section.section}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.parts.map((part: any) => {
                  const isDisabled = disabledParts.includes(part.id);
                  return (
                    <div
                      key={part.id}
                      className={`relative bg-gray-50 p-6 rounded-xl shadow ${
                        isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:shadow-md transition transform hover:scale-105 cursor-pointer"
                      } border flex flex-col justify-between`}
                    >
                      <div>
                        <div className="text-xl font-medium text-gray-900">
                          {part.partName}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center mt-2">
                          <span className="mr-2">
                            <FontAwesomeIcon
                              icon={faQuestionCircle}
                              className="text-primary-5"
                            />
                          </span>
                          <span>
                            No. of Questions:{" "}
                            <span className="font-semibold text-primary-5">
                              {part.noOfQuestion}
                            </span>
                          </span>
                        </div>
                      </div>

                      {isDisabled ? (
                        <button
                          className="mt-4 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                          disabled
                        >
                          Disabled
                        </button>
                      ) : (
                        <>
                          {part.noOfQuestion === 0 ? (
                            // หากไม่มีคำถาม ให้แสดงปุ่ม Create (สำหรับ view และ create mode)
                            <button
                              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                              onClick={() =>
                                handleCreateQuestion(section.section, part.id)
                              }
                            >
                              Create Questions
                            </button>
                          ) : (
                            // หากมีคำถาม ให้แสดงปุ่ม View และ Create More
                            <>
                              <button
                                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                onClick={() =>
                                  handleViewQuestions(section.section, part.id)
                                }
                              >
                                View Questions
                              </button>
                              <button
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={() =>
                                  handleCreateQuestion(section.section, part.id)
                                }
                              >
                                Create More
                              </button>
                            </>
                          )}
                        </>
                      )}

                      <div className="absolute top-4 right-4">
                        <FontAwesomeIcon
                          icon={
                            section.section === "Listening"
                              ? faHeadphones
                              : faBook
                          }
                          className={`text-5xl opacity-10 ${
                            section.section === "Listening"
                              ? "text-blue-500"
                              : "text-red-500"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No exam parts available.
          </div>
        )}
      </div>

      <div className="mt-6 h-[50px] w-full self-center">
        <Button
          title="Back to Exam Management"
          onClick={() => router.push("/exams")}
          bgColor="bg-primary-5"
          fontSize="body-boldM"
        />
      </div>
    </div>
  );
}
