
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './src/models/Event.js';

dotenv.config();

const listEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const events = await Event.find({ category: 'Highlight' });
    console.log(JSON.stringify(events, null, 2));
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

listEvents();
