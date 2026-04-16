import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Failed connecting to ${process.env.MONGO_URI}. Falling back to In-Memory MongoDB for demo mode...`);
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected at: ${mongoUri}`);
    } catch (memError) {
      console.error(`Local MongoDB Error: ${memError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
