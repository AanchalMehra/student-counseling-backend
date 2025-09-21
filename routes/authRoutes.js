import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
// For "POST" request to the URL "/api/auth/register",`registerUser` function runs from controller.

router.post('/register', registerUser);
// For "POST" request to the URL "/api/auth/login",run the `loginUser` function.
router.post('/login', loginUser);

// When a "GET" request comes to "/api/auth/me", we do something special.
// First, our "protect" security guard will check for a valid ticket (token).
// If the ticket is valid, it will then run the `getMe` function.
// This is how a user can get their own profile details.
router.get('/me', protect, getMe);

// Export the router so our main server file can use these routes.
export default router;

