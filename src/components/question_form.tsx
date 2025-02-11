"use client";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import TiptapEditor from "@/components/TiptapEditor";
import toast, { Toaster } from "react-hot-toast";
import Modal from "@/components/modal";
import { IoChevronBack } from "react-icons/io5";
import { createQuestionQuery, getQuestionsByIDQuery, editQuestionQuery } from "@/query/question.query";
import { createOptionQuery } from "@/query/option.query";
import { getAllSkillQuery } from "@/query/skill.query";

interface QuestionFormProps {
  mode: "create" | "update";
  questionID?: string; // สำหรับ update mode
}
interface Skill {
  skill_id: number;
  skill_name: string;
}
interface QuestionOption {
  option_text: string;
  is_correct: boolean;
}
interface NewQuestionData {
  skill_id: number | null;
  user_id: number | null;
  image_id: number | null;
  question_text: string;
}

const MAX_OPTION_LENGTH = 200; // กำหนด max length ของ option
export default function QuestionForm({ mode, questionID }: QuestionFormProps) {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillId, setSkillId] = useState<number | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<QuestionOption[]>([
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [pendingNavigation, setPendingNavigation] = useState("");

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const [initialFormData, setInitialFormData] = useState<{
    skill_id: number | null;
    question_text: string;
    options: QuestionOption[];
  } | null>(null);

  // fetch data สำหรับ update mode
  useEffect(() => {
    const fetchInitialData = async () => {
      if (mode === "update" && questionID) {
        setIsInitialLoading(true);
        try {
          const response = await getQuestionsByIDQuery(questionID);
          if (response && response.question) {
            const initialData = {
                skill_id: response.skill.skill_id,
                question_text: response.question,
                options: response.options.map((opt: any) => ({
                  option_text: opt.option_text,
                  is_correct: opt.is_correct === 1
                }))
              };
              setInitialFormData(initialData); // เก็บข้อมูลเดิม

            // Set initial data
            setSkillId(response.skill.skill_id);
            setQuestionText(response.question);
            setOptions(response.options.map((opt: any) => ({
              option_text: opt.option_text,
              is_correct: opt.is_correct === 1
            })));
          } else {
            toast.error("Failed to load question data");
            router.push("/questions");
          }
        } catch (error) {
          console.error("Error fetching question:", error);
          toast.error("Error loading question data");
          router.push("/questions");
        } finally {
          setIsInitialLoading(false);
        }
      }
    };
  
    fetchInitialData();
  }, [mode, questionID, router]);

  useEffect(() => {
    const getAllSkill = async () => {
      const response = await getAllSkillQuery();
      if (response) {
        setSkills(response);
      }
    };
    getAllSkill();
  }, []);

  const handleClearForm = () => {
    setIsClearModalOpen(true);
  };


  const resetForm = () => {
    setSkillId(null);
    setQuestionText("");
    setOptions([
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
    ]);
  };

  const confirmClearForm = () => {
    resetForm();
    setIsClearModalOpen(false);
    toast.success("Form cleared successfully");
  };

  const isFormChanges = useCallback(() => {
    // ตรวจสอบว่ามีการเปลี่ยนแปลงและมีข้อมูลจริงๆ
    const hasSkillChange = skillId !== null;

    // ตรวจสอบว่า questionText มีเนื้อหาจริงๆ
    const hasQuestionChange = questionText.trim() !== "";

    // ตรวจสอบว่ามี option ที่มีข้อความหรือถูกเลือกจริงๆ
    const hasOptionsChange = options.some(
      (option) => option.option_text.trim() !== "" || option.is_correct
    );

    return hasSkillChange || hasQuestionChange || hasOptionsChange;
  }, [skillId, questionText, options]);

  const isDataUpdate = useCallback(() => {
    if (!initialFormData || mode !== "update") return false;
    
    const isSkillChanged = skillId !== initialFormData.skill_id;
    const isQuestionChanged = questionText !== initialFormData.question_text;
    const isOptionsChanged = JSON.stringify(options) !== JSON.stringify(initialFormData.options);
    
    return isSkillChanged || isQuestionChanged || isOptionsChanged;
  }, [initialFormData, skillId, questionText, options, mode]);

  // ฟังก์ชันจัดการการ navigate
  const handleNavigation = (path: string) => {
    if (mode === "create") {
        // สำหรับ create mode ใช้ isFormChanges()
        if (isFormChanges()) {
          setPendingNavigation(path);
          setIsModalOpen(true);
        } else {
          router.push(path);
        }
      } else {
        // สำหรับ update mode ใช้ isDataUpdate()
        if (isDataUpdate()) {
          setPendingNavigation(path);
          setIsModalOpen(true);
        } else {
          router.push(path);
        }
      }
    };

  // ฟังก์ชัน validate form
  const isFormValid = useCallback(() => {
    const hasSkill = skillId !== null;
    const hasQuestionText = questionText.trim() !== "";
    const allOptionsHaveText = options.every(
      (option) => option.option_text.trim() !== ""
    );
    const hasCorrectAnswer = options.some((option) => option.is_correct);

    return (
      hasSkill && hasQuestionText && allOptionsHaveText && hasCorrectAnswer
    );
  }, [skillId, questionText, options]);

  const onSelectSkill = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "") {
      setSkillId(null);
      return;
    }
    const selectedSkillId = parseInt(value);
    setSkillId(selectedSkillId);
  };

  const onEditorChange = (content: string) => {
    // ลบ HTML tags และ trim whitespace
    const plainText = content.replace(/<[^>]*>/g, "").trim();

    // ถ้าไม่มีข้อความเหลืออยู่เลย ให้เซ็ตเป็นค่าว่าง
    if (plainText === "") {
      setQuestionText("");
    } else {
      // ถ้ามีข้อความ ให้เก็บค่า HTML ตามปกติ
      if (content !== questionText) {
        setQuestionText(content);
      }
    }
  };

  const handleOptionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newOptions = [...options];
    newOptions[index].option_text = e.target.value;
    setOptions(newOptions);
  };

  const onSelectAnswer = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newOptions = [...options];
    newOptions.forEach((option) => {
      option.is_correct = false;
    });
    newOptions[index].is_correct = e.target.checked;
    setOptions(newOptions);
  };

  // ฟังก์ชันสำหรับสลับลำดับตัวเลือก
  const handleMoveOption = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= options.length) return;

    const newOptions = [...options];
    const temp = newOptions[fromIndex];
    newOptions[fromIndex] = newOptions[toIndex];
    newOptions[toIndex] = temp;
    setOptions(newOptions);
  };

  // ฟังก์ชันสำหรับเพิ่มตัวเลือก
  const handleAddOption = () => {
    setOptions([...options, { option_text: "", is_correct: false }]);
  };

  // ฟังก์ชันสำหรับลบตัวเลือก
  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      toast.error("Minimum 2 options required");
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  // ฟังก์ชัน submit
  const handleFormSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    if (!isFormValid()) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    setIsLoading(true);

    const data: NewQuestionData = {
        skill_id: skillId,
        image_id: null,
        user_id: null,
        question_text: questionText,
      };

    try {
      if (mode === "create") {
        console.log("based data", data)
        const responseQuestion = await createQuestionQuery(data);
        console.log("create response", responseQuestion)
        // if (!responseQuestion?.question_id) {
        //     throw new Error("Failed to create question: No question ID returned");
        //   }

        const insertOption = options.map((opt) => ({
          ...opt,
          question_id: responseQuestion?.question_id,
        }));
        console.log("option data", insertOption)
        const responseOption = await createOptionQuery(insertOption);
        console.log("option create response", responseOption)
        if (responseQuestion?.success && responseOption?.success) {
          toast.success("Question created successfully.");

          // Clear form after successful submission
          resetForm();
          setIsPreviewModalOpen(false); // ปิด modal preview หลังจากสร้างสำเร็จ
          router.push("/questions");
        }
      }
      else {
        // ส่งข้อมูลทั้ง question และ options ไป
        const updateData = {
          question_id: parseInt(questionID!),
          skill_id: skillId,
          image_id: null,
          user_id: null,
          question_text: questionText,
          options: options.map(opt => ({
            option_text: opt.option_text,
            is_correct: opt.is_correct 
          }))
        };
        try {
          const response = await editQuestionQuery(updateData);
          if (response?.success) {
            toast.success("Question updated successfully.");
            router.push("/questions");
          } else {
            toast.error(response?.message || "Failed to update question.");
          }
        } catch (error) {
          console.error("Error updating question:", error);
          toast.error("An error occurred while updating the question.");
        }
      }
      
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the question.");
    } finally {
      setIsLoading(false);
    }
  };

    if (isInitialLoading) {
     return (
       <div className="flex items-center justify-center min-h-screen">
         <div className="text-gray-600">Loading question data...</div>
       </div>
     );
   }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <Toaster position="top-right" />
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirmFetch={() => {
          router.push(pendingNavigation);
          setIsModalOpen(false);
        }}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost."
        confirmText="Leave Page"
        cancelText="Stay"
        actionType="default"
      />{" "}
      {/* Clear Form Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirmFetch={confirmClearForm}
        title="Clear Form"
        message="Are you sure you want to clear all form data? This action cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        actionType="default"
      />
      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        onConfirmFetch={() => handleFormSubmit()} // เปลี่ยนจากการปิด modal เป็นการ submit form
        title="Question Preview"
        message={
          <div className="text-left">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Skill Category:
              </h3>
              <p>
                {skills.find((skill) => skill.skill_id === skillId)?.skill_name}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Question:</h3>
              <div dangerouslySetInnerHTML={{ __html: questionText }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Options:
              </h3>
              {options.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="radio"
                    checked={option.is_correct}
                    readOnly
                    className="h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <span className="ml-2">
                    {String.fromCharCode(65 + index)}. {option.option_text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        }
        confirmText={
          isLoading
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
            ? "Create Question"
            : "Update Question"
        }
        cancelText="Close"
        actionType="default"
        isPreview={true}
      />
      <div className="max-w-5xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation("/questions")}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoChevronBack className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {mode === "create" ? "Create New Question" : "Update Question"}
              </h1>
              <p className="text-gray-600 mt-2">
                {mode === "create"
                  ? "Add a new question to your question bank"
                  : "Edit existing question in your question bank"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <form onSubmit={handleFormSubmit} className="p-6">
            {/* Skill Selection */}
            <div className="mb-8">
              <label
                htmlFor="skill"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Select Skill Category
              </label>
              <select
                id="skill"
                value={String(skillId ?? "")}
                onChange={onSelectSkill}
                disabled={isLoading}
                className={`block w-full pl-4 pr-10 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out bg-white ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <option value="">Choose a skill type...</option>
                {skills?.map((skill) => (
                  <option
                    key={skill.skill_id}
                    value={skill.skill_id?.toString()}
                  >
                    {skill.skill_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Question Text
              </label>
              <TiptapEditor
                content={questionText}
                onChange={onEditorChange}
                immediatelyRender={false}
                editorProps={{
                  attributes: {
                    class: "prose focus:outline-none max-w-full",
                  },
                }}
              />
            </div>

            {/* Options Section */}
            <div className="grid grid-cols-2 gap-6">
              {options.map((option, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`isCorrect${index}`}
                        checked={option.is_correct}
                        onChange={(e) => onSelectAnswer(index, e)}
                        className={`h-4 w-4 text-blue-600 border-gray-300 ${
                          isLoading ? "cursor-not-allowed" : ""
                        }`}
                        disabled={isLoading}
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700">
                        Choice {String.fromCharCode(65 + index)}
                      </label>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleMoveOption(index, "up")}
                        disabled={index === 0 || isLoading}
                        className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveOption(index, "down")}
                        disabled={index === options.length - 1 || isLoading}
                        className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-50"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        disabled={isLoading}
                        className="p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-50"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    id={`option${index}`}
                    value={option.option_text}
                    onChange={(e) => handleOptionChange(index, e)}
                    maxLength={MAX_OPTION_LENGTH}
                    placeholder="Enter choice text..."
                    className={`w-full p-2.5 border border-gray-200 rounded-lg focus:ring-0 focus:border-gray-300 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  />
                </div>
              ))}

              {/* Add Option Button */}
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={handleAddOption}
                  disabled={options.length >= 5 || isLoading}
                  className="w-full p-2 mt-2 text-gray-600 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add Option
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-between">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleNavigation("/questions")}
                  disabled={isLoading}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClearForm}
                  disabled={isLoading || !isFormChanges()}
                  className="px-8 py-3 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Form
                </button>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={!isFormValid() || isLoading || (mode === "update" && !isDataUpdate())}
                  className={`px-8 py-3 border border-blue-300 rounded-lg transition duration-150 ease-in-out
        ${
          !isFormValid() || isLoading || (mode === "update" && !isDataUpdate())
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-600 hover:bg-blue-50"
        }`}
                >
                  Preview
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid() || isLoading || (mode === "update" && !isDataUpdate())}
                  className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white 
        ${
          isFormValid() && !isLoading && (mode === "create" || (mode === "update" && isDataUpdate()))
            ? "bg-teal-600 hover:bg-teal-700"
            : "bg-gray-400 cursor-not-allowed"
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out`}
                >
                  {isLoading
                    ? mode === "create"
                      ? "Creating..."
                      : "Updating..."
                    : mode === "create"
                    ? "Create Question"
                    : "Update Question"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
