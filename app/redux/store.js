// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./authSlice";
import lessonsReducer from "./lessonsSlice";
import storyReducer from "./storySlice";
import scoreReducer from "./scoreSlice";
import adsReducer from "./adsSlice";
import exerciseReducer from "./exerciseSlice";

export const store = configureStore({
  reducer: {
    user: userReducer, // Register the user reducer
    score: scoreReducer, // Register the user reducer
    ads: adsReducer, // Register the user reducer
    exercise: exerciseReducer, // Register the user reducer
    story: storyReducer,
    lessons: lessonsReducer, // Register the lessons reducer
  },
});

export default store;
