import axios, { AxiosError } from "axios";

const HOST_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  dob: string;
  create_at: string;
  update_at: string;
  is_verify: boolean;
  is_active: boolean;
}

export const getAllUsersQuery = async (params?: {
  search_filter?: string;
  is_verify?: string;
  is_active?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}) => {
  try {
    const response = await axios.get(`${HOST_URL}/api/admin/user`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

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

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้เฉพาะราย
export const getUserDetailQuery = async (userId: string) => {
  const response = await axios.get(`${HOST_URL}/api/admin/user/${userId}`);
  return response.data.user_detail;
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

export const verifyEmailQuery = async (body: {
  email: string | string[] | null;
  code: string;
}) => {
  try {
    const response = await axios.put(`${HOST_URL}/api/admin/user/verify`, body);
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

// ฟังก์ชันสำหรับ Soft Delete (เปลี่ยนสถานะ Active/Inactive)
export const disableEnableUserQuery = async (userId: string) => {
  const response = await axios.put(
    `${HOST_URL}/api/admin/user/${userId}/status`
  );
  return response.data;
};
