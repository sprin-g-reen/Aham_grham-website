import Activity from '../models/Activity.js';

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private/Admin
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({}).sort({ createdAt: -1 }).limit(100);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear all activities (Optional)
// @route   DELETE /api/activities
// @access  Private/Admin
export const clearActivities = async (req, res) => {
  try {
    await Activity.deleteMany({});
    res.json({ message: 'Activity log cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
