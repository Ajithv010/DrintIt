import axios from "axios";

const api = axios.create({
  baseURL:  "http://localhost:8080/api",
});

// ========================================
// ADD JWT + REQUEST CONFIGURATION
// ========================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("drinkit_token");

    /*
     * Login/register requests don't need
     * an Authorization header.
     */
    const isAuthRequest =
      config.url?.startsWith("/auth/");

    if (token && !isAuthRequest) {
      config.headers = config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    /*
     * IMPORTANT
     *
     * Do NOT globally set:
     *
     * Content-Type: application/json
     *
     * because FormData requests need the browser/
     * Axios to automatically create:
     *
     * multipart/form-data; boundary=...
     */

    if (
      config.data instanceof FormData
    ) {
      /*
       * Remove any previously assigned
       * Content-Type.
       *
       * Axios/browser will automatically
       * set the correct multipart boundary.
       */
      if (config.headers) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    } else {
      /*
       * Normal JSON requests.
       */
      config.headers =
        config.headers || {};

      config.headers["Content-Type"] =
        "application/json";
    }

    console.log(
      "API REQUEST:",
      config.method?.toUpperCase(),
      config.url,
      "Token:",
      Boolean(token),
      "FormData:",
      config.data instanceof FormData
    );

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ========================================
// HANDLE RESPONSE
// ========================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    console.error(
      "API ERROR:",
      error.response?.status,
      error.config?.url,
      error.response?.data
    );

    return Promise.reject(error);
  }
);

export default api;