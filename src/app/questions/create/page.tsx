"use client";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import TiptapEditor from "@/components/TiptapEditor";
import toast, { Toaster } from "react-hot-toast";
import Modal from "@/components/modal";
import { IoChevronBack } from "react-icons/io5";
import Navbar from "@/components/navbar";


interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

interface NewQuestionData {
  skillId: number;
  questionText: string;
  options: QuestionOption[];
  userId: string;
  createdAt: string;
}

const skills = [
  { id: 1, name: "Vocabulary" },
  { id: 2, name: "Grammar" },
  { id: 3, name: "Listening" },
  { id: 4, name: "Speaking" },
  { id: 5, name: "Reading" },
];

export default function CreateQuestion() {
  const router = useRouter();
  const [skillId, setSkillId] = useState<number | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<QuestionOption[]>([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState("");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันตรวจสอบข้อมูลที่กรอก
  const hasUnsavedChanges = useCallback(() => {
    return (
      skillId !== null ||
      questionText !== "" ||
      options.some((option) => option.text !== "" || option.isCorrect)
    );
  }, [skillId, questionText, options]);

  // ฟังก์ชันจัดการการ navigate
  const handleNavigation = (path: string) => {
    if (hasUnsavedChanges()) {
      setPendingNavigation(path);
      setIsModalOpen(true);
    } else {
      router.push(path);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // ฟังก์ชัน validate form
  const isFormValid = useCallback(() => {
    const hasSkill = skillId !== null;
    const hasQuestionText = questionText.trim() !== "";
    const allOptionsHaveText = options.every(
      (option) => option.text.trim() !== ""
    );
    const hasCorrectAnswer = options.some((option) => option.isCorrect);

    return (
      hasSkill && hasQuestionText && allOptionsHaveText && hasCorrectAnswer
    );
  }, [skillId, questionText, options]);

  const handleSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSkillId = parseInt(e.target.value, 10);
    setSkillId(selectedSkillId);
  };

  const handleEditorChange = (content: string) => {
    if (content !== questionText) {
      setQuestionText(content);
    }
  };

  const handleOptionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newOptions = [...options];
    newOptions[index].text = e.target.value;
    setOptions(newOptions);
  };

  const handleIsCorrectChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newOptions = [...options];
    newOptions.forEach((option) => {
      option.isCorrect = false;
    });
    newOptions[index].isCorrect = e.target.checked;
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
    setOptions([...options, { text: "", isCorrect: false }]);
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
    if (!isFormValid()) {
      toast.error("Please fill in all fields correctly before preview.");
      return;
    }
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
    const userId = "087";
    const createdAt = new Date().toISOString();
    
    if (!skillId) {
        toast.error("Please select a skill");
        return;
      }

    const data: NewQuestionData = {
      skillId,
      questionText,
      options,
      userId,
      createdAt,
    };
  
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        toast.success("Question created successfully.");
        
        // Clear form after successful submission
        setSkillId(null);
        setQuestionText("");
        setOptions([
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ]);
        
        setIsPreviewModalOpen(false); // ปิด modal preview หลังจากสร้างสำเร็จ
        router.push("/questions");
      } else if (response.status === 400) {
        toast.error("Validation error. Please check your input.");
      } else {
        toast.error("Failed to create question. Please try again.");
      }
      
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the question.");
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
        <Navbar onNavigate={handleNavigation} />
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
              <p>{skills.find((skill) => skill.id === skillId)?.name}</p>
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
                    checked={option.isCorrect}
                    readOnly
                    className="h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <span className="ml-2">
                    {String.fromCharCode(65 + index)}. {option.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        }
        confirmText={isLoading ? "Creating..." : "Create Question"}
        cancelText="Close"
        actionType="default"
        isPreview={true}
      />

      <div className="max-w-5xl mx-auto px-4 ml-64">
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
                Create New Question
              </h1>
              <p className="text-gray-600 mt-2">
                Add a new question to your question bank
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
                value={skillId ?? ""}
                onChange={handleSkillChange}
                disabled={isLoading} // Disable when loading
                className={`block w-full pl-4 pr-10 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out bg-white ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <option value="">Choose a skill type...</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id.toString()}>
                    {skill.name}
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
                onChange={handleEditorChange}
                immediatelyRender={false}
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
                        checked={option.isCorrect}
                        onChange={(e) => handleIsCorrectChange(index, e)}
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
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e)}
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
              <button
                type="button"
                onClick={() => handleNavigation("/questions")}
                disabled={isLoading}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                Cancel
              </button>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={!isFormValid() || isLoading}
                  className={`px-8 py-3 border border-blue-300 rounded-lg transition duration-150 ease-in-out
        ${
          !isFormValid() || isLoading
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-600 hover:bg-blue-50"
        }`}
                >
                  Preview
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid() || isLoading}
                  className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white 
        ${
          isFormValid() && !isLoading
            ? "bg-teal-600 hover:bg-teal-700"
            : "bg-gray-400 cursor-not-allowed"
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out`}
                >
                  {isLoading ? "Creating..." : "Create Question"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
