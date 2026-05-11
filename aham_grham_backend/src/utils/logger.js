import Activity from '../models/Activity.js';

/**
 * Log an admin activity to the database
 * @param {Object} params
 * @param {string} params.user - The user who performed the action
 * @param {string} params.action - CREATE, UPDATE, DELETE, IMPORT, LOGIN
 * @param {string} params.module - The section (e.g., Testimonials)
 * @param {string} params.description - Human readable description
 * @param {Object} [params.details] - Optional extra data
 * @param {string} [params.ip] - Optional IP address
 */
export const logActivity = async ({ user = 'Admin', action, module, description, details, ip }) => {
  try {
    await Activity.create({
      user,
      action,
      module,
      description,
      details,
      ip
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
