import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import chapterItems from "../utils/chapterItems";

// Thunk to fetch unlocked sets from the backend after user login
export const fetchUnlockedSets = createAsyncThunk(
  "lessons/fetchUnlockedSets",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(
        `https://quizeng-022517ad949b.herokuapp.com/api/users/find/${userId}`
      );
      return {
        unlockedSets: response.data.unlockedSets,
        xp: response.data.xp,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to update unlocked sets on the backend when a lesson is unlocked
export const updateUnlockedSets = createAsyncThunk(
  "lessons/updateUnlockedSets",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const { unlockedSets } = state.lessons;
    const userId = state.user.currentUser._id;

    try {
      await axios.put(
        `https://quizeng-022517ad949b.herokuapp.com/api/users/unlockedSets/${userId}`,
        { unlockedSets }
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to update xp on the backend
export const updateXP = createAsyncThunk(
  "lessons/updateXP",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const { xp } = state.lessons;
    const userId = state.user.currentUser._id;

    try {
      await axios.put(
        `https://quizeng-022517ad949b.herokuapp.com/api/users/xp/${userId}`,
        { xp }
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  unlockedSets: { 1: [1] }, // Start with only the first set of Chapter 1 unlocked
  xp: 0, // Initialize XP
  status: "idle",
  error: null,
};

const lessonsSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {
    unlockNextLesson: (state, action) => {
      const chapters = Object.keys(state.unlockedSets);
      for (let chapter of chapters) {
        const currentChapterSets = state.unlockedSets[chapter] || [];
        const nextLessonId = Math.max(...currentChapterSets) + 1;
        const isLastLesson =
          nextLessonId >
          chapterItems.filter((item) => item.chapterId === parseInt(chapter))
            .length;

        if (!isLastLesson) {
          state.unlockedSets[chapter] = [...currentChapterSets, nextLessonId];
          state.xp += 1; // Increase XP by 1
          return;
        }
      }

      // If all sets in the current chapter are unlocked, unlock the first set of the next chapter
      const nextChapter = parseInt(chapters[chapters.length - 1]) + 1;
      state.unlockedSets[nextChapter] = [1];
      state.xp += 1; // Increase XP by 1
    },
    resetLessons: (state) => {
      state.unlockedSets = { 1: [1] }; // Reset to the initial state
      state.xp = 0; // Reset XP to 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnlockedSets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUnlockedSets.fulfilled, (state, action) => {
        state.unlockedSets = action.payload.unlockedSets;
        state.xp = action.payload.xp;
        state.status = "succeeded";
      })
      .addCase(fetchUnlockedSets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUnlockedSets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUnlockedSets.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateUnlockedSets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateXP.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateXP.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateXP.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selector to get the XP from the state
export const xpSelector = (state) => state.lessons.xp;

// Export the actions
export const { unlockNextLesson, resetLessons } = lessonsSlice.actions;

// Export the reducer
export default lessonsSlice.reducer;
