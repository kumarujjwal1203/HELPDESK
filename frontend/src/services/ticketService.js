import axios from "axios";

const API_URL = "https://helpdesk-backend-1-3hov.onrender.com/api/tickets";

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

export const getTickets = async (token, params = {}) => {
  const res = await axios.get(API_URL, {
    headers: authHeader(token),
    params,
  });
  return res.data;
};

export const getTicketById = async (token, id) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: authHeader(token),
  });
  return res.data;
};

export const createTicket = async (token, ticketData) => {
  const res = await axios.post(API_URL, ticketData, {
    headers: authHeader(token),
  });
  return res.data;
};

export const patchTicket = async (token, id, updates) => {
  const res = await axios.patch(`${API_URL}/${id}`, updates, {
    headers: authHeader(token),
  });
  return res.data;
};

export const addComment = async (token, ticketId, commentData) => {
  const res = await axios.post(`${API_URL}/${ticketId}/comments`, commentData, {
    headers: authHeader(token),
  });
  return res.data;
};
