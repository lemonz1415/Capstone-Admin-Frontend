"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TinyMCEEditor from "./TinyMCEEditor";
import Modal from "@/components/modal";
import {
  faCircleQuestion,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  createQuestionQuery,
  getQuestionsByExamIDAndTypeIDQuery,
  editQuestionQuery,
  getSkillAllQuery,
  deleteQuestionQuery,
} from "@/query/question.query";
import { getExamPreviewQuery } from "@/query/exam.query";
import classNames from "classnames";

export default function QuestionForm({
  examID,
  partID,
  mode = "create",
}: {
  examID: number;
  partID: number;
  mode?: "create" | "edit";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [sectionName, setSectionName] = useState("");
  const [partName, setPartName] = useState("");
  const [skillID, setSkillID] = useState<number | "">("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [questionTexts, setQuestionTexts] = useState("");
  const [choices, setChoices] = useState({
    choiceA: "",
    choiceB: "",
    choiceC: "",
    choiceD: "",
  });
  const [answer, setAnswer] = useState("");
  const [questionID, setquestionID] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isNavigateModalOpen, setIsNavigateModalOpen] = useState(false);
  const [isNextModalOpen, setIsNextModalOpen] = useState(false);
  const [isPreviousModalOpen, setIsPreviousModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [skills, setSkills] = useState<
    { skillID: number; skillName: string }[]
  >([]);

  const [questionTextErr, setQuestionTextErr] = useState("");

  const [originalData, setOriginalData] = useState({
    skillID: "",
    questionTexts: "",
    choices: {
      choiceA: "",
      choiceB: "",
      choiceC: "",
      choiceD: "",
    },
    answer: "",
  });

  //util
  const isFieldEmpty = (fields: any) => {
    return Object.values(fields).some((field) => !field);
  };

  const isDataChanged =
    skillID !== originalData.skillID ||
    questionTexts !== originalData.questionTexts ||
    Object.values(choices).some(
      (v, index) => v !== Object.values(originalData.choices)[index]
    ) ||
    answer !== originalData.answer;

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const fetchedSkills = await getSkillAllQuery();
        setSkills(fetchedSkills);
      } catch (error) {
        toast.error("Failed to load skills.");
      }
    };

    fetchSkills();
  }, []);

  const fetchExamPreview = async () => {
    try {
      const previewData = await getExamPreviewQuery(examID);
      const partData = previewData.find((part: any) => part.typeID === partID);
      if (partData) {
        setSectionName(partData.sectionName);
        setPartName(partData.partName);
        const count = previewData.filter(
          (part: any) => part.typeID === partID
        ).length;
      } else {
        toast.error("Part not found in exam preview.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching exam preview.");
    }
  };

  const fetchExistingQuestion = async () => {
    try {
      const questionData = await getQuestionsByExamIDAndTypeIDQuery(
        examID,
        partID
      );
      if (questionData) {
        setQuestions(questionData);
        setQuestionCount(questionData.length);
      } else {
        toast.error("Question not found.");
        router.push("/exams");
      }
    } catch (error) {
      toast.error("An error occurred while fetching exam data.");
    } finally {
      setIsLoading(false);
    }
  };

  const getEditData = () => {
    if (mode === "edit" && questions.length > 0) {
      //data in edit
      const currentQuestion = questions[questionIndex];
      setQuestionTexts(currentQuestion?.questionTexts);
      setChoices({
        choiceA: currentQuestion?.choiceA,
        choiceB: currentQuestion?.choiceB,
        choiceC: currentQuestion?.choiceC,
        choiceD: currentQuestion?.choiceD,
      });
      setAnswer(currentQuestion?.answer);
      setquestionID(currentQuestion?.questionID);
      setSkillID(currentQuestion?.skillID);

      //data in check
      setOriginalData({
        skillID: currentQuestion?.skillID,
        questionTexts: currentQuestion?.questionTexts,
        choices: {
          choiceA: currentQuestion?.choiceA,
          choiceB: currentQuestion?.choiceB,
          choiceC: currentQuestion?.choiceC,
          choiceD: currentQuestion?.choiceD,
        },
        answer: currentQuestion?.answer,
      });
    }
  };

  useEffect(() => {
    fetchExamPreview();
    fetchExistingQuestion();
  }, [examID, partID, mode]);

  useEffect(() => {
    getEditData();
  }, [questions, questionIndex, mode]);

  const isFormValid = () => {
    const pattern = /<[^>]+>|&[^;]+;/g;
    const questionTextsCheck =
      questionTexts?.replace(pattern, "").trim() && isDataChanged;

    const choicesCheck = [
      choices?.choiceA,
      choices?.choiceB,
      choices?.choiceC,
      choices?.choiceD,
      answer,
    ].every((choice) => choice?.trim());

    return Boolean(
      skillID && questionTextsCheck && choicesCheck && isDataChanged
    );
  };

  const handlePrevious = async () => {
    if (questionIndex > 0) {
      if (isDataChanged) {
        setIsPreviousModalOpen(true);
      } else {
        await setQuestionIndex(questionIndex - 1);
        setIsSubmitted(false);
        // clearForm();
      }
    }
  };

  const handleNext = async () => {
    if (questionIndex < questionCount - 1) {
      if (isDataChanged) {
        setIsNextModalOpen(true);
      } else {
        await setQuestionIndex(questionIndex + 1);
        setIsSubmitted(false);
        // clearForm();
      }
    }
  };

  const clearForm = () => {
    setSkillID("");
    setQuestionTexts("");
    setChoices({
      choiceA: "",
      choiceB: "",
      choiceC: "",
      choiceD: "",
    });
    setAnswer("");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setIsLoading(true);

    const payload = {
      examID,
      typeID: partID,
      skillID,
      questionTexts,
      choiceA: choices.choiceA,
      choiceB: choices.choiceB,
      choiceC: choices.choiceC,
      choiceD: choices.choiceD,
      answer,
    };

    if (isFieldEmpty(payload)) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    try {
      let response;

      if (mode === "edit" && questionID) {
        const editPayload = { ...payload, questionID };
        response = await editQuestionQuery(editPayload as any);
      } else {
        response = await createQuestionQuery(payload as any);
      }

      // if (mode === "edit") {
      //   response = await createQuestionQuery(payload as any);
      // } else {
      //   response = await createQuestionQuery(payload as any);
      // }

      if (response?.success) {
        toast.success(
          `Question ${mode === "create" ? "created" : "updated"} successfully!`
        );

        if (mode === "create") {
          clearForm();
        }

        //refetch
        fetchExistingQuestion();

        setIsSubmitted(true);
      } else {
        throw new Error("Failed to submit question.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
      setIsSubmitModalOpen(false);
    }
  };

  const handleNavigation = () => {
    if (isDataChanged && isNavigateModalOpen === false) {
      return setIsNavigateModalOpen(true);
    }

    if (mode === "edit") {
      router.push(
        `/exams/view/select-part/${sectionName.toLowerCase()}?examID=${examID}&partID=${partID}`
      );
    } else {
      if (from === "view" && mode === "create") {
        router.push(
          `/exams/view/select-part/${sectionName.toLowerCase()}?examID=${examID}&partID=${partID}`
        );
      } else {
        router.push(`/exams/create/select-part?examID=${examID}`);
      }
    }
    setIsNavigateModalOpen(false);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await deleteQuestionQuery(questionID);
      //refetch
      await fetchExistingQuestion();

      const questionData = await getQuestionsByExamIDAndTypeIDQuery(
        examID,
        partID
      );

      if (response?.success && questionData?.length > 0) {
        toast.success("Question deleted successfully.");
        if (questionIndex > 0) {
          setQuestionIndex(questionIndex - 1);
        }
      } else if (response?.success && questionData?.length === 0) {
        router.push(`/exams/view/select-part?examID=${examID}`);
      } else {
        toast.error("Failed to delete the question.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the question.");
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  console.log(questionTexts?.length);
  return (
    <div className="bg-white shadow-md rounded-lg p-8 space-y-6">
      <ToastContainer />
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => !isLoading && setIsSubmitModalOpen(false)}
        onConfirmFetch={handleSubmit}
        title="Confirm Submission"
        message="Are you sure you want to submit this question?"
        icon={faCircleQuestion}
        iconColor="text-blue-500"
        confirmText="Submit"
        cancelText="Cancel"
      />
      <Modal
        isOpen={isNavigateModalOpen}
        onClose={() => !isLoading && setIsNavigateModalOpen(false)}
        onConfirmFetch={handleNavigation}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave this page?"
        icon={faCircleQuestion}
        iconColor="text-blue-500"
        confirmText="Yes"
        cancelText="No"
      />
      <Modal
        isOpen={isNextModalOpen}
        onClose={() => setIsNextModalOpen(false)}
        onConfirmFetch={async () => {
          setIsNextModalOpen(false);
          await setQuestionIndex(questionIndex + 1);
          setIsSubmitted(false);
        }}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to navigate away from this page?"
        icon={faCircleQuestion}
        iconColor="text-blue-500"
        confirmText="Yes"
        cancelText="No"
      />
      <Modal
        isOpen={isPreviousModalOpen}
        onClose={() => {
          setIsPreviousModalOpen(false);
        }}
        onConfirmFetch={async () => {
          setIsPreviousModalOpen(false);
          await setQuestionIndex(questionIndex - 1);
          setIsSubmitted(false);
        }}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to navigate away from this page?"
        icon={faCircleQuestion}
        iconColor="text-blue-500"
        confirmText="Yes"
        cancelText="No"
      />
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmFetch={handleDeleteQuestion}
        title="Confirm Deletion"
        message="Are you sure you want to delete this question?"
        icon={faCircleXmark}
        actionType="delete"
        iconColor="text-red-500"
        confirmText="Delete"
        cancelText="Cancel"
      />

      <h2 className="text-xl font-semibold">
        {sectionName} - {partName}
      </h2>

      {mode === "edit" ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Question {questionIndex + 1} / {questionCount}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{
                width: `${((questionIndex + 1) / questionCount) * 100}%`,
              }}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Question Count: {questionCount}
            </span>
          </div>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsSubmitModalOpen(true);
        }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Skill
          </label>
          <select
            value={skillID}
            onChange={(e) => setSkillID(Number(e.target.value))}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          >
            <option value="">Select a Skill</option>
            {skills.map((skill) => (
              <option key={skill.skillID} value={skill.skillID}>
                {skill.skillName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Text
          </label>
          <TinyMCEEditor
            value={questionTexts}
            onChange={(content) => {
              setQuestionTexts(content);
            }}
          />
        </div>

        {["A", "B", "C", "D"].map((choice) => (
          <div key={choice} className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Choice {choice}
            </label>
            <input
              type="text"
              value={choices[`choice${choice}` as keyof typeof choices]}
              onChange={(e) =>
                setChoices({ ...choices, [`choice${choice}`]: e.target.value })
              }
              placeholder={`Enter Choice ${choice}`}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              disabled={isLoading}
            />
          </div>
        ))}

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Correct Answer
          </label>
          <select
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          >
            <option value="">Select the correct answer</option>
            {["A", "B", "C", "D"].map((choice) => (
              <option key={choice} value={choice}>
                {choice}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 flex justify-between mt-4">
          <button
            type="button"
            onClick={handleNavigation}
            className={`bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {mode === "edit" || from === "view"
              ? "Back to View Question"
              : "Back to Select Part"}
          </button>

          <div className="flex space-x-4">
            {mode === "edit" && (
              <>
                <button
                  type="button"
                  onClick={() => handlePrevious()}
                  className={`bg-blue-500 text-white px-4 py-2 rounded ${
                    isLoading || questionIndex === 0
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isLoading || questionIndex === 0}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => handleNext()}
                  className={classNames(
                    "bg-blue-500 text-white px-4 py-2 rounded",
                    {
                      "bg-gray-400 text-gray-600 cursor-not-allowed":
                        isLoading || questionIndex === questionCount - 1,
                    }
                  )}
                  disabled={isLoading || questionIndex === questionCount - 1}
                >
                  Next
                </button>
              </>
            )}

            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className={`px-4 py-2 rounded-md ${
                !isFormValid() || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isLoading
                ? "Submitting..."
                : mode === "create"
                ? "Submit"
                : "Save Changes"}
            </button>
          </div>
        </div>
        {mode === "edit" && (
          <div className="col-span-2 mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleOpenDeleteModal}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              disabled={questionCount === 0}
            >
              Delete Question
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
