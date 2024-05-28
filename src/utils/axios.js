import axios from "axios";

// local
import Environment from "../constant/endPoints";

// creating instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL
    : "",
});

export default axiosInstance;
