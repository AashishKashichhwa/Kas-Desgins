import express from 'express';
import {
  addToCart,
  getCartByUser,
  deleteCartItem,
  updateCartItem, // Add this import
  checkout
} from '../controllers/CartController.js';
import { isUser } from '../middlewares/VerifyToken.js';

const router = express.Router();

// Add to cart
router.post('/', isUser, addToCart);

// Get user's cart
router.get('/', isUser, getCartByUser);

// Delete cart item
router.delete('/:id', isUser, deleteCartItem);

// Update cart item quantity
router.put('/update/:id', isUser, updateCartItem); // Add this route for updating cart items

// Checkout
router.post('/checkout', isUser, checkout);

export default router;
