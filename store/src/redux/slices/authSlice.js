import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,        // { id, name, email, role }
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startLoading: (state) => { state.loading = true; },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    updateUser: (state, action) => {
  state.user = { ...state.user, ...action.payload };
},
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
        localStorage.removeItem("user");

    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { startLoading, setCredentials, updateUser, logout, setError } = authSlice.actions;
export default authSlice.reducer;
