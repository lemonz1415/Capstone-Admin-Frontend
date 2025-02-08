import axios from "axios";

const HOST_URL = process.env.NEXT_PUBLIC_API_URL;

export const getQuestionsByExamIDAndTypeIDQuery = async (
  examID: number,
  typeID: number
) => {
  try {
    const response = await axios.post(`${HOST_URL}/api/questions`, {
      examID: examID,
      typeID: typeID,
    });

    return response?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createQuestionQuery = async (body: {
  examID: number;
  typeID: number;
  skillID: number;
  questionTexts: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  answer: "A" | "B" | "C" | "D";
}) => {
  try {
    const response = await axios.post(`${HOST_URL}/api/questions/create`, body);
    return response?.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const editQuestionQuery = async (body: {
  questionID: number;
  examID?: number;
  typeID?: number;
  skillID?: number;
  questionTexts?: string;
  choiceA?: string;
  choiceB?: string;
  choiceC?: string;
  choiceD?: string;
  answer?: "A" | "B" | "C" | "D";
}) => {
  try {
    const response = await axios.put(`${HOST_URL}/api/questions`, body);
    return response?.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const deleteQuestionQuery = async (questionID: number) => {
  try {
    const response = await axios.delete(
      `${HOST_URL}/api/questions/${questionID}`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getQuestionByIdQuery = async (questionID: number) => {
  try {
    const response = await axios.get(`${HOST_URL}/api/questions/${questionID}`);
    return response?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getSkillAllQuery = async () => {
  try {
    const response = await axios.get(`${HOST_URL}/api/skills`);
    return response?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
