import Testimonial from '../models/Testimonial.js';

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export const createTestimonial = async (req, res) => {
  try {
    const { name, testimonialId, role, content, rating } = req.body;

    const testimonialExists = await Testimonial.findOne({ testimonialId });
    if (testimonialExists) {
      return res.status(400).json({ message: 'Testimonial ID already exists' });
    }

    const testimonial = await Testimonial.create({
      name,
      testimonialId,
      role,
      content,
      rating: Number(rating),
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });

    if (testimonial) {
      res.status(201).json(testimonial);
    } else {
      res.status(400).json({ message: 'Invalid testimonial data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
      await testimonial.deleteOne();
      res.json({ message: 'Testimonial removed' });
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = async (req, res) => {
  try {
    const { name, testimonialId, role, content, rating } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);

    if (testimonial) {
      testimonial.name = name || testimonial.name;
      testimonial.testimonialId = testimonialId || testimonial.testimonialId;
      testimonial.role = role || testimonial.role;
      testimonial.content = content || testimonial.content;
      testimonial.rating = rating ? Number(rating) : testimonial.rating;
      
      if (req.file) {
        testimonial.image = `/uploads/${req.file.filename}`;
      }

      const updatedTestimonial = await testimonial.save();
      res.json(updatedTestimonial);
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
