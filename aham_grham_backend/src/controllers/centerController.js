import Center from '../models/Center.js';
import { logActivity } from '../utils/logger.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get all centers
// @route   GET /api/centers
// @access  Public
export const getCenters = async (req, res) => {
  try {
    const centers = await Center.find().sort({ createdAt: -1 });
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a center
// @route   POST /api/centers
// @access  Private/Admin
export const createCenter = async (req, res) => {
  try {
    console.log('🏗️ Creating center with body:', { ...req.body, image: req.body.image ? 'Base64 data...' : 'None' });
    const { name, location, description, status, image } = req.body;
    
    let imageUrl = image || '';
    if (imageUrl && imageUrl.startsWith('data:')) {
      console.log('☁️ Uploading center image to Cloudinary...');
      imageUrl = await uploadToCloudinary(imageUrl);
    }

    console.log('✅ Final imageUrl for center:', imageUrl);

    const center = new Center({
      name,
      location,
      description,
      status,
      image: imageUrl
    });

    const savedCenter = await center.save();
    await logActivity({
      action: 'CREATE',
      module: 'Centers',
      description: `Created new center: ${name} in ${location}`
    });
    res.status(201).json(savedCenter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a center
// @route   PUT /api/centers/:id
// @access  Private/Admin
export const updateCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, description, status, image } = req.body;

    const center = await Center.findById(id);
    if (center) {
      console.log('🔄 Updating center:', center.name);
      center.name = name || center.name;
      center.location = location || center.location;
      center.description = description || center.description;
      center.status = status || center.status;
      
      if (image && image.startsWith('data:')) {
        console.log('☁️ Uploading updated center image to Cloudinary...');
        center.image = await uploadToCloudinary(image);
      } else if (image) {
        center.image = image;
      }

      console.log('✅ Updated center imageUrl:', center.image);

      const updatedCenter = await center.save();
      await logActivity({
        action: 'UPDATE',
        module: 'Centers',
        description: `Updated center: ${updatedCenter.name}`
      });
      res.json(updatedCenter);
    } else {
      res.status(404).json({ message: 'Center not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a center
// @route   DELETE /api/centers/:id
// @access  Private/Admin
export const deleteCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const center = await Center.findById(id);
    const name = center ? center.name : id;
    await Center.findByIdAndDelete(id);
    await logActivity({
      action: 'DELETE',
      module: 'Centers',
      description: `Deleted center: ${name}`
    });
    res.json({ message: 'Center deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
