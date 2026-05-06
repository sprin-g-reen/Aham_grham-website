import Booking from '../models/Booking.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { name, email, eventId, programId, itemType, numberOfPeople } = req.body;

    const booking = new Booking({
      user: req.user._id,
      name,
      email,
      eventId: itemType === 'event' ? eventId : undefined,
      programId: itemType === 'program' ? programId : undefined,
      itemType,
      numberOfPeople: numberOfPeople || 1
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('eventId')
      .populate('programId');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('eventId').populate('programId').populate('user', 'name email');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
