import axios from "axios";


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
//   role_id: "ADMIN" | "USER";
}

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมด (พร้อม Pagination)
// export const getAllUsersQuery = async (params?: {
//   search_filter?: string;
//   role_id?: "ADMIN" | "USER";
//   page?: number;
//   per_page?: number;
// }) => {
//   const response = await axios.get(`${HOST_URL}/api/admin/user`, { params });
//   return response.data; 
// };

export const getAllUsersQuery = async (params?: {
    search_filter?: string;
    // role_id?: string;
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

// export const getAllUsersQuery = async (params?: {
//     search_filter?: string;
//     role_id?: "ADMIN" | "USER";
//     page?: number;
//     per_page?: number;
//   }) => {
//     try {
//       const response = await axios.post(`${HOST_URL}/api/admin/user`, params);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       throw error;
//     }
//   };

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้เฉพาะราย
export const getUserDetailQuery = async (userId: string) => {
  const response = await axios.get(`${HOST_URL}/api/admin/user/${userId}`);
  return response.data.user_detail; 
};

// ฟังก์ชันสำหรับ Soft Delete (เปลี่ยนสถานะ Active/Inactive)
export const disableEnableUserQuery = async (userId: string) => {
  const response = await axios.put(`${HOST_URL}/api/admin/user/${userId}/status`);
  return response.data;
};
