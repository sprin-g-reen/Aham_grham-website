import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  eventId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: [true, 'Please specify the number of people'],
    min: [1, 'At least 1 person is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Booking model
const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
