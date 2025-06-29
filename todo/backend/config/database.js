const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    // Use environment variable or fallback to a default MongoDB URI
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app';
    console.log('Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Please make sure MongoDB is running or set MONGO_URI in .env file');
    console.log('You can install MongoDB locally or use MongoDB Atlas');
    // Don't exit the process, let it continue with potential fallback
  }
};

module.exports = connectDB; 