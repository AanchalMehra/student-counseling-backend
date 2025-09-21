import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import our route files
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
connectDB();
const app = express();

// ===============================================================
//               *** THIS IS THE CORRECTED SECTION ***
// ===============================================================

// --- CORS Configuration ---
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://student-counseling-frontend.onrender.com' // Make sure this matches your frontend URL
  ],
};

// This line handles the browser's preflight 'OPTIONS' requests
app.options('*', cors(corsOptions));

// This line uses the CORS options for all other requests (GET, POST, etc.)
app.use(cors(corsOptions));

// This allows our server to accept JSON data in requests
app.use(express.json());

// ===============================================================

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);

// --- Production Static File Serving ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});