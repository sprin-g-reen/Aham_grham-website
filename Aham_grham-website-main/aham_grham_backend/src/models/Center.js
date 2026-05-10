import mongoose from 'mongoose';

const centerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['opened', 'closed'],
    default: 'opened'
  },
  image: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Center = mongoose.model('Center', centerSchema);
export default Center;
