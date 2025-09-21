import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import our route files
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load our secret variables from the .env file
dotenv.config();

// Connect to our MongoDB database
connectDB();

// Create our main Express application
const app = express();

// This line allows our server to accept JSON data in requests (like from forms)
app.use(express.json());

// --- Tell our app to use the routes we created ---

// If a URL starts with "/api/auth", use the rules from `authRoutes.js`
app.use('/api/auth', authRoutes);

// If a URL starts with "/api/students", use the rules from `studentRoutes.js`
app.use('/api/students', studentRoutes);

// If a URL starts with "/api/admin", use the rules from `adminRoutes.js`
app.use('/api/admin', adminRoutes);


// Get the port number from our .env file, or use 5000 as a default
const PORT = process.env.PORT || 5000;

// Start the server and listen for requests on our chosen port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


