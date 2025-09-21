import mongoose from 'mongoose';

// A schema is a blueprint for our data.
// This schema tells MongoDB what information every user will have.
const userSchema = mongoose.Schema({
  // The user's name,email,password
  name: {
    type: String, 
    required: true, 
  },
 
  email: {
    type: String, 
    required: true, 
    unique: true, 
  },
  
  password: {
    type: String, 
    required: true, 
  },
  // check if the user is a student or an admin.
  isAdmin: {
    type: Boolean, 
    required: true,
    default: false, // By default, every new user is NOT an admin.
  }
});
// A model is what we use to actually find, create, and save users in our database.
const User = mongoose.model('User', userSchema);
export default User;

