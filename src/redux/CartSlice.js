import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {
    products: [],
  },
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const addedProductId = product.id;
      const existingProduct = state.data.products.find(
        (item) => item.product.id == addedProductId
      );
      if (existingProduct) {
        const updatedQuantity = Math.min(existingProduct.quantity + quantity, 99);
    existingProduct.quantity = Math.max(updatedQuantity, 1);
      } else {
        state.data.products.push(action.payload);
      }
    },
    updateQuantityCart: (state, action) => {
      const { product, quantityChange } = action.payload;
      const existingProduct = state.data.products.find(item => item.product.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += quantityChange;
        if (existingProduct.quantity <= 0) {
          state.data.products = state.data.products.filter(item => item.product.id !== product.id);
        }
      }
    },
    removeFromCart: (state, action) => {
      const removedProductId = action.payload.id;
      const removedProductIndex = state.data.products.findIndex(
        (item) => item.product.id == removedProductId
      );
      if (removedProductIndex !== -1) {
        state.data.products.splice(removedProductIndex, 1);
      }
    },
    clearCart: (state) => {
      state.data.products = [];
    },
  },
});
export const { addToCart, updateQuantityCart, removeFromCart, clearCart } = cartSlice.actions;
export const selectCart = (state) => state.cart.data;
export const selectCartAmount = (state) => state.cart.data.products.length;
export const selectTotalCost = (state) =>
  Math.round(
    state.cart.data.products.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  );
export default cartSlice.reducer;
