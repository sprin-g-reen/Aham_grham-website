import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Admin from './src/models/Admin.js';

dotenv.config();

const migrateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aham-grham');
    console.log('Connected to DB');
    
    // Find the old admin in the Users collection
    const oldAdmin = await User.findOne({ email: 'admin@123gmail.com' });
    
    if (oldAdmin) {
      // Check if already in Admin collection
      const existingAdmin = await Admin.findOne({ email: oldAdmin.email });
      
      if (!existingAdmin) {
        // Create in Admin collection
        // Note: Password is already hashed, so we need to prevent re-hashing or just use the hash
        const newAdmin = new Admin({
          name: oldAdmin.name,
          email: oldAdmin.email,
          password: oldAdmin.password, // We'll handle the pre-save hook issue by copying manually if needed
          role: 'admin'
        });
        
        // Save without triggering the pre-save password hash if possible, 
        // but Admin model will re-hash it if we just call save().
        // So we will just use the plain password if we know it, or update the hash directly.
        
        // Since we don't have the plain password, we'll create it and then update the hash
        await newAdmin.save();
        
        // Now update the hash back to the original one to ensure login works
        await Admin.updateOne({ _id: newAdmin._id }, { password: oldAdmin.password });
        
        console.log('Successfully migrated admin@123gmail.com to the Admin collection.');
      } else {
        console.log('Admin already exists in the new collection.');
      }
    } else {
      console.log('Old admin account not found in Users collection.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Migration Error:', error);
    process.exit(1);
  }
};

migrateAdmin();
