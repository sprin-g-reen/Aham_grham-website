import mongoose from 'mongoose';
import dotenv from 'dotenv';
import About from '../src/models/About.js';

dotenv.config({ path: '../.env' });

async function removeGuides() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aham_grham');
    const about = await About.findOne();
    if (about && about.faculties && about.faculties.guides) {
      // Keep only the first guide
      about.faculties.guides = about.faculties.guides.slice(0, 1);
      await about.save();
      console.log('Successfully removed Guide 2 and Guide 3');
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

removeGuides();
