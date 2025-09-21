import express from 'express';
const router = express.Router();

import {
  getAllStudents,
  allocateSeat,
  verifyPayment,
  generateOfferLetter,
} from '../controllers/adminController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

// --- Define the "roads" for admin actions ---
// Every single route here is protected by TWO guards.
// 1. `protect` makes sure the user is logged in.
// 2. `admin` makes sure the user is an admin.

// When a "GET" request comes to "/api/admin/all",
// it runs both guards, then the `getAllStudents` function.
router.get('/all', protect, admin, getAllStudents);

// When a "POST" request comes to "/api/admin/allocate",
// it runs both guards, then the `allocateSeat` function.
router.post('/allocate', protect, admin, allocateSeat);

// When a "POST" request comes to "/api/admin/verify-payment",
// it runs both guards, then the `verifyPayment` function.
router.post('/verify-payment', protect, admin, verifyPayment);

// When a "GET" request comes to "/api/admin/offer-letter/:userId",
// it runs both guards, then the `generateOfferLetter` function.
router.get('/offer-letter/:userId', protect, admin, generateOfferLetter);

// Export the router for our main server file.
export default router;

