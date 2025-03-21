import { useAuth } from "@/contexts/auth.context";
import axios, { AxiosError } from "axios";
import { url } from "inspector";

const HOST_URL = process.env.NEXT_PUBLIC_API_URL;

//---------------
// LOGIN
//---------------

export const loginQuery = async (body: { email: string; password: string }) => {
  const response = await axios.post(`${HOST_URL}/api/admin/auth/login`, body);
  return response.data;
};

//---------------
// REFRESH TOKEN
//---------------

export const refreshAccessTokenQuery = async (refreshToken: string) => {
  const response = await axios({
    url: `${HOST_URL}/api/admin/auth/refresh`,
    method: "POST",
    headers: {
      Authorization: refreshToken,
      "Content-Type": "application/json",
    },
  });

  const newAccessToken = response.data.accessToken;
  localStorage.setItem("accessToken", newAccessToken);
  return response.data.success;
};

//---------------
// VALIDATE TOKEN
//---------------

export const checkAccessTokenQuery = async (accessToken: string | null) => {
  // console.log("fetch check");
  const response = await axios.get(
    `${HOST_URL}/api/admin/auth/protected-route`,
    {
      headers: {
        Authorization: accessToken,
      },
    }
  );

  return response.data;
};
