"use client";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import TiptapEditor from "@/components/TiptapEditor";
import toast, { Toaster } from "react-hot-toast";
import Modal from "@/components/modal";
import { IoChevronBack } from "react-icons/io5";
import {
  createQuestionQuery,
  getQuestionsByIDQuery,
  editQuestionQuery,
  getAllQuestionQuery,
} from "@/query/question.query";
import { createOptionQuery } from "@/query/option.query";
import { getAllSkillQuery } from "@/query/skill.query";
import { useAuth } from "@/contexts/auth.context";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { fetchMe } from "@/query/user.query";
import { isPermissioned } from "@/util/auth";
import { roles } from "@/util/role";

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
  image_id: number | null;
  question_text: string;
  options: QuestionOption[];
}

const MAX_QUESTION_LENGTH = 300; // กำหนด max length ของ question
const MAX_OPTION_LENGTH = 300; // กำหนด max length ของ option

export default function QuestionForm({ mode, questionID }: QuestionFormProps) {
  const router = useRouter();

  const [skills, setSkills] = useState<Skill[]>([]); // ดึงข้อมูล skill มาแสดง
  const [skillId, setSkillId] = useState<number | null>(null); // เก็บ skill ที่ผู้ใช้เลือก
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
  const [isEditorReady, setIsEditorReady] = useState(false);

  // ข้อมูล question ที่ดึงมาตั้งแต่ต้น (ในกรณีที่เป็น update) เอาไว้เทียบว่าข้อมูลที่ผู้ใช้กรอกผ่าน form มีการเปลี่ยนแปลงจากตอนแรก (ข้อมูลนี้) หรือไม่
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
        setIsEditorReady(false);
        try {
          const response = await getQuestionsByIDQuery(questionID);
          if (response && response.question) {
            const initialData = {
              skill_id: response.skill.skill_id,
              question_text: response.question,
              options: response.options.map((opt: any) => ({
                option_text: opt.option_text,
                is_correct: opt.is_correct === 1,
              })),
            };
            setInitialFormData(initialData); // เก็บข้อมูลดั้งเดิมของตัว question เอาไว้เทียบการเปลี่ยนแปลง

            // Set initial data เอาข้อมูลที่ได้มาแสดงบน form
            setSkillId(response.skill.skill_id);
            setQuestionText(response.question);
            setOptions(
              response.options.map((opt: any) => ({
                option_text: opt.option_text,
                is_correct: opt.is_correct === 1,
              }))
            );
            setIsEditorReady(true);
          } else {
            toast.error("Failed to load question data");
            router.push("/questions");
          }
        } catch (error) {
          console.error("Error fetching question:", error);
          toast.error("Error loading question data");
          router.push("/questions");
        }
      } else {
        // ถ้าเป็น create mode ให้ set isEditorReady เป็น true และ setIsInitialLoading เป็น false เลย
        setIsEditorReady(true);
        setIsInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [mode, questionID, router]);

  // รอให้ isEditorReady เป็น true ก่อน = รอให้ข้อมูลถูก fetch และ assign ให้เรียบร้อยก่อน จึงจะ set ให้ isInitialLoading = false
  useEffect(() => {
    if (isEditorReady && isInitialLoading) {
      setIsInitialLoading(false);
    }
  }, [isEditorReady, isInitialLoading]);

  useEffect(() => {
    const getAllSkill = async () => {
      const response = await getAllSkillQuery();
      if (response) {
        setSkills(response.skills);
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
    const isOptionsChanged =
      JSON.stringify(options) !== JSON.stringify(initialFormData.options);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPendingNavigation(""); // Reset pendingNavigation เมื่อ Modal ถูกปิด
  };

  // ฟังก์ชัน validate form
  const isFormValid = useCallback(() => {
    const hasSkill = skillId !== null;
    // เช็คความยาวของ question_text
    const questionPlainText = questionText.replace(/<[^>]*>/g, "").trim();
    const hasQuestionText = questionPlainText !== "";
    const isQuestionLengthValid =
      questionPlainText.length <= MAX_QUESTION_LENGTH;

    const allOptionsHaveText = options.every(
      (option) => option.option_text.trim() !== ""
    );
    const hasCorrectAnswer = options.some((option) => option.is_correct);

    return (
      hasSkill &&
      hasQuestionText &&
      isQuestionLengthValid &&
      allOptionsHaveText &&
      hasCorrectAnswer
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
      question_text: questionText,
      options: options,
    };

    try {
      if (mode === "create") {
        const responseQuestion = await createQuestionQuery(data);

        if (!responseQuestion?.success) {
          toast.error("Failed to create question");
          throw new Error(
            responseQuestion?.message || "Failed to create question"
          );
        }

        if (responseQuestion?.success) {
          toast.success("Question created successfully.");

          // Clear form after successful submission
          resetForm();
          setIsPreviewModalOpen(false);
          router.push("/questions");
        } else {
          toast.error(responseQuestion?.message || "Failed to create question");
        }
      } else {
        // ส่งข้อมูลทั้ง question และ options ไป
        const updateData = {
          question_id: parseInt(questionID!),
          skill_id: skillId,
          image_id: null,
          question_text: questionText,
          options: options.map((opt) => ({
            option_text: opt.option_text,
            is_correct: opt.is_correct,
          })),
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
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          (mode === "create"
            ? "An error occurred while creating the question."
            : "An error occurred while updating the question.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  //----------------
  // AUTH
  //----------------
  const [user, setUser] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [openUnauthorizeModal, setOpenUnauthorizeModal] = useState(false);

  useEffect(() => {
    console.log("fetch user");
    const fetchUserData = async () => {
      try {
        const response = await fetchMe();
        setUser(response);
        setIsFetching(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, []);

  const isAllowed =
    isPermissioned(user, [roles.ADMIN, roles.QUESTION_CREATOR]) && !isFetching;
  useEffect(() => {
    if (isFetching) return;

    if (!isAllowed) {
      setOpenUnauthorizeModal(true);
    }
  }, [isPermissioned, isFetching, router]);

  //----------------
  // ACCESS
  //----------------
  const [isCanAccess, setIsCanAccess] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data } = await getAllQuestionQuery({ per_page: 9999 });

        setIsCanAccess(
          data.some((q: any) => q.question_id === Number(questionID))
        );
      } catch (error) {
        console.error("Error fetching question list:", error);
      }
    };
    if (mode === "update") {
      checkAccess();
    }
  }, [questionID, isFetching]);

  // แสดงหน้า load รอจนตัว editor และ ข้อมูลถูกดึงมา ( กรณีเป็น update ) จนเสร็จก่อนค่อยแสดงทั้งหมดพร้อมกัน
  if (isInitialLoading || !isEditorReady) {
    return (
      <div className="flex items-center justify-center min-h-screen ml-[250px]">
        <div className="text-gray-600">
          {mode === "create"
            ? "Loading create question form..."
            : "Loading update question form with data..."}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 ml-[250px]">
      <Toaster position="top-right" />
      {/* Modal */}
      <Modal
        isOpen={openUnauthorizeModal}
        onClose={() => router.push("/profile")}
        onConfirmFetch={() => router.push("/profile")}
        icon={faXmark}
        title="Unauthorized Access"
        message="You do not have permission to access this resource."
        confirmText="Confirm"
      />
      <Modal
        isOpen={!isCanAccess}
        onClose={() => router.push("/questions")}
        onConfirmFetch={() => router.push("/questions")}
        icon={faXmark}
        title="Access Denied"
        message="You do not have permission to access this page."
        confirmText="Confirm"
      />
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirmFetch={() => {
          router.push(pendingNavigation);
          setIsModalOpen(false);
          setPendingNavigation("");
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
      {isAllowed && isCanAccess && (
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
                  {mode === "create"
                    ? "Create New Question"
                    : "Update Question"}
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
                  // onInit={() => setIsEditorReady(true)}
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
                    disabled={
                      !isFormValid() ||
                      isLoading ||
                      (mode === "update" && !isDataUpdate())
                    }
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
                    disabled={
                      !isFormValid() ||
                      isLoading ||
                      (mode === "update" && !isDataUpdate())
                    }
                    className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white 
        ${
          isFormValid() &&
          !isLoading &&
          (mode === "create" || (mode === "update" && isDataUpdate()))
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
      )}
    </div>
  );
}
