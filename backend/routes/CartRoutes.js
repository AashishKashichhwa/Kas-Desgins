import express from 'express';
import {
  addToCart,
  getCartByUser,
  deleteCartItem,
  updateCartItem
} from '../controllers/CartController.js';
import { isUser } from '../middlewares/VerifyToken.js';
import { createCartCheckoutSession } from '../controllers/cartCheckoutController.js';
// import {cartWebhookHandler} from '../controllers/CartWebhookController.js'
import { getCheckoutBySessionId } from '../controllers/cartCheckoutController.js'; // from same file


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
// router.post('/checkout', isUser, checkout);

router.post('/create-cart-checkout-session', isUser, createCartCheckoutSession);

// router.post('/cart-webhook', express.raw({ type: 'application/json' }), cartWebhookHandler);

router.get('/checkout/session/:sessionId', getCheckoutBySessionId);
export default router;
