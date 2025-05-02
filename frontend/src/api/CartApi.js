// src/api/CartApi.js
import { instance } from '../services/ApiEndpoint'; // ✅ import existing axios instance


export const getCartByUser = async () => {
  try {
    const res = await instance.get('/api/cart');
    return res.data;
  } catch (error) {
    console.error('Failed to fetch cart items', error);
    throw error;
  }
};

export const addToCart = async (productId) => {
  try {
    const res = await instance.post('/api/cart', { productId });
    return res.data;
  } catch (error) {
    console.error('Failed to add to cart', error);
    throw error;
  }
};

export const updateCartItem = async (id, quantity) => {
  try {
    const res = await instance.put(`/api/cart/update/${id}`, { quantity });
    return res.data;
  } catch (error) {
    console.error('Failed to update cart item', error);
    throw error;
  }
};

export const deleteCartItem = async (id) => {
  try {
    const res = await instance.delete(`/api/cart/${id}`);
    return res.data;
  } catch (error) {
    console.error('Failed to delete cart item', error);
    throw error;
  }
};

export const checkout = async (cartItems) => {
  try {
    const res = await instance.post('/api/cart/checkout', { cartItems });
    return res.data;
  } catch (error) {
    console.error('Checkout failed', error);
    throw error;
  }
};
