import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = (req, res) => {
  // Get the name, email, and password from the request body
  const { name, email, password } = req.body;

  // --- Basic Validation ---
  if (!name || !email || !password) {
    // If any field is missing, send a 400 Bad Request error
    return res.status(400).json({ message: 'Please include all fields' });
  }

  // --- Check if user already exists ---
  User.findOne({ email: email })
    .then(userExists => {
      if (userExists) {
        // If the email is already in the database, send a 400 error
        return res.status(400).json({ message: 'User already exists' });
      }

      // --- Encrypt the password ---
      // Generate a "salt" to hash the password
      bcrypt.genSalt(10, (err, salt) => {
        // Hash the password with the salt
        bcrypt.hash(password, salt, (err, hashedPassword) => {

          // --- Create the new user in the database ---
          User.create({
            name: name,
            email: email,
            password: hashedPassword, // Store the hashed password, not the original
          })
            .then(user => {
              // If user is created successfully, send back their info
              res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id), // Generate a secure token for them
              });
            })
            .catch(err => {
              res.status(400).json({ message: 'Invalid user data' });
            });
        });
      });
    })
    .catch(err => {
      res.status(500).json({ message: 'Server error' });
    });
};


// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = (req, res) => {
  // Get email and password from the request body
  const { email, password } = req.body;

  // Find the user in the database by their email
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        // If the user exists, compare the submitted password with the hashed password in the database
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (isMatch) {
            // If passwords match, send back user info and a new token
            res.status(200).json({
              _id: user._id,
              name: user.name,
              email: user.email,
              token: generateToken(user._id),
            });
          } else {
            // If passwords do not match, send an error
            res.status(401).json({ message: 'Invalid credentials' });
          }
        });
      } else {
        // If no user is found with that email, send an error
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

