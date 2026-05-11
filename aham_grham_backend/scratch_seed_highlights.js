
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './src/models/Event.js';

dotenv.config();

const seedHighlights = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const highlights = [
      {
        name: "Morning Serenity",
        eventId: "HL-001",
        category: "Highlight",
        description: "Capturing the first light of our dawn meditation.",
        about: "Our morning sessions focus on the transition from sleep to wakefulness, using gentle breathwork and visualization to set a clinical baseline for the day.",
        image: "", // Empty so it uses fallback until they upload
      },
      {
        name: "Sonic Immersion",
        eventId: "HL-002",
        category: "Highlight",
        description: "Deep resonance training in the sound dome.",
        about: "Experience the science of 432Hz. This highlight captures the collective focus during our neurological synchronization workshops.",
        image: "",
      },
      {
        name: "Community Flow",
        eventId: "HL-003",
        category: "Highlight",
        description: "Collective movement under the banyan tree.",
        about: "Movement is medicine. This session explored the somatic connections between individuals in a shared physical space.",
        image: "",
      },
      {
        name: "Clinical Stillness",
        eventId: "HL-004",
        category: "Highlight",
        description: "Advanced protocols for neurological rest.",
        about: "Stillness is not absence. It is the presence of total biological alignment. A glimpse into our most intensive rest protocols.",
        image: "",
      },
      {
        name: "Vedic Wisdom",
        eventId: "HL-005",
        category: "Highlight",
        description: "Evening discourse on ancient neurological systems.",
        about: "Bridging the gap between ancient texts and modern science. These sessions provide the intellectual framework for our physical practices.",
        image: "",
      }
    ];

    await Event.insertMany(highlights);
    console.log("Successfully seeded 5 sample highlights.");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedHighlights();
