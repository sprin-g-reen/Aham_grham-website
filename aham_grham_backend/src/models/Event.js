import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  image: {
    type: String,
    default: 'no-event-photo.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Event model
const Event = mongoose.model('Event', eventSchema);

export default Event;
