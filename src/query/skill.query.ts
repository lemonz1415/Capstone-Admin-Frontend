import axios from "axios";

const HOST_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllSkillQuery = async () => {
  try {
    const response = await axios.get(`${HOST_URL}/api/admin/skill`);
    return response?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
