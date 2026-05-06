import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: 'D:/Aham-grham/Aham_grham-website/aham_grham_backend/.env' });

const listDBs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');
    
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('Databases:', dbs.databases.map(db => db.name));
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

listDBs();
