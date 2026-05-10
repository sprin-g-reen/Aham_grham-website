import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: 'D:/Aham-grham/Aham_grham-website/aham_grham_backend/.env' });

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
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

checkDB();
