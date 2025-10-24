import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],       // array prodotti
  page: 1,
  totalPages: 1,
  filters: {},
  loading: false,
  error: null
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    startLoading: (state) => { state.loading = true; },
    setProducts: (state, action) => {
      const { items, page, totalPages } = action.payload;
      state.items = items;
      state.page = page;
      state.totalPages = totalPages;
      state.loading = false;
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { startLoading, setProducts, setFilters, setError } = productsSlice.actions;
export default productsSlice.reducer;
