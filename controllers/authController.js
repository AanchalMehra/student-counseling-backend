import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
// In controllers/authController.js


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // --- Basic Validation ---
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please include all fields' });
  }

  try {
    // --- Check if user already exists ---
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // --- Encrypt the password ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- Create the new user in the database ---
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword, // Store the hashed password
    });

    if (user) {
      // If user is created successfully, send back their info
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // This will catch any errors from the database or bcrypt
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};
          
// In controllers/authController.js

// ... keep your imports and the registerUser function as they are ...

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (isMatch) {
            // If passwords match, send back user info including isAdmin status
            res.status(200).json({
              _id: user._id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin, // <-- THIS IS THE FIX
              token: generateToken(user._id),
            });
          } else {
            res.status(401).json({ message: 'Invalid credentials' });
          }
        });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Server error' });
    });
};



// @desc    Get current user's data
// @route   GET /api/auth/me
// @access  Private (needs a token)
const getMe = (req, res) => {
  // The 'protect' middleware has already found the user and attached it to the request.
  // We just send back the user's data.
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  };
  res.status(200).json(user);
};


// Export the functions to be used in other files
export {
  registerUser,
  loginUser,
  getMe, 
};

