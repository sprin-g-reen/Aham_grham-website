import Footer from '../models/Footer.js';
import { logActivity } from '../utils/logger.js';

// @desc    Get footer data
// @route   GET /api/footer
// @access  Public
export const getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();
    
    // Create default footer if none exists
    if (!footer) {
      footer = await Footer.create({
        centers: ['Rishikesh, India', 'Swiss Alps, Switzerland', 'Ubud, Bali'],
        socialMedia: [
          { platform: 'Facebook', url: '#' },
          { platform: 'Instagram', url: '#' },
          { platform: 'YouTube', url: '#' },
          { platform: 'LinkedIn', url: '#' }
        ],
        contact: {
          email: 'contact@ahamgraham.com',
          phone: '+91 98765 43210'
        },
        slogan: 'bridging ancient wisdom with modern neurological insights. your path to biological transcendence begins here.'
      });
    }
    
    res.json(footer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update footer data
// @route   PUT /api/footer
// @access  Private (Admin)
export const updateFooter = async (req, res) => {
  try {
    const { centers, socialMedia, contact, slogan } = req.body;
    
    let footer = await Footer.findOne();
    
    if (footer) {
      footer.centers = centers || footer.centers;
      footer.socialMedia = socialMedia || footer.socialMedia;
      footer.contact = contact || footer.contact;
      footer.slogan = slogan || footer.slogan;
      footer.updatedAt = Date.now();
      
      const updatedFooter = await footer.save();
      await logActivity({
        action: 'UPDATE',
        module: 'Footer & Branding',
        description: `Updated footer settings and branding info`
      });
      res.json(updatedFooter);
    } else {
      const newFooter = await Footer.create({
        centers,
        socialMedia,
        contact,
        slogan
      });
      res.status(201).json(newFooter);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
