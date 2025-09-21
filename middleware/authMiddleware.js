import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//This is the "security guard" that checks if a user is logged in
const protect = (req, res, next) => {
  let token;

  // The token is usually sent in the "Authorization" header of a request.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Get the token from the header (and remove the "Bearer " part).
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using our secret key from the .env file.
      // This checks if the token is valid and hasn't expired.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. If the token is valid, `decoded` will contain the user's ID.
      // We can use this ID to find the user in our database.
      // We attach the user's data to the `req` object so that the next function
      // (like `submitStudentInfo`) can know who the logged-in user is.
      // We don't want to include the password, so we use `.select('-password')`.
      User.findById(decoded.id).select('-password')
        .then(user => {
            req.user = user;
            // 4. Everything is good! Let the user proceed to the requested page/action.
            next();
        })
        .catch(err => {
            res.status(401).json({ message: 'Not authorized, user not found' });
        });

    } catch (error) {
      // If `jwt.verify` fails (e.g., token is fake or expired), it will throw an error.
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If there's no token at all...
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


// --- This is an EXTRA security guard that checks if the user is an ADMIN ---
const admin = (req, res, next) => {
    // This middleware should run AFTER the `protect` middleware.
    // So, we should already have access to `req.user`.
    if (req.user && req.user.isAdmin) {
        // If the user exists and their `isAdmin` property is true, let them pass.
        next();
    } else {
        // If they are not an admin, deny access.
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

export { protect, admin };

