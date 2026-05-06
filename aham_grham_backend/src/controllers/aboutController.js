import About from '../models/About.js';

// @desc    Get about page content
// @route   GET /api/about
// @access  Public
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      // Create default if not exists
      about = await About.create({});
    } else {
      // Ensure halfSections and other fields have defaults if they are empty
      let updated = false;
      if (!about.halfSections || about.halfSections.length === 0) {
        about.halfSections = [
          {
            title: 'architectural soul',
            content: 'our sanctuary design follows sacred proportions inspired by both references you shared, creating balance between grounded practice and reflective stillness. every curve and angle is designed to channel natural light, fostering a sense of openness and tranquility that mirrors the expansive nature of the human spirit.'
          },
          {
            title: 'breath of the earth',
            content: 'our daily practice is rooted in sustainability, intentional movement, and calm nervous-system support, so each class feels like a reset for both body and environment. we prioritize locally-sourced, non-toxic materials, ensuring that our presence is a healing force for the community and the planet alike.'
          }
        ];
        updated = true;
      }
      if (!about.faculties || !about.faculties.guides || about.faculties.guides.length === 0) {
        about.faculties = {
          title: 'spiritual guides',
          subtitle: 'the faculty who carry our lineage and walk the path with you.',
          guides: [
            {
              name: 'elena vance',
              role: 'breathwork and flow',
              bio: 'known for gentle sequencing that calms overactive minds and rebuilds confidence in movement. she integrates somatic movement and neuro-respiratory synchronization to help practitioners overcome physical plateaus and mental fog.',
              image: '22.jpg'
            }
          ]
        };
        updated = true;
      }
      if (updated) await about.save();
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update about page content
// @route   PUT /api/about
// @access  Private/Admin
export const updateAbout = async (req, res) => {
  try {
    let { hero, halfSections, corePhilosophy, lineageVoice, ancientLineage } = req.body;

    // Parse JSON strings if they come from FormData
    if (typeof hero === 'string') hero = JSON.parse(hero);
    if (typeof halfSections === 'string') halfSections = JSON.parse(halfSections);
    if (typeof corePhilosophy === 'string') corePhilosophy = JSON.parse(corePhilosophy);
    if (typeof lineageVoice === 'string') lineageVoice = JSON.parse(lineageVoice);
    if (typeof ancientLineage === 'string') ancientLineage = JSON.parse(ancientLineage);
    if (typeof req.body.faculties === 'string') req.body.faculties = JSON.parse(req.body.faculties);
    if (typeof req.body.cta === 'string') req.body.cta = JSON.parse(req.body.cta);

    let about = await About.findOne();

    if (!about) {
      about = new About();
    }

    if (hero) {
      about.hero.kicker = hero.kicker || about.hero.kicker;
      about.hero.title = hero.title || about.hero.title;
      about.hero.subtitle = hero.subtitle || about.hero.subtitle;
      if (req.files && req.files.heroImage) {
        about.hero.image = `/uploads/${req.files.heroImage[0].filename}`;
      }
    }

    if (halfSections) {
      about.halfSections = halfSections;
    }

    if (corePhilosophy) {
      about.corePhilosophy.title = corePhilosophy.title || about.corePhilosophy.title;
      about.corePhilosophy.content = corePhilosophy.content || about.corePhilosophy.content;
    }

    if (lineageVoice) {
      about.lineageVoice.title = lineageVoice.title || about.lineageVoice.title;
      about.lineageVoice.quote = lineageVoice.quote || about.lineageVoice.quote;
      about.lineageVoice.author = lineageVoice.author || about.lineageVoice.author;
    }

    if (ancientLineage) {
      about.ancientLineage.kicker = ancientLineage.kicker || about.ancientLineage.kicker;
      about.ancientLineage.content = ancientLineage.content || about.ancientLineage.content;
    }

    if (req.body.faculties) {
      const { title, subtitle, guides } = req.body.faculties;
      about.faculties.title = title || about.faculties.title;
      about.faculties.subtitle = subtitle || about.faculties.subtitle;
      if (guides) {
        about.faculties.guides = guides;
      }
    }

    if (req.body.cta) {
      const { title, subtitle, buttonText } = req.body.cta;
      about.cta.title = title || about.cta.title;
      about.cta.subtitle = subtitle || about.cta.subtitle;
      about.cta.buttonText = buttonText || about.cta.buttonText;
      if (req.files && req.files.ctaImage) {
        about.cta.image = `/uploads/${req.files.ctaImage[0].filename}`;
      }
    }

    about.updatedAt = Date.now();
    const updatedAbout = await about.save();
    res.json(updatedAbout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
