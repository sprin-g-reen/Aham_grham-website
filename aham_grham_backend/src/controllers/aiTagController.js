import AiTag from '../models/AiTag.js';

// @desc    Get all AI Tags
// @route   GET /api/aitags
// @access  Public
export const getAllAiTags = async (req, res) => {
  try {
    const tags = await AiTag.find().sort({ createdAt: -1 });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching AI Tags', error: error.message });
  }
};

// @desc    Create AI Tag
// @route   POST /api/aitags
// @access  Private (Admin)
export const createAiTag = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ message: 'Please provide both name and description' });
    }

    const newTag = await AiTag.create({ name, description });
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ message: 'Error creating AI Tag', error: error.message });
  }
};

// @desc    Delete AI Tag
// @route   DELETE /api/aitags/:id
// @access  Private (Admin)
export const deleteAiTag = async (req, res) => {
  try {
    console.log('Attempting to delete AI Tag with ID:', req.params.id);
    const tag = await AiTag.findById(req.params.id);
    
    if (!tag) {
      console.warn('AI Tag not found in DB for ID:', req.params.id);
      return res.status(404).json({ message: 'AI Tag not found' });
    }

    await tag.deleteOne();
    res.status(200).json({ message: 'AI Tag removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting AI Tag', error: error.message });
  }
};
