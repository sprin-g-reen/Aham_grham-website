import Testimonial from '../models/Testimonial.js';
import { logActivity } from '../utils/logger.js';

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
      await logActivity({
        action: 'CREATE',
        module: 'Testimonials',
        description: `Created testimonial for ${name} (${testimonialId})`
      });
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
      const { name, testimonialId } = testimonial;
      await testimonial.deleteOne();
      await logActivity({
        action: 'DELETE',
        module: 'Testimonials',
        description: `Deleted testimonial for ${name} (${testimonialId})`
      });
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
      await logActivity({
        action: 'UPDATE',
        module: 'Testimonials',
        description: `Updated testimonial for ${updatedTestimonial.name} (${updatedTestimonial.testimonialId})`
      });
      res.json(updatedTestimonial);
    } else {
      res.status(404).json({ message: 'Testimonial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Bulk create testimonials
// @route   POST /api/testimonials/bulk
// @access  Private/Admin
export const bulkCreateTestimonials = async (req, res) => {
  try {
    const { testimonials } = req.body;

    if (!Array.isArray(testimonials) || testimonials.length === 0) {
      return res.status(400).json({ message: 'Invalid testimonials data' });
    }

    // Filter out duplicates (check if testimonialId already exists in DB)
    const existingIds = (await Testimonial.find({}, 'testimonialId')).map(t => t.testimonialId);
    const newTestimonials = testimonials.filter(t => !existingIds.includes(t.testimonialId));

    if (newTestimonials.length === 0) {
      return res.status(400).json({ message: 'All testimonials in CSV already exist' });
    }

    const createdTestimonials = await Testimonial.insertMany(newTestimonials.map(t => ({
      ...t,
      rating: Number(t.rating || 5),
      image: t.image || ''
    })));

    await logActivity({
      action: 'IMPORT',
      module: 'Testimonials',
      description: `Imported ${createdTestimonials.length} testimonials via CSV`
    });

    res.status(201).json({
      message: `${createdTestimonials.length} testimonials imported successfully`,
      count: createdTestimonials.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
