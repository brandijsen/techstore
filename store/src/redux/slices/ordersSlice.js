import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],       // array ordini
  selected: null, // ordine visualizzato nel dettaglio
  loading: false,
  error: null
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    startLoading: (state) => { state.loading = true; },
    setOrders: (state, action) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedOrder: (state, action) => {
      state.selected = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { startLoading, setOrders, setSelectedOrder, setError } = ordersSlice.actions;
export default ordersSlice.reducer;
