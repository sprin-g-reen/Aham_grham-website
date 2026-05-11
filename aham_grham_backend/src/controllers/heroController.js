import Hero from '../models/Hero.js';
import { logActivity } from '../utils/logger.js';

export const getHero = async (req, res) => {
  try {
    const page = req.query.page || 'home';
    let hero = await Hero.findOne({ page });

    // Provide sensible defaults based on page name
    const defaults = {
      about: { kicker: 'foundation of spirit', title: 'the inner landscape', subtitle: 'we are more than a yoga space. we are a living lineage where ancient breath science meets modern healing rhythm, one mindful step at a time.' },
      services: { kicker: 'experience transcendence', title: 'find your inner stillness', subtitle: 'precision-engineered yoga pathways designed for clinical results and spiritual depth.' },
      events: { kicker: 'communal resonance', title: 'sacred gatherings', subtitle: 'from global summits to intimate retreats, join us in spaces designed for collective awakening and profound clinical stillness.' },
      centers: { kicker: 'sanctuary network', title: 'our centers', subtitle: 'discover a network of portals designed to elevate your spirit. each sanctuary is a living manifestation of peace, blending sacred geometry with modern neurological hospitality.' },
      home: { kicker: 'experience stillness', title: 'the journey back to yourself', subtitle: 'a sanctuary for deep practice, clinical wisdom, and the preservation of ancestral lineages.' },
      'sacred-moon-oil': { kicker: 'sacred apothecary', title: 'sacred moon oil', subtitle: 'a biological bridge to higher resonance. crafted during the lunar peak, this oil is a manifestation of ancient alchemy and modern clinical stillness.' }
    };

    const pageDefaults = defaults[page] || defaults.home;

    if (!hero) {
      hero = await Hero.create({ 
        page,
        kicker: pageDefaults.kicker,
        title: pageDefaults.title,
        subtitle: pageDefaults.subtitle,
        buttonText: 'explore our path',
        sections: {}
      });
    }

    // --- Ensure Section Defaults Exist ---
    let modified = false;
    if (!hero.sections) {
      hero.sections = {};
      modified = true;
    }

    if (page === 'home') {
      if (!hero.sections.experience) {
        hero.sections.experience = {
          title: 'experience of yoga',
          description: 'our classes are designed for real life, with simple sequences that ease stiffness, improve posture, and help you feel more grounded from morning to night.',
          yoga: { title: 'yoga', description: 'from beginner-friendly flows to restorative practice, we focus on alignment, breath awareness, and gentle progress that supports long-term wellness.' },
          meditation: { title: 'meditation', description: 'each program blends stretching, balance, and relaxation so you can release tension, move with confidence, and stay connected to your body.' }
        };
        modified = true;
      }
      if (!hero.sections.programs) {
        hero.sections.programs = { title: 'our programs', description: 'precision-engineered yoga pathways designed for clinical results and spiritual depth.' };
        modified = true;
      }
      if (!hero.sections.blog) {
        hero.sections.blog = { title: 'blog', description: 'upcoming events, workshops, and retreat highlights from our growing community.' };
        modified = true;
      }
      if (!hero.sections.cta) {
        hero.sections.cta = { title: 'your healing path awaits', description: 'whether in the high himalayas or the crisp air of the alps, your journey to soulful clinical healing starts with a single step.' };
        modified = true;
      }
    }

    if (page === 'services') {
      if (!hero.sections.programs) {
        hero.sections.programs = { title: 'Our Programs', description: 'precision-engineered yoga pathways designed for clinical results and spiritual depth.' };
        modified = true;
      }
      if (!hero.sections.products) {
        hero.sections.products = { title: 'products' };
        modified = true;
      }
    }

    if (page === 'events') {
      if (!hero.sections.mainEvents) {
        hero.sections.mainEvents = { title: 'Main Events', description: 'curated experiences that bridge ancient wisdom with modern neurological transformation.' };
        modified = true;
      }
      if (!hero.sections.highlights) {
        hero.sections.highlights = { title: 'Highlights', description: 'glimpses into the energy and resonance of our recent gatherings.' };
        modified = true;
      }
      if (!hero.sections.workshop) {
        hero.sections.workshop = { title: 'workshop', description: 'intensive protocols for masters of breath and stillness.' };
        modified = true;
      }
      if (!hero.sections.upcoming) {
        hero.sections.upcoming = { title: 'upcoming events', description: 'Synchronize with our next gatherings' };
        modified = true;
      }
    }

    if (page === 'centers') {
      if (!hero.sections.mainCenters) {
        hero.sections.mainCenters = { title: 'Our Centers', description: 'Each of our physical locations is meticulously engineered to provide biological synchronization and spiritual depth.' };
        modified = true;
      }
      if (!hero.sections.stats) {
        hero.sections.stats = { active: '12', soon: '4' };
        modified = true;
      }
      if (!hero.sections.cta) {
        hero.sections.cta = { title: 'Find Your Sanctuary Anywhere', description: 'Our digital classes and guided meditations are available worldwide for those who cannot visit our physical portals.' };
        modified = true;
      }
    }

    if (modified) {
      hero.markModified('sections');
      await hero.save();
    }

    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHero = async (req, res) => {
  try {
    const page = req.body.page || 'home';
    let hero = await Hero.findOne({ page });
    
    if (!hero) {
      hero = new Hero({ page });
    }

    hero.kicker = req.body.kicker || hero.kicker;
    hero.title = req.body.title || hero.title;
    hero.subtitle = req.body.subtitle || hero.subtitle;
    hero.buttonText = req.body.buttonText || hero.buttonText;

    if (req.file) {
      hero.image = `/uploads/${req.file.filename}`;
    }

    if (req.body.sections) {
      try {
        const sectionsData = typeof req.body.sections === 'string' 
          ? JSON.parse(req.body.sections) 
          : req.body.sections;
        hero.sections = sectionsData;
        hero.markModified('sections');
      } catch (e) {
        console.error("Failed to parse sections JSON", e);
      }
    }

    hero.updatedAt = Date.now();
    const updatedHero = await hero.save();
    
    await logActivity({
      action: 'UPDATE',
      module: 'Page Content',
      description: `Updated content for the ${page} page`
    });

    res.json(updatedHero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
