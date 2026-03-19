import axios from "axios";

const API_BASE_URL ="https://task-management-assignment-delta.vercel.app";

const BASE_URL = `${API_BASE_URL.replace(/\/$/, "")}/tasks`;

export const fetchTasksAPI = (params) =>
  axios.get(BASE_URL, { params });

export const createTaskAPI = (data) =>
  axios.post(BASE_URL, data);

export const completeTaskAPI = (id) =>
  axios.patch(`${BASE_URL}/${id}`);

export const deleteTaskAPI = (id) =>
  axios.delete(`${BASE_URL}/${id}`);