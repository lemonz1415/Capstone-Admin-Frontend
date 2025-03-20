import {
  checkAccessTokenQuery,
  refreshAccessTokenQuery,
} from "@/query/auth.query";
import axios from "axios";

const HOST_URL = process.env.NEXT_PUBLIC_API_URL;

// ฟังก์ชันตรวจสอบว่า accessToken ใช้งานได้หรือไม่
export const checkTokenValidity = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await checkAccessTokenQuery(accessToken);

    return response.success; // ถ้า API ตอบ success, ถือว่า token ใช้งานได้
  } catch (error) {
    console.log("Token validation failed:", error);
    return false; // ถ้ามีข้อผิดพลาด ถือว่า token หมดอายุ
  }
};

export const isPermissioned = (user: any, permission: string | string[]) => {
  if (typeof permission === "string") {
    return user?.permissions.includes(permission) ? true : false;
  }

  if (Array.isArray(permission)) {
    return permission.every((perm) => user?.permissions.includes(perm));
  }
};
