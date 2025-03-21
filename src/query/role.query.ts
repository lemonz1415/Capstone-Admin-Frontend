import axios from "axios";
import { fetchWithAuth } from "./utils.query";

const HOST_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllRoleQuery = async () => {
  try {
    const response = await fetchWithAuth(`/api/admin/role`, "GET");
    return response.roles;
  } catch (error) {
    console.error("Error fetching permissions:", error);
    throw error;
  }
};
