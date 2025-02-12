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

export const enableDisableQuestionQuery = async (body: any) => {
  try {
    const response = await axios.put(
      `${HOST_URL}/api/question/available`,
      body
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getQuestionsByIDQuery = async (questionID: string) => {
  try {
    const response = await axios.get(`${HOST_URL}/api/question/${questionID}`);
    return response?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const editQuestionQuery = async (body: any) => {
  try {
    const response = await axios.put(`${HOST_URL}/api/question/edit`, body);
    return response?.data;
  } catch (error) {
    console.log(error);
    return;
  }
};
