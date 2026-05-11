import Event from '../models/Event.js';
import { logActivity } from '../utils/logger.js';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (base64Str) => {
  if (!base64Str || !base64Str.startsWith('data:')) return base64Str;
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Str);
    console.log('☁️ Cloudinary Upload Success:', uploadResponse.secure_url);
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return base64Str; // Fallback to Base64 if upload fails
  }
};

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

    let imageUrl = req.body.image || '';
    let videoUrl = req.body.video || '';

    if (imageUrl && imageUrl.startsWith('data:')) {
      imageUrl = await uploadToCloudinary(imageUrl);
    } else if (req.files?.image) {
      imageUrl = `/uploads/${req.files.image[0].filename}`;
    }

    const event = await Event.create({
      name,
      eventId,
      bookingPrice: category === 'Highlight' ? 0 : Number(bookingPrice || 0),
      description,
      about,
      category,
      isBlog: isBlog === 'true' || isBlog === true,
      image: imageUrl,
      video: videoUrl || (req.files?.video ? `/uploads/${req.files.video[0].filename}` : '')
    });

    if (event) {
      await logActivity({
        action: 'CREATE',
        module: 'Events',
        description: `Created event ${name} (${eventId})`
      });
      res.status(201).json(event);
    }
  } catch (error) {
    console.error('❌ Error creating event:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Event ID must be unique' });
    }
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
      event.bookingPrice = category === 'Highlight' ? 0 : (bookingPrice !== undefined ? Number(bookingPrice) : event.bookingPrice);
      event.description = description || event.description;
      event.about = about || event.about;
      event.category = category || event.category;
      event.isBlog = isBlog !== undefined ? isBlog : event.isBlog;

      // Handle Image update
      let imageUrl = req.body.image || event.image;
      if (imageUrl && imageUrl.startsWith('data:')) {
        imageUrl = await uploadToCloudinary(imageUrl);
      }
      event.image = imageUrl;

      // Handle Video update (from payload or previous state)
      event.video = req.body.video || event.video;

      const updatedEvent = await event.save();
      await logActivity({
        action: 'UPDATE',
        module: 'Events',
        description: `Updated event ${event.name} (${event.eventId})`
      });
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error('❌ Error updating event:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
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
