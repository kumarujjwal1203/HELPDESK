import axios from "axios";

const API_URL = "https://helpdesk-backend-1-3hov.onrender.com/api/users";

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

export const getAllUsers = async (token) => {
  const res = await axios.get(API_URL, {
    headers: authHeader(token),
  });
  return res.data.users;
};
