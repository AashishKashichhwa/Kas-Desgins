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

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// MongoDB Connection
DbCon();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request for ${req.path}`);
    next();
});

// API Routes
app.use('/api/auth', AuthRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/bookings', BookingRoutes); // Simplified route mounting
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