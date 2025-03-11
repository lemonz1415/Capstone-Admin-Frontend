import axios, { AxiosError } from "axios";

const HOST_URL = process.env.NEXT_PUBLIC_API_URL;

export const createUserQuery = async (body: {
  firstname: string;
  lastname: string;
  email: string;
  dob: string | null;
}) => {
  try {
    const response = await axios.post(
      `${HOST_URL}/api/admin/user/create`,
      body
    );
    return response?.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      return error?.response;
    } else {
      console.error("An unexpected error occurred:", error);
      return null;
    }
  }
};

export const editUserQuery = async (
  user_id: string | string[],
  body: {
    firstname: string;
    lastname: string;
    email: string;
    dob: string | null;
  }
) => {
  try {
    const response = await axios.put(
      `${HOST_URL}/api/admin/user/${user_id}/edit`,
      body
    );
    return response?.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      return error?.response;
    } else {
      console.error("An unexpected error occurred:", error);
      return null;
    }
  }
};

export const getUserDetail = async (user_id: string | string[] | undefined) => {
  try {
    const response = await axios.get(`${HOST_URL}/api/admin/user/${user_id}`);
    return response?.data?.user_detail;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      return error?.response;
    } else {
      console.error("An unexpected error occurred:", error);
      return null;
    }
  }
};

export const setPasswordQuery = async (body: {
  email: string | string[] | null;
  password: string;
}) => {
  try {
    const response = await axios.put(
      `${HOST_URL}/api/admin/user/password`,
      body
    );
    return response?.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      return error?.response;
    } else {
      console.error("An unexpected error occurred:", error);
      return null;
    }
  }
};
