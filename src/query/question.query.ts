import axios from "axios";

const HOST_URL = process.env.NEXT_PUBLIC_API_URL;

// export const getAllQuestionQuery = async (body: any) => {
//   try {
//     const response = await axios.post(`${HOST_URL}/api/admin/question`, body);
//     return response?.data;
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// };

export const getAllQuestionQuery = async (params: {
  skill_id?: number[];
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
  search_filter?: string;
}) => {
  try {
    // สร้าง Query String จาก Object
    const queryString = new URLSearchParams(params as any).toString();

    const response = await axios.get(
      `${HOST_URL}/api/admin/question?${queryString}`
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching all questions:", error);
    return [];
  }
};

export const createQuestionQuery = async (body: any) => {
  try {
    const response = await axios.post(
      `${HOST_URL}/api/admin/question/create`,
      body
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const enableDisableQuestionQuery = async (question_id: any) => {
  try {
    const response = await axios.put(
      `${HOST_URL}/api/admin/question/available/${question_id}`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getQuestionsByIDQuery = async (questionID: string) => {
  try {
    const response = await axios.get(
      `${HOST_URL}/api/admin/question/${questionID}`
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const editQuestionQuery = async (body: any) => {
  try {
    const response = await axios.put(
      `${HOST_URL}/api/admin/question/edit`,
      body
    );
    return response?.data;
  } catch (error) {
    console.log(error);
    return;
  }
};
