import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://backend-m0e5.onrender.com/api/v1",
  withCredentials: true,
});
