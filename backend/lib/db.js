import mongoose, { connect } from 'mongoose';
import colors from 'colors';
import { ENV } from './env.js';

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log(`db connected :${conn.connection.host}`.bgGreen.underline);
  } catch (error) {
    console.log(`db not connected`, error.message);
  }
};

export default connectDb;
