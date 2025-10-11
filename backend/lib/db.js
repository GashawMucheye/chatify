import mongoose, { connect } from 'mongoose';
import colors from 'colors';
import { config } from 'dotenv';
config();

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`db connected :${conn.connection.host}`.bgGreen.underline);
  } catch (error) {
    console.log(`db not connected`, error.message);
  }
};

export default connectDb;
