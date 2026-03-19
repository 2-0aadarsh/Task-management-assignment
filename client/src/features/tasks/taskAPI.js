import axios from "axios";

const BASE_URL = "http://localhost:5000/tasks";

export const fetchTasksAPI = (params) =>
  axios.get(BASE_URL, { params });

export const createTaskAPI = (data) =>
  axios.post(BASE_URL, data);

export const completeTaskAPI = (id) =>
  axios.patch(`${BASE_URL}/${id}`);

export const deleteTaskAPI = (id) =>
  axios.delete(`${BASE_URL}/${id}`);