// redux/scoreSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch the current score from the backend
export const fetchScore = createAsyncThunk(
  "score/fetchScore",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(
        `https://quizeng-022517ad949b.herokuapp.com/api/users/score/${userId}`
      );
      return response.data.score; // Ensure backend returns { score: <number> }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk to update the score on the backend
export const updateScore = createAsyncThunk(
  "score/updateScore",
  async ({ userId, incrementBy }, thunkAPI) => {
    try {
      const response = await axios.put(
        `https://quizeng-022517ad949b.herokuapp.com/api/users/score/${userId}`,
        { incrementBy }
      );
      return response.data.score; // Ensure backend returns { score: <number> }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  score: 0,
  status: "idle",
  error: null,
};

// Create the slice
const scoreSlice = createSlice({
  name: "score",
  initialState,
  reducers: {
    // Optional: Reset score
    resetScore: (state) => {
      state.score = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchScore
      .addCase(fetchScore.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchScore.fulfilled, (state, action) => {
        state.score = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchScore.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle updateScore
      .addCase(updateScore.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateScore.fulfilled, (state, action) => {
        state.score = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateScore.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions
export const { resetScore } = scoreSlice.actions;

// Selector to get the score
export const selectScore = (state) => state.score.score;

// Export the reducer
export default scoreSlice.reducer;
