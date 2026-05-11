
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './src/models/Event.js';

dotenv.config();

const clearHighlights = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await Event.deleteMany({ category: 'Highlight' });
    console.log(`Successfully deleted ${result.deletedCount} highlights.`);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

clearHighlights();
