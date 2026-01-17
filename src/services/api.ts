import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = import.meta.env.DEV
  ? "/api" 
  : "https://emp-mngmnt-be-production.up.railway.app/api/";

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://emp-mngmnt-be-production.up.railway.app/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Success response
    return response;
  },
  (error: AxiosError) => {
    // Error handling
    let errorMessage = "Something went wrong";

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 400:
          errorMessage =
            data?.details?.date?.[0] ||
            data?.message ||
            "Bad Request - Invalid data";
          break;
        case 401:
          errorMessage = "Unauthorized - Please login again";
          localStorage.removeItem("authToken");
          // window.location.href = "/login";
          break;
        case 403:
          errorMessage = "Forbidden - Access denied";
          break;
        case 404:
          errorMessage = "Not Found - Resource does not exist";
          break;
        case 409:
          errorMessage = data?.message || "Conflict - Data already exists";
          break;
        case 422:
          errorMessage = data?.message || "Validation Error";
          break;
        case 500:
          errorMessage = "Server Error - Please try again later";
          break;
        case 503:
          errorMessage = "Service Unavailable - Please try again later";
          break;
        default:
          errorMessage = data?.message || `Error: ${status}`;
      }
    } else if (error.request) {
      // Request made but no response
      errorMessage = "No response from server - Check your connection";
    } else {
      // Error in request setup
      errorMessage = error.message || "Error setting up request";
    }

    // Create custom error object
    const customError = new Error(errorMessage);
    return Promise.reject(customError);
  },
);

export default axiosInstance;
