// storySlice.js
import { createSlice } from "@reduxjs/toolkit";
import categories from "../utils/categories.json";

const initialState = {
  score: 0,
  unlockedStories: ["set1"], // Initially, only the first story is unlocked
  totalStories: categories.stories.length, // Total number of stories
};

const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    incrementScore: (state) => {
      state.score += 1;
    },
    unlockNextStory: (state) => {
      const currentUnlocked = state.unlockedStories.length;
      if (currentUnlocked < state.totalStories) {
        const nextSet = `set${currentUnlocked + 1}`;
        state.unlockedStories.push(nextSet);
      }
    },
    // Optional: Reset score and locked stories
    resetProgress: (state) => {
      state.score = 0;
      state.unlockedStories = ["set1"];
    },
  },
});

export const { incrementScore, unlockNextStory, resetProgress } =
  storySlice.actions;

export default storySlice.reducer;
