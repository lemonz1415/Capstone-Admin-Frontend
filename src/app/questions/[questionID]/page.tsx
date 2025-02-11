"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaCheck,
  FaArrowLeft,
} from "react-icons/fa";
import {
  enableDisableQuestionQuery,
  getQuestionByIDQuery,
} from "@/query/question.query";

export default function Preview() {
  const router = useRouter();

  const { questionID } = useParams();

  const [question, setQuestion] = useState<{
    question_id: string;
    question: string;
    skill: { skill_id: number; skill_name: string };
    options: { option_id: number; option_text: string; is_correct: number }[];
    is_available: number;
    is_report: number;
  }>();

  const [isDisabled, setIsDisabled] = useState<boolean>();

  useEffect(() => {
    const getQuestionByID = async () => {
      const question = await getQuestionByIDQuery(Number(questionID));
      setQuestion(question);
      setIsDisabled(question?.is_available);
    };

    getQuestionByID();
  }, []);

  const [isEditMode, setIsEditMode] = useState(false);

  const numberToLetter = (num: any) => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    return letters[num];
  };

  const toggleDisable = () => {
    setIsDisabled(!isDisabled);
    enableDisableQuestionQuery({ question_id: 1 });
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <>
      {question && (
        <div className="flex justify-center items-center min-h-screen ">
          <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all hover:scale-105 duration-300 ease-in-out">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              <span className="underline">Question:</span>&nbsp;
              {question?.question}
            </p>

            <p className="text-[15px] font-semibold text-gray-400 mb-4 italic">
              Skill: {question?.skill?.skill_name}
            </p>

            <h2 className="font-semibold text-xl text-gray-700 mb-4">
              Options:
            </h2>
            <ul className="list-inside mb-6 space-y-4">
              {question?.options.map((option, index) => (
                <li
                  key={option.option_id}
                  className={`py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out ${
                    option.is_correct
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-800"
                  } hover:bg-indigo-200 cursor-pointer`}
                >
                  <div className="flex items-center">
                    <span className="mr-2 font-medium">
                      {numberToLetter(index)}.
                    </span>
                    <span className="flex items-center">
                      {option.option_text}
                      {option.is_correct ? (
                        <FaCheck className="ml-2 text-green-600" />
                      ) : (
                        <div></div>
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center mb-4 mt-6">
              <div className="flex space-x-4">
                <button
                  className="text-2xl text-gray-600 hover:text-indigo-600 transition duration-200"
                  onClick={() => router.push(`/questions`)}
                >
                  <FaArrowLeft />
                </button>
              </div>

              <div className="flex space-x-4 ml-auto">
                {/* ใช้ ml-auto เพื่อจัดตำแหน่งขวาสุด */}
                <button
                  onClick={toggleDisable}
                  className="text-2xl text-gray-600 hover:text-indigo-600 transition duration-200"
                >
                  {Boolean(isDisabled) ? <FaEye /> : <FaEyeSlash />}
                </button>
                <button
                  onClick={toggleEditMode}
                  className="text-2xl text-gray-600 hover:text-indigo-600 transition duration-200"
                >
                  <FaEdit />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
