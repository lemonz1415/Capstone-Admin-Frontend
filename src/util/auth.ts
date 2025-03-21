import { checkAccessTokenQuery } from "@/query/auth.query";

const HOST_URL = process.env.NEXT_PUBLIC_API_URL;

export const checkTokenValidity = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await checkAccessTokenQuery(accessToken);

    return response.success;
  } catch (error) {
    console.log("Token validation failed:", error);
    return false;
  }
};

export const isPermissioned = (user: any, role: string | string[]) => {
  return role.includes(user?.role);
};
