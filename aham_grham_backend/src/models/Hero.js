import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema({
  page: { type: String, default: 'home', unique: true },
  kicker: { type: String, default: 'experience stillness' },
  title: { type: String, default: 'the journey back to yourself' },
  subtitle: { type: String, default: 'a sanctuary for deep practice, clinical wisdom, and the preservation of ancestral lineages.' },
  buttonText: { type: String, default: 'explore our path' },
  image: { type: String, default: '' },
  sections: { type: mongoose.Schema.Types.Mixed, default: {} },
  updatedAt: { type: Date, default: Date.now }
});

const Hero = mongoose.model('Hero', HeroSchema);
export default Hero;
