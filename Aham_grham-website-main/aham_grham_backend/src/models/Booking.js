import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
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
  itemType: {
    type: String,
    enum: ['program', 'event'],
    required: true
  },
  eventId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: function() { return this.itemType === 'event'; }
  },
  programId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Program',
    required: function() { return this.itemType === 'program'; }
  },
  numberOfPeople: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Booking model
const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
