import { createSlice } from "@reduxjs/toolkit";
import { fetchProductsByCollection } from "./productThunk";

const initialState = {
  items: [],
  filteredItems: [],
  status: "idle",
  error: null,
  page: 1,
  hasMore: true,
  lastFetchedParams: null,
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
      state.lastFetchedParams = null;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchProductsByCollection.pending, (state) => {
      state.status = "loading";
      state.error = null;
      state.page += 1;  // ✅ Increment `page` here to prevent duplicate fetches
    })
    .addCase(fetchProductsByCollection.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
    
      if (action.payload.page === 1) {
        state.items = action.payload.products;
        state.filteredItems = action.payload.products;
      } else {
        state.items = [...state.items, ...action.payload.products];
        state.filteredItems = [...state.filteredItems, ...action.payload.products];
      }
    
      state.hasMore = action.payload.hasMore;
    })
    
      .addCase(fetchProductsByCollection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetProducts } = productSlice.actions;
export default productSlice.reducer;
