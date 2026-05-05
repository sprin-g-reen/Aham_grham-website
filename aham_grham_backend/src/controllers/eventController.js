import Event from '../models/Event.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res) => {
  try {
    const { name, eventId, bookingPrice, description } = req.body;

    const eventExists = await Event.findOne({ eventId });

    if (eventExists) {
      return res.status(400).json({ message: 'Event ID already exists' });
    }

    const event = await Event.create({
      name,
      eventId,
      bookingPrice,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });

    if (event) {
      res.status(201).json(event);
    } else {
      res.status(400).json({ message: 'Invalid event data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res) => {
  try {
    const { name, eventId, bookingPrice, description } = req.body;
    const event = await Event.findById(req.params.id);

    if (event) {
      event.name = name || event.name;
      event.eventId = eventId || event.eventId;
      event.bookingPrice = bookingPrice || event.bookingPrice;
      event.description = description || event.description;
      
      if (req.file) {
        event.image = `/uploads/${req.file.filename}`;
      }

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
