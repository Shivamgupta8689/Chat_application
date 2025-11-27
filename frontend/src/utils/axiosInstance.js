import axios from "axios";

const backendURL =
  import.meta.env.VITE_BACKEND_URL;

if (!backendURL) {
  throw new Error(
    "VITE_BACKEND_URL is not defined. Configure it in your deployment environment."
  );
}

const API = axios.create({
  baseURL: backendURL,
  withCredentials: true,
});

export default API;
