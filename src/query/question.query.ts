import axios from "axios";

const HOST_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllQuestionQuery = async (body: any) => {
  try {
    const response = await axios.post(`${HOST_URL}/api/question`, body);
    return response?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createQuestionQuery = async (body: any) => {
  try {
    const response = await axios.post(`${HOST_URL}/api/question/create`, body);
    return response?.data;
  } catch (error) {
    console.log(error);
    return;
  }
};
