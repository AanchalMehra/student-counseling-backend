import mongoose from 'mongoose';

// seat allotment information.
const allotmentSchema = mongoose.Schema({
  // Link this allotment to a specific user.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // It refers to a User document.
    unique: true, // A user can only have one allotment.
  },
  // The branch that the admin has allocated.
  allocatedBranch: {
    type: String,
    required: true,
  },
  // The student's decision on the allocated seat.
  status: {
    type: String,
    required: true,
    default: 'Pending', // Starts as 'Pending' until the student accepts or rejects.
  },
  // Information about the fee payment.
  paymentReceipt: {
    type: String, 
    default: '',
  },
  // admin verified the payment or not
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const Allotment = mongoose.model('Allotment', allotmentSchema);

export default Allotment;

