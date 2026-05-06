import mongoose from 'mongoose';
import dotenv from 'dotenv';
import About from '../src/models/About.js';

dotenv.config({ path: '../.env' });

async function checkAbout() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aham_grham');
    const about = await About.findOne();
    console.log('Current About Content:', JSON.stringify(about, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkAbout();
