import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import DbCon from './utlis/db.js';
import AuthRoutes from './routes/AuthRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js';
import otherRoutes from './routes/routes.js';
import multer from 'multer'; // Import multer
import path from 'path'; // Import path (for handling file paths)
import { fileURLToPath } from 'url'; // Import fileURLToPath

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// Configure multer for file uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // Use absolute path
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // Generate unique filenames
    }
});

const upload = multer({ storage: storage });

// mongo Db
DbCon();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use('/api/auth', AuthRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api', otherRoutes);

// Make the 'uploads' folder accessible (serve static files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('PORT:', process.env.PORT);
    console.log('MONGODB_URL:', process.env.MONGODB_URL);
});