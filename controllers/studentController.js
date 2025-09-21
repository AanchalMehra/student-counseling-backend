import StudentInfo from '../models/StudentInfo.js';
import Allotment from '../models/Allotment.js';

// @desc    Submit student information
// @route   POST /api/students/submit
// @access  Private
const submitStudentInfo = (req, res) => {
  const { personal, highSchool, intermediate, branchChoices } = req.body;
  if (!personal || !highSchool || !intermediate || !branchChoices) {
    return res.status(400).json({ message: 'Please fill out all sections of the form' });
  }

  StudentInfo.create({
    user: req.user.id,
    personal,
    highSchool,
    intermediate,
    branchChoices,
  })
  .then(studentInfo => res.status(201).json(studentInfo))
  .catch(err => res.status(400).json({ message: 'Invalid data submitted' }));
};

// @desc    Check student status
// @route   GET /api/students/status
// @access  Private
const getStudentStatus = (req, res) => {
  Allotment.findOne({ user: req.user.id })
    .then(allotment => {
      if (allotment) {
        res.status(200).json(allotment);
      } else {
        res.status(200).json({ message: 'Seat has not been allocated yet.' });
      }
    })
    .catch(err => res.status(500).json({ message: 'Server error' }));
};

// @desc    Accept a seat allotment
// @route   POST /api/students/accept
// @access  Private
const acceptAllotment = (req, res) => {
  Allotment.findOneAndUpdate(
    { user: req.user.id, status: 'Allocated' },
    { status: 'Accepted' },
    { new: true }
  )
  .then(updatedAllotment => {
    if (updatedAllotment) {
      res.status(200).json(updatedAllotment);
    } else {
      res.status(404).json({ message: 'No allotment found to accept' });
    }
  })
  .catch(err => res.status(500).json({ message: 'Server error' }));
};

// @desc    Submit a payment receipt
// @route   POST /api/students/payment
// @access  Private
const submitPaymentReceipt = (req, res) => {
  const { transactionId, receiptUrl } = req.body;
  if (!transactionId || !receiptUrl) {
      return res.status(400).json({ message: 'Please provide transaction ID and receipt URL' });
  }

  Allotment.findOneAndUpdate(
      { user: req.user.id, status: 'Accepted' },
      {
          paymentDetails: {
              transactionId,
              receiptUrl,
          },
          status: 'Payment Submitted'
      },
      { new: true }
  )
  .then(updatedAllotment => {
      if (updatedAllotment) {
          res.status(200).json(updatedAllotment);
      } else {
          res.status(404).json({ message: 'No accepted allotment found to submit payment for' });
      }
  })
  .catch(err => res.status(500).json({ message: 'Server error' }));
};

export {
  submitStudentInfo,
  getStudentStatus,
  acceptAllotment,
  submitPaymentReceipt, // <-- The missing export is now added!
};

