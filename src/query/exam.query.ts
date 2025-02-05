import axios from "axios";

const HOST_URL = process.env.NEXT_PUBLIC_API_URL;

export const getExamAllQuery = async (search_word: string) => {
  try {
    const response = await axios.get(
      `${HOST_URL}/api/exams?search_word=${search_word}`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getExamPagination = async (
  page?: number,
  per_page?: number,
  search_word?: string
) => {
  try {
    const response = await axios.get(
      `${HOST_URL}/api/exams/pagination?page=${page}&per_page=${per_page}&search_word=${search_word}`
    );

    return response?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getExamPreviewQuery = async (examID: number) => {
  try {
    const response = await axios.get(`${HOST_URL}/api/exams/preview/${examID}`);
    return response?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createExamQuery = async (body: {
  examTitle: string;
  userID?: number | null;
}) => {
  try {
    const response = await axios.post(`${HOST_URL}/api/exams`, body);
    return response?.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const editExamQuery = async (body: {
  examID: number;
  userID?: number | null;
  examTitle: string;
}) => {
  try {
    const response = await axios.put(`${HOST_URL}/api/exams`, body);
    return response?.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const deleteExamQuery = async (examID: number) => {
  try {
    const response = await axios.delete(`${HOST_URL}/api/exams/${examID}`);
    return response?.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getExamByTitleQuery = async (body: { examTitle: string }) => {
  try {
    const response = await axios.post(`${HOST_URL}/api/exams/title`, body);
    return response?.data;
  } catch (error) {
    console.log(error);
    return;
  }
};
