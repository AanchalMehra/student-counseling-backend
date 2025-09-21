import StudentInfo from '../models/StudentInfo.js';
import Allotment from '../models/Allotment.js';
import User from '../models/User.js';

// @desc    Get all students with their marks
// @route   GET /api/admin/students
// @access  Private/Admin
const getAllStudents = (req, res) => {
  StudentInfo.find({}).populate('user', 'name email')
    .then(students => {
      // Manually calculate total marks for sorting if needed
      students.forEach(student => {
        student.intermediate.total = 
          (student.intermediate.physics || 0) + 
          (student.intermediate.chemistry || 0) + 
          (student.intermediate.maths || 0);
      });
      // Sort students in descending order of total marks
      students.sort((a, b) => b.intermediate.total - a.intermediate.total);
      res.status(200).json(students);
    })
    .catch(err => res.status(500).json({ message: 'Server Error' }));
};

// @desc    Allocate a seat to a student
// @route   POST /api/admin/allocate
// @access  Private/Admin
const allocateSeat = (req, res) => {
  const { userId, allocatedBranch } = req.body;
  if (!userId || !allocatedBranch) {
    return res.status(400).json({ message: 'Please provide userId and allocatedBranch' });
  }

  const allotmentData = {
    user: userId,
    allocatedBranch: allocatedBranch,
    status: 'Allocated',
  };

  // Use findOneAndUpdate with 'upsert' to create new or update existing allotment
  Allotment.findOneAndUpdate({ user: userId }, allotmentData, { new: true, upsert: true })
    .then(allotment => res.status(201).json(allotment))
    .catch(err => res.status(400).json({ message: 'Error allocating seat' }));
};

// @desc    Verify a student's payment
// @route   POST /api/admin/verify-payment
// @access  Private/Admin
const verifyPayment = (req, res) => {
  const { allotmentId } = req.body;
  if (!allotmentId) {
    return res.status(400).json({ message: 'Please provide allotmentId' });
  }

  Allotment.findByIdAndUpdate(allotmentId, { status: 'Payment Verified' }, { new: true })
    .then(allotment => {
      if (!allotment) {
        return res.status(404).json({ message: 'Allotment not found' });
      }
      res.status(200).json(allotment);
    })
    .catch(err => res.status(500).json({ message: 'Server Error' }));
};

// @desc    Generate an offer letter (placeholder)
// @route   GET /api/admin/offer-letter/:userId
// @access  Private/Admin
const generateOfferLetter = (req, res) => {
  const userId = req.params.userId;
  
  Allotment.findOne({ user: userId, status: 'Payment Verified' })
    .populate('user', 'name')
    .then(allotment => {
      if (!allotment) {
        return res.status(404).json({ message: 'Verified allotment for this user not found' });
      }
      // In a real app, you would generate a PDF here.
      // For now, we send a simple text response.
      const offerLetterText = `
        Dear ${allotment.user.name},
        Congratulations! You have been allocated the ${allotment.allocatedBranch} branch.
        Your payment has been verified. Welcome!
      `;
      res.header('Content-Type', 'text/plain');
      res.status(200).send(offerLetterText);
    })
    .catch(err => res.status(500).json({ message: 'Server Error' }));
};

export {
  getAllStudents,
  allocateSeat,
  verifyPayment,
  generateOfferLetter,
};

