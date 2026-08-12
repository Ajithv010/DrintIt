import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ========================================
// ADD JWT TO PROTECTED REQUESTS
// ========================================

api.interceptors.request.use(
  (config) => {
    const isAuthRequest =
      config.url?.startsWith("/auth/");

    if (!isAuthRequest) {
      const token =
        localStorage.getItem("drinkit_token");

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================================
// HANDLE UNAUTHORIZED RESPONSE
// ========================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.startsWith("/auth/")
    ) {
      localStorage.removeItem("drinkit_token");

      window.dispatchEvent(
        new Event("authUpdated")
      );
    }

    return Promise.reject(error);
  }
);

export default api;