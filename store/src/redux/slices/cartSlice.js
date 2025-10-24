import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],   // { productId, name, price, quantity, image }
  total: 0
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find(p => p.productId === product.productId);
      if (existing) {
        existing.quantity += product.quantity;
      } else {
        state.items.push(product);
      }
      state.total = state.items.reduce((sum, p) => sum + p.price * p.quantity, 0);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(p => p.productId !== action.payload);
      state.total = state.items.reduce((sum, p) => sum + p.price * p.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(p => p.productId === productId);
      if (item) item.quantity = quantity;
      state.total = state.items.reduce((sum, p) => sum + p.price * p.quantity, 0);
    }
  }
});

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
