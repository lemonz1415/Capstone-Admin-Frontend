import axios from "axios";

const HOST_URL = process.env.NEXT_PUBLIC_API_URL;

export const createOptionQuery = async (body: any) => {
  try {
    const response = await axios.post(`${HOST_URL}/api/option/create`, body);
    return response?.data;
  } catch (error) {
    console.log(error);
    return;
  }
};
