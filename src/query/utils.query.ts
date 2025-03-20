import { useAuth } from "@/contexts/auth.context";
import { checkTokenValidity } from "@/util/auth";
import axios from "axios";

const HOST_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchWithAuth = async (
  url: string,
  method: string,
  data?: any,
  params?: any
) => {
  const isTokenValid = await checkTokenValidity();
  if (isTokenValid) {
    try {
      let accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("No access token found. Please log in again.");
      }

      try {
        // console.log("fetch with auth");
        const response = await axios({
          url: `${HOST_URL}${url}`,
          method,
          headers: {
            Authorization: accessToken,
            "Content-Type": "application/json",
          },
          data,
          params,
        });

        return response.data;
      } catch (error: any) {
        // console.log("try refetch with auth");
        const newAccessToken = localStorage.getItem("accessToken");

        const retryResponse = await axios({
          url: `${HOST_URL}${url}`,
          method,
          headers: {
            Authorization: newAccessToken,
            "Content-Type": "application/json",
          },
          data,
          params,
        });

        return retryResponse.data;
      }
    } catch (error) {
      console.log("Error during fetch:", error);
      throw error;
    }
  }
};
