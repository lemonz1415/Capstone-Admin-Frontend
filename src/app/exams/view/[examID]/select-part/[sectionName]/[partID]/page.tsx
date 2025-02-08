"use client";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faAngleDoubleLeft,
  faFileCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getQuestionsByExamIDAndTypeIDQuery } from "@/query/old-question.query";
import parse from "html-react-parser";

// ฟังก์ชัน Shuffle Array
const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export default function ViewExam() {
  const router = useRouter();
  const params = useParams();

  const examID = Number(params?.examID);
  const partID = Number(params?.partID);
  const sectionName = params?.sectionName;

  const [data, setData] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const getQuestionsData = async () => {
      const response = await getQuestionsByExamIDAndTypeIDQuery(examID, partID);
      const shuffledQuestions = shuffleArray(response || []);
      setData(shuffledQuestions);
    };

    getQuestionsData();
  }, [examID, partID]);

  const currentQuestion: {
    partName: string;
    instruction: string;
    questionTexts: string;
    choiceA: string;
    choiceB: string;
    choiceC: string;
    choiceD: string;
    answer: string;
  } = data[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < data.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const progressPercentage =
    data.length > 0 ? ((currentQuestionIndex + 1) / data.length) * 100 : 0;

  return (
    <div className="flex flex-col h-screen p-6 bg-gradient-to-r from-gray-100 to-blue-200">
      <div className="mb-6 text-center flex justify-start items-start">
        <button
          onClick={() => router.push(`/exams/view/${examID}/select-part`)}
          className=" text-grey-500 py-2 px-4 rounded-md font-bold hover:bg-gray-200 transition-all"
        >
          <FontAwesomeIcon icon={faAngleDoubleLeft} className="mr-2" />
          Back to Select Part
        </button>
      </div>
      {data.length > 0 ? (
        currentQuestion ? (
          <>
            <div className="w-full max-w-3xl mx-auto mb-4">
              <div className="w-full bg-gray-200 h-4 rounded-lg overflow-hidden">
                <div
                  className="bg-blue-500 h-4 rounded-lg transition-all duration-500 ease-in-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-right text-gray-700 text-sm mt-1">
                {currentQuestionIndex + 1} of {data.length} questions
              </div>
            </div>

            <div className="flex flex-col w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
              <div className="text-xl font-semibold text-gray-700">
                {currentQuestion.partName}
              </div>
              <div className="text-gray-600 italic">
                {currentQuestion.instruction}
              </div>
              <div className="text-lg font-medium text-gray-800">
                {parse(currentQuestion?.questionTexts)}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {["A", "B", "C", "D"].map((letter) => {
                  const choice =
                    currentQuestion[
                      `choice${letter}` as keyof typeof currentQuestion
                    ];
                  const isCorrect = letter === currentQuestion.answer;

                  return (
                    <div
                      key={letter}
                      className={`p-4 text-left font-semibold rounded-lg transition-all ${
                        isCorrect
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {letter}. {choice}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center items-center gap-8 max-w-3xl mx-auto mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  currentQuestionIndex === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === data.length - 1}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  currentQuestionIndex === data.length - 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-teal-500 text-white hover:bg-teal-600"
                }`}
              >
                Next
                <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
              </button>
            </div>

            <div className="text-center flex justify-center items-center gap-6 max-w-3xl mx-auto mt-6">
              <button
                onClick={() =>
                  router.push(
                    `/exams/edit/${examID}/select-part/${sectionName}/${partID}`
                  )
                }
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-600 transition-all"
              >
                Edit
              </button>
              {currentQuestionIndex === data.length - 1 ? (
                <button
                  className="bg-green-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-600 transition-all"
                  onClick={() =>
                    router.push(
                      `/exams/create/${examID}/select-part/${sectionName}/${partID}?from=view`
                    )
                  }
                >
                  Add more questions
                </button>
              ) : (
                ""
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-600 text-lg font-medium">
              Loading questions...
            </p>
          </div>
        )
      ) : (
        <div className="flex flex-col justify-center items-center h-full space-y-6">
          <FontAwesomeIcon
            icon={faFileCirclePlus}
            className="w-[250px] h-[250px] text-blue-600 pl-16"
          />
          <p className="text-gray-500 text-lg font-medium text-center">
            No questions available in this part. Would you like to add some?
          </p>
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-all"
            onClick={() =>
              router.push(
                `/exams/create/${examID}/select-part/${sectionName}/${partID}?from=view`
              )
            }
          >
            Create Questions
          </button>
        </div>
      )}
    </div>
  );
}
