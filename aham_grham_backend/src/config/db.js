import mongoose from 'mongoose';

/**
 * connectDB: Establishes a connection to MongoDB using Mongoose
 * Uses MONGO_URI from the environment variables (.env)
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
