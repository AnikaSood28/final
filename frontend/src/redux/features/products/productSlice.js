// features/products/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching products by collection
export const fetchProductsByCollection = createAsyncThunk(
  'products/fetchProductsByCollection',
  async (collection, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/products/collection/${collection}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  filteredItems: [],
  selectedCollection: 'All',
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  sorting: {
    field: 'price',
    order: 'asc'
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCollection: (state, action) => {
      state.selectedCollection = action.payload;
      if (action.payload === 'All') {
        state.filteredItems = state.items;
      } else {
        state.filteredItems = state.items.filter(
          item => item.collection === action.payload
        );
      }
    },
    sortProducts: (state, action) => {
      const { field, order } = action.payload;
      state.sorting = { field, order };
      state.filteredItems = [...state.filteredItems].sort((a, b) => {
        if (order === 'asc') {
          return a[field] > b[field] ? 1 : -1;
        }
        return a[field] < b[field] ? 1 : -1;
      });
    },
    searchProducts: (state, action) => {
      const searchTerm = action.payload.toLowerCase();
      state.filteredItems = state.items.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.collection.toLowerCase().includes(searchTerm)
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchProductsByCollection.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByCollection.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.filteredItems = action.payload;
      })
      .addCase(fetchProductsByCollection.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { setSelectedCollection, sortProducts, searchProducts } = productSlice.actions;
export default productSlice.reducer;

// Store configuration
// store.js
import { configureStore } from '@reduxjs/toolkit';
import productReducer from './features/products/productSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
  },
});