import express from 'express';
const router = express.Router();

import {
  submitStudentInfo,
  getStudentStatus,
  acceptAllotment,
  submitPaymentReceipt,
} from '../controllers/studentController.js';

import { protect } from '../middleware/authMiddleware.js';

// --- Define the "roads" for student actions ---
// Every single one of these routes is protected. A student MUST be logged in.

// When a "POST" request comes to "/api/students/submit",
// the `protect` guard will check their login ticket first.
// If valid, it will run the `submitStudentInfo` function.
router.post('/submit', protect, submitStudentInfo);

// When a "GET" request comes to "/api/students/status",
// the `protect` guard checks the ticket.
// If valid, it runs the `getStudentStatus` function.
router.get('/status', protect, getStudentStatus);

// When a "POST" request comes to "/api/students/accept",
// the `protect` guard checks the ticket.
// If valid, it runs the `acceptAllotment` function.
router.post('/accept', protect, acceptAllotment);

// When a "POST" request comes to "/api/students/payment",
// the `protect` guard checks the ticket.
// If valid, it runs the `submitPaymentReceipt` function.
router.post('/payment', protect, submitPaymentReceipt);

// Export the router for our main server file.
export default router;
