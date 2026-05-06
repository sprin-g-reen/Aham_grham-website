import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: 'D:/Aham-grham/Aham_grham-website/aham_grham_backend/.env' });

const checkAham = async () => {
  try {
    // Try to find the database name in the URI or use ahamgrham1
    let uri = process.env.MONGO_URI;
    if (!uri.includes('ahamgrham1') && uri.includes('/?')) {
        uri = uri.replace('/?', '/ahamgrham1?');
    }
    
    await mongoose.connect(uri);
    console.log('Connected to:', mongoose.connection.name);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const coll of collections) {
      const count = await mongoose.connection.db.collection(coll.name).countDocuments();
      console.log(`Collection ${coll.name}: ${count} documents`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkAham();
