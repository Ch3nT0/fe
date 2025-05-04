// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAdmin: false,
    isLoggedIn: false, // Thêm dòng này
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload; 
    },
    logout: (state) => {
      state.user = null;
      state.isAdmin = false;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, setIsAdmin, setIsLoggedIn, logout } = authSlice.actions;
export default authSlice.reducer;
