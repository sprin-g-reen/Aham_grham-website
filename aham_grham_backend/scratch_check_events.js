import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const eventSchema = new mongoose.Schema({
    name: String,
    category: String,
    isBlog: Boolean,
    image: String
});

const Event = mongoose.model('Event', eventSchema);

async function checkEvents() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        const events = await Event.find({});
        console.log('Total Events:', events.length);
        events.forEach(ev => {
            console.log(JSON.stringify(ev, null, 2));
        });
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkEvents();
