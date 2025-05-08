import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import DbCon from './utlis/db.js';
import AuthRoutes from './routes/AuthRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js';
import otherRoutes from './routes/routes.js';
import CartRoutes from './routes/CartRoutes.js';
import BookingRoutes from './routes/BookingRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import { stripeWebhook } from './controllers/WebhookController.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware setup (CORS needs to be configured early)
app.use(cors({
    origin: 'http://localhost:3000',  // Replace with your frontend URL.  Consider making this an env variable
    credentials: true,
}));

//ADD THIS
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.use('/api/bookings/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request for ${req.path}`);
    next();
});

// MongoDB Connection
DbCon();

// API Routes
app.use('/api/auth', AuthRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/bookings', BookingRoutes);
app.use('/api', otherRoutes);

// Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('PORT:', process.env.PORT);
    console.log('MONGODB_URL:', process.env.MONGODB_URL);
});

console.log('Environment variables:', {
    FRONTEND_URL: process.env.FRONTEND_URL,
    YOUR_DOMAIN: process.env.YOUR_DOMAIN
  });

  // Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        message: 'Internal server error',
        error: err.message 
    });
});