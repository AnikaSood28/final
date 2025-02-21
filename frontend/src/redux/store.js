import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/authSlice";
import productReducer from "../redux/features/products/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },
});
