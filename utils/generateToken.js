import jwt from 'jsonwebtoken';

// This is a small helper function that creates a secure token.
const generateToken = (id) => {
  // It takes a user's unique ID and signs it with your secret key from the .env file.
  // The token will expire in 30 days.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
