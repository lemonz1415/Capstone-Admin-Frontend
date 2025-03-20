import axios from "axios";

const HOST_URL = process.env.NEXT_PUBLIC_API_URL;

// ฟังก์ชันสำหรับดึงข้อมูล Permissions ทั้งหมด
export const getAllPermissionsQuery = async () => {
    try {
      const response = await axios.get(`${HOST_URL}/api/admin/permission`);
      return response.data.permissions; 
    } catch (error) {
      console.error("Error fetching permissions:", error);
      throw error;
    }
  };
  
  // ฟังก์ชันสำหรับ Assign Permissions ให้ User
  export const grantPermissionsToUserQuery = async (userId: string, permissionIds: number[]) => {
    try {
      const response = await axios.post(`${HOST_URL}/api/admin/permission/grant`, {
        user_id: userId,
        permission_ids: permissionIds,
      });
      return response.data;
    } catch (error) {
      console.error("Error granting permissions:", error);
      throw error;
    }
  };