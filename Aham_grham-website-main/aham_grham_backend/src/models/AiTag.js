import mongoose from 'mongoose';

const aiTagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a tag name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AiTag = mongoose.model('AiTag', aiTagSchema);

export default AiTag;
