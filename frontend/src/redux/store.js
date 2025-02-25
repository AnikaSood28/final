import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local storage
import productReducer from "./features/products/productSlice";
import authReducer from "./features/auth/authSlice";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

// Persist Config for Auth
const authPersistConfig = {
  key: "auth",
  storage,
  stateReconciler: autoMergeLevel2, // Merges initial and persisted state
  whitelist: ["isLoggedIn", "user"], // Persist only user-related state
};

// Persist Config for Products
const productPersistConfig = {
  key: "products",
  storage,
  whitelist: ["sort"], // ✅ Persist sorting state
};


const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedProductReducer = persistReducer(productPersistConfig, productReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // ✅ Now persisting auth
    products: persistedProductReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist
    }),
});

export const persistor = persistStore(store);
