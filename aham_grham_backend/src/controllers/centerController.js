import Center from '../models/Center.js';
import { logActivity } from '../utils/logger.js';

export const getCenters = async (req, res) => {
  try {
    const centers = await Center.find().sort({ createdAt: -1 });
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCenter = async (req, res) => {
  try {
    const { name, location, description, status } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    
    const center = new Center({
      name,
      location,
      description,
      status,
      image
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

export const updateCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, description, status } = req.body;
    
    const updateData = { name, location, description, status };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedCenter = await Center.findByIdAndUpdate(id, updateData, { new: true });
    await logActivity({
      action: 'UPDATE',
      module: 'Centers',
      description: `Updated center: ${updatedCenter.name}`
    });
    res.json(updatedCenter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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
