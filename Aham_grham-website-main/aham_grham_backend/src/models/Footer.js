import mongoose from 'mongoose';

const footerSchema = new mongoose.Schema({
  centers: [{
    type: String,
    trim: true
  }],
  socialMedia: [{
    platform: { type: String, required: true },
    url: { type: String, required: true }
  }],
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  slogan: {
    type: String,
    required: true,
    default: 'bridging ancient wisdom with modern neurological insights. your path to biological transcendence begins here.'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Footer = mongoose.model('Footer', footerSchema);

export default Footer;
