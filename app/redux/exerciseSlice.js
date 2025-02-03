// redux/exerciseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch the current exercise from the backend
export const fetchExercise = createAsyncThunk(
  "exercise/fetchExercise",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(
        `https://quizeng-022517ad949b.herokuapp.com/api/users/exercise/${userId}`
      );
      return response.data.exercise; // Ensure backend returns { exercise: <number> }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk to update the exercise on the backend
export const updateExercise = createAsyncThunk(
  "exercise/updateExercise",
  async ({ userId, incrementBy }, thunkAPI) => {
    try {
      const response = await axios.put(
        `https://quizeng-022517ad949b.herokuapp.com/api/users/exercise/${userId}`,
        { incrementBy }
      );
      return response.data.exercise; // Ensure backend returns { exercise: <number> }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  exercise: 0,
  status: "idle",
  error: null,
};

// Create the slice
const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    // Optional: Reset exercise
    resetExercise: (state) => {
      state.exercise = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchExercise
      .addCase(fetchExercise.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExercise.fulfilled, (state, action) => {
        state.exercise = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchExercise.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle updateExercise
      .addCase(updateExercise.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateExercise.fulfilled, (state, action) => {
        state.exercise = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateExercise.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions
export const { resetExercise } = exerciseSlice.actions;

// Selector to get the exercise
export const selectExercise = (state) => state.exercise.exercise;

// Export the reducer
export default exerciseSlice.reducer;
