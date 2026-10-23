import axios from "axios";

import { API_BASE_URL } from "./config";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: { Accept: "application/json" },
  withCredentials: true,
});

export default axiosInstance;
