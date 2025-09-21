import StudentInfo from '../models/StudentInfo.js';
import Allotment from '../models/Allotment.js';
import User from '../models/User.js';// controllers/adminController.js
import mongoose from 'mongoose'; 


// Get all students with their marks and allotment status

const getAllStudents = async (req, res) => {
  try {
    const students = await StudentInfo.aggregate([
      // Stage 1: Populate user details (name, email)
      {
        $lookup: {
          from: 'users', // the name of the User collection in MongoDB
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      // Stage 2: Deconstruct the userDetails array to get an object
      {
        $unwind: '$userDetails',
      },
      // Stage 3: Populate allotment details
      {
        $lookup: {
          from: 'allotments', // the name of the Allotment collection
          localField: 'user',
          foreignField: 'user',
          as: 'allotmentDetails',
        },
      },
      // Stage 4: Deconstruct allotmentDetails (if it exists)
      {
        $unwind: {
          path: '$allotmentDetails',
          preserveNullAndEmptyArrays: true, // Keep students even if they have no allotment
        },
      },
      // Stage 5: Project the final shape of the data
      {
        $project: {
          _id: 1, // StudentInfo ID
          user: { // Nest user info
            _id: '$userDetails._id',
            name: '$userDetails.name',
            email: '$userDetails.email',
          },
          intermediate: 1, // Keep intermediate marks
          branchChoice1: 1,
          branchChoice2: 1,
          allotment: '$allotmentDetails', // Nest the full allotment document
        },
      },
    ]);

    // Manually calculate total marks for sorting
    students.forEach(student => {
      student.intermediate.total =
        (student.intermediate.physics || 0) +
        (student.intermediate.chemistry || 0) +
        (student.intermediate.maths || 0);
    });

    // Sort students in descending order of total marks
    students.sort((a, b) => b.intermediate.total - a.intermediate.total);

    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
    
//  Allocate a seat to a student
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

