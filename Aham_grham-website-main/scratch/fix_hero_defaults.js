import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../aham_grham_backend/.env') });

const HeroSchema = new mongoose.Schema({
  page: String,
  kicker: String,
  title: String,
  subtitle: String,
  buttonText: String,
  image: String
});

const Hero = mongoose.model('Hero', HeroSchema);

const defaults = {
  about: { kicker: 'our story', title: 'heritage of stillness', subtitle: 'preserving the sacred geometry of the soul through rigorous practice.' },
  services: { kicker: 'precision yoga', title: 'your path to healing', subtitle: 'clinical wisdom meets ancestral lineage.' },
  events: { kicker: 'sacred gatherings', title: 'connect in stillness', subtitle: 'immersive experiences for the modern seeker.' },
  centers: { kicker: 'physical sanctuaries', title: 'spaces of light', subtitle: 'visit our physical locations for deep immersion.' },
  shop: { kicker: 'sacred apothecary', title: 'tools for the soul', subtitle: 'hand-crafted oils and traditional tools.' },
  home: { kicker: 'experience stillness', title: 'the journey back to yourself', subtitle: 'a sanctuary for deep practice.' }
};

async function updateDefaults() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/aham_grham');
    console.log('Connected to MongoDB');

    for (const [page, data] of Object.entries(defaults)) {
      const hero = await Hero.findOne({ page });
      if (hero && hero.title === 'the journey back to yourself' && page !== 'home') {
        console.log(`Updating defaults for ${page}...`);
        await Hero.updateOne({ _id: hero._id }, {
          kicker: data.kicker,
          title: data.title,
          subtitle: data.subtitle
        });
      }
    }

    console.log('Update complete!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateDefaults();
