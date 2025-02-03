// requestMethods.js
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import store from "./app/redux/store"; // Import your Redux store
import { setUser, signOut } from "./app/redux/authSlice"; // so we can dispatch on refresh fail

const BASE_URL = "https://quizeng-022517ad949b.herokuapp.com/api";

// Keep the publicRequest the same for endpoints that require no auth
export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const createUserRequest = () => {
  // Get the current token from Redux
  const state = store.getState();
  const TOKEN = state.user.currentUser?.accessToken || null;

  // Create a new Axios instance
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  // Add a response interceptor to handle token refresh if 401 occurs
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If we get 401 and have not retried yet => attempt refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Get the refresh token from SecureStore
          const refreshToken = await SecureStore.getItemAsync("refreshToken");
          if (!refreshToken) {
            // No refresh token => sign user out
            store.dispatch(signOut());
            return Promise.reject(error);
          }

          // Attempt to get new access token from /auth/refresh
          const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          // Extract new short-lived token from the response
          const newAccessToken = refreshResponse.data.accessToken;

          // Update Redux store with the new token
          const currentUser = store.getState().user.currentUser;
          store.dispatch(
            setUser({
              ...currentUser,
              accessToken: newAccessToken,
            })
          );

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // Refresh also failed => sign user out
          store.dispatch(signOut());
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  // Return the Axios instance
  return instance;
};
