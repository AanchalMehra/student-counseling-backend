import mongoose from 'mongoose';
import dotenv from 'dotenv';

//look for a file named .env and load the variables from it.
dotenv.config();

// function to connect to our database.
const connectDB = () => {
  // mongoose.connect() tries to connect to the database using the link from our .env file.
  mongoose.connect(process.env.MONGO_URI)
    .then((conn) => {
      // The .then() block runs if the connection is successful.
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    })
    .catch((error) => {
      // The .catch() block runs if there was an error during connection.
      console.error(`Error: ${error.message}`);
      // exit the program 
      process.exit(1);
    });
};

//export function to use in main server.js file.
export default connectDB;

