import mongoose from 'mongoose';
const studentInfoSchema = mongoose.Schema({
  // It stores the unique ID of a user from our 'User' collection.
  user: {
    type: mongoose.Schema.Types.ObjectId, // The type is a special MongoDB ID.
    required: true,
    ref: 'User', // This tells mongoose that the ID belongs to a 'User'.
  },

  //Personal Information
  address: { type: String, required: true },
  phone: { type: String, required: true },

  //10th Marks
  highSchool: {
    maths: { type: Number, required: true },
    science: { type: Number, required: true },
    english: { type: Number, required: true },
    hindi: { type: Number, required: true },
  },

  // 12th Marks
  intermediate: {
    physics: { type: Number, required: true },
    chemistry: { type: Number, required: true },
    maths: { type: Number, required: true },
  },

  branchChoice1: { type: String, required: true },
  branchChoice2: { type: String, required: true },
});

const StudentInfo = mongoose.model('StudentInfo', studentInfoSchema);

export default StudentInfo;

