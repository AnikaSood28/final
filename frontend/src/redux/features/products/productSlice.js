import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000";

export const fetchProductsByCollection = createAsyncThunk(
  "products/fetchProductsByCollection",
  async ({ source, gender, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      let url = `${BACKEND_URL}/api/products?page=${page}&limit=${limit}`;

      if (source && gender) {
        url = `${BACKEND_URL}/api/products/source/gender/${source}/${gender}?page=${page}&limit=${limit}`;
      } else if (source) {
        url = `${BACKEND_URL}/api/products/source/${source}?page=${page}&limit=${limit}`;
      } else if (gender) {
        url = `${BACKEND_URL}/api/products/gender/${gender}?page=${page}&limit=${limit}`;
      }

      const response = await axios.get(url);
      return {
        products: response.data.products,
        page,
        hasMore: response.data.hasMore, // Check if more products exist
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  items: [],
  filteredItems: [],
  status: "idle",
  error: null,
  page: 1,  // Track current page
  hasMore: true, // Check if there are more products
};


const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.items = [];
      state.filteredItems = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCollection.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByCollection.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = [...state.items, ...action.payload.products]; // Append products
        state.filteredItems = [...state.filteredItems, ...action.payload.products];
        state.page = action.payload.page + 1; // Increase page
        state.hasMore = action.payload.hasMore; // Check if more products exist
      })
      .addCase(fetchProductsByCollection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
