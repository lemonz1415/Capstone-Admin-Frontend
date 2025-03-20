import axios from "axios";
import { fetchWithAuth } from "./utils.query";

const HOST_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllSkillQuery = async () => {
  try {
    // const response = await axios.get(`${HOST_URL}/api/admin/skill`);

    const response = fetchWithAuth(`/api/admin/skill`, "GET");
    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
};
