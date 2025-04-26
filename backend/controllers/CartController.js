import Cart from '../models/Cart.js';
import Checkout from '../models/Checkout.js';

export const addToCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    const existing = await Cart.findOne({ userId, productId });
    if (existing) {
      existing.quantity += 1;
      await existing.save();
    } else {
      await Cart.create({ userId, productId, quantity: 1 }); // Ensure quantity starts at 1
    }
    res.status(201).json({ message: 'Product added to cart' });
  } catch (err) {
    res.status(500).json({ error: 'Could not add to cart' });
  }
};

export const getCartByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.find({ userId }).populate('productId');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cart' });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting cart item' });
  }
};

export const updateCartItem = async (req, res) => {
  const { quantity } = req.body; // Get the new quantity from the request body
  const { id } = req.params; // Cart item ID from the URL parameter
  const userId = req.user._id;

  try {
    // Find the cart item by ID and user
    const cartItem = await Cart.findOne({ _id: id, userId });
    
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    // Update the quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({ message: 'Cart item updated' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating cart item' });
  }
};

export const checkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const cartItems = await Cart.find({ userId });
    const products = cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    await Checkout.create({ userId, products });
    await Cart.deleteMany({ userId });

    res.json({ message: 'Checkout successful' });
  } catch (err) {
    res.status(500).json({ error: 'Checkout failed' });
  }
};
