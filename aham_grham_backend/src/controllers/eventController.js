import Event from '../models/Event.js';
import { logActivity } from '../utils/logger.js';

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
    const { name, eventId, bookingPrice, description, about, category, isBlog } = req.body;

    const eventExists = await Event.findOne({ eventId });

    if (eventExists) {
      return res.status(400).json({ message: 'Event ID already exists' });
    }

    const event = await Event.create({
      name,
      eventId,
      bookingPrice: category === 'Highlight' ? 0 : bookingPrice,
      description,
      about,
      category,
      isBlog: isBlog === 'true' || isBlog === true,
      image: req.body.image || (req.files?.image ? `/uploads/${req.files.image[0].filename}` : ''),
      video: req.body.video || (req.files?.video ? `/uploads/${req.files.video[0].filename}` : '')
    });

    if (event) {
      await logActivity({
        action: 'CREATE',
        module: 'Events',
        description: `Created event ${name} (${eventId})`
      });
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
    const { name, eventId, bookingPrice, description, about, category, isBlog } = req.body;
    const event = await Event.findById(req.params.id);

    if (event) {
      event.name = name || event.name;
      event.eventId = eventId || event.eventId;
      event.bookingPrice = bookingPrice || event.bookingPrice;
      event.description = description || event.description;
      event.about = about || event.about;
      event.category = category || event.category;
      event.isBlog = isBlog !== undefined ? isBlog : event.isBlog;
      
      if (event.category === 'Highlight') {
        event.bookingPrice = 0;
      }

      if (req.body.image) {
        event.image = req.body.image;
      } else if (req.files?.image) {
        event.image = `/uploads/${req.files.image[0].filename}`;
      }

      if (req.body.video) {
        event.video = req.body.video;
      } else if (req.files?.video) {
        event.video = `/uploads/${req.files.video[0].filename}`;
      }

      const updatedEvent = await event.save();
      await logActivity({
        action: 'UPDATE',
        module: 'Events',
        description: `Updated event ${updatedEvent.name} (${updatedEvent.eventId})`
      });
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle blog status
// @route   PATCH /api/events/:id/toggle-blog
// @access  Private/Admin
export const toggleBlogStatus = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (event) {
            event.isBlog = !event.isBlog;
            const updatedEvent = await event.save();
            await logActivity({
                action: 'UPDATE',
                module: 'Events',
                description: `${updatedEvent.isBlog ? 'Added' : 'Removed'} event ${updatedEvent.name} ${updatedEvent.isBlog ? 'to' : 'from'} Blog`
            });
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
      const { name, eventId } = event;
      await event.deleteOne();
      await logActivity({
        action: 'DELETE',
        module: 'Events',
        description: `Deleted event ${name} (${eventId})`
      });
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
