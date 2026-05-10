import mongoose from 'mongoose';
const uri = 'mongodb://Interns:aham890@ac-igqqefz-shard-00-00.5bcmuy3.mongodb.net:27017,ac-igqqefz-shard-00-01.5bcmuy3.mongodb.net:27017,ac-igqqefz-shard-00-02.5bcmuy3.mongodb.net:27017/ahamgrham1?ssl=true&replicaSet=atlas-shard-0&authSource=admin&retryWrites=true&w=majority';
async function test() {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected successfully to Atlas!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to connect:', err.message);
    process.exit(1);
  }
}
test();
