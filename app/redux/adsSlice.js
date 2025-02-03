// adsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for API requests
const BASE_URL = "https://quizeng-022517ad949b.herokuapp.com/api";

// Thunk to fetch ads count
export const fetchAds = createAsyncThunk(
  "ads/fetchAds",
  async (userId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.user.currentUser?.token;

    try {
      const response = await axios.get(`${BASE_URL}/users/ads/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.ads; // Ensure backend returns { ads: <number> }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to fetch ads";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

// Thunk to update ads count
export const updateAds = createAsyncThunk(
  "ads/updateAds",
  async ({ userId, incrementBy }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.user.currentUser?.token;

    try {
      const response = await axios.put(
        `${BASE_URL}/users/ads/${userId}`,
        { incrementBy },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.ads;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to update ads";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

const adsSlice = createSlice({
  name: "ads",
  initialState: {
    ads: 3, // Default value
    adsResetAt: null,
    loading: false,
    error: null,
  },
  reducers: {
    setAds: (state, action) => {
      state.ads = action.payload;
    },
    resetAdsResetAt: (state) => {
      state.adsResetAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Ads
      .addCase(fetchAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAds.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = action.payload;
      })
      .addCase(fetchAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch ads";
      })
      // Update Ads
      .addCase(updateAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAds.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = action.payload;
      })
      .addCase(updateAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to update ads";
      });
  },
});

export default adsSlice.reducer;

// Selectors
export const selectAds = (state) => state.ads.ads;
export const selectAdsLoading = (state) => state.ads.loading;
export const selectAdsError = (state) => state.ads.error;

// Actions
export const { setAds, resetAdsResetAt } = adsSlice.actions;
