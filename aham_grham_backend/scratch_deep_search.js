import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: 'D:/Aham-grham/Aham_grham-website/aham_grham_backend/.env' });

const deepSearch = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');
    
    const admin = mongoose.connection.db.admin();
    const dbsResult = await admin.listDatabases();
    
    for (const dbInfo of dbsResult.databases) {
      if (['admin', 'local', 'config'].includes(dbInfo.name)) continue;
      
      console.log(`\n--- Checking Database: ${dbInfo.name} ---`);
      const db = mongoose.connection.useDb(dbInfo.name);
      const collections = await db.db.listCollections().toArray();
      
      for (const coll of collections) {
        const count = await db.db.collection(coll.name).countDocuments();
        if (count > 0) {
          console.log(`  [${coll.name}]: ${count} documents`);
          if (['programs', 'events', 'products'].includes(coll.name)) {
            const docs = await db.db.collection(coll.name).find({}).limit(1).toArray();
            console.log(`    Sample Name: ${docs[0].name || docs[0].title || 'No name field'}`);
          }
        }
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

deepSearch();
