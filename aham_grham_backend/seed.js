import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Program from './src/models/Program.js';
import Event from './src/models/Event.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to seed data...');

    // Clear existing (optional, but safer to avoid duplicates if ID is unique)
    await Program.deleteMany({});
    await Event.deleteMany({});

    const programs = [
      {
        name: 'Private & Group',
        programId: 'PROG001',
        category: 'active path',
        description: 'Personalized neurological synchronization and collective energy movement.',
        bookingPrice: 150,
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600'
      },
      {
        name: 'Rehab & Recovery',
        programId: 'PROG002',
        category: 'ongoing',
        description: 'Clinical-grade restorative practices for injury healing and biological reset.',
        bookingPrice: 200,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600'
      },
      {
        name: 'Online Sanctuary',
        programId: 'PROG003',
        category: 'new member',
        description: 'Real-time digital guidance brought directly to your home practice.',
        bookingPrice: 50,
        image: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=600'
      }
    ];

    const events = [
      {
        name: 'Wellness Summit 2026',
        eventId: 'EVT001',
        category: 'Main Event',
        description: 'Join world leaders in neuroscience and spirituality for a 5-day immersion into collective awakening.',
        date: 'June 10-15',
        location: 'Rishikesh, India',
        bookingPrice: 500,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600'
      },
      {
        name: 'Mountain Silence',
        eventId: 'EVT002',
        category: 'Workshop',
        description: 'A deep immersion into neurological stillness and high-altitude somatic protocols.',
        date: 'July 20-27',
        location: 'Swiss Alps',
        bookingPrice: 800,
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600'
      }
    ];

    await Program.insertMany(programs);
    await Event.insertMany(events);

    console.log('✅ Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
