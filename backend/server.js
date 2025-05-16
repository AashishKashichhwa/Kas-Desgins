// backend/server.js or backend/app.js
import express from 'express';
import http from 'http';       // Import the 'http' module
import { Server } from 'socket.io'; // Import Socket.IO
import cors from 'cors';           // Import cors
import cookieParser from 'cookie-parser';
import DbCon from './utlis/db.js';
import AuthRoutes from './routes/AuthRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js';
import otherRoutes from './routes/routes.js';
import CartRoutes from './routes/CartRoutes.js';
import BookingRoutes from './routes/BookingRoutes.js';
import NotificationRoutes from './routes/NotificationRoutes.js'; // Import Notification Routes
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import { stripeWebhook } from './controllers/WebhookController.js';
import dotenv from 'dotenv';
import CartWebhookRoute from './routes/CartWebhookRoute.js'; 

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware setup (CORS needs to be configured early)
app.use(cors({
    origin: 'http://localhost:3000',  // Replace with your frontend URL.  Consider making this an env variable
    credentials: true,
}));

// Stripe Webhook Route (MUST BE BEFORE express.json())
app.use('/api/bookings/webhook', express.raw({ type: 'application/json' }));
// app.use('/api/bookings/webhook', );
app.use('/api/cart/cart-webhook', express.raw({ type: 'application/json' }), CartWebhookRoute);

//ADD THIS
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request for ${req.path}`);
    next();
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow your frontend origin
        methods: ["GET", "POST"]       // Allow necessary HTTP methods
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

     socket.on('join', (room) => {
        console.log(`Socket ${socket.id} joining room ${room}`);
        socket.join(room);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// MongoDB Connection
DbCon();

// API Routes
app.use('/api/auth', AuthRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/bookings', BookingRoutes);
app.use('/api/notifications', NotificationRoutes); // Mount the notification routes
app.use('/api', otherRoutes);


// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
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

// Export 'io' for use in other modules
export { io };