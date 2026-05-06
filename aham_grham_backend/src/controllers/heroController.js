import Hero from '../models/Hero.js';

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
      home: { kicker: 'experience stillness', title: 'the journey back to yourself', subtitle: 'a sanctuary for deep practice.' }
    };

    const pageDefaults = defaults[page] || defaults.home;

    if (!hero) {
      hero = await Hero.create({ 
        page,
        kicker: pageDefaults.kicker,
        title: pageDefaults.title,
        subtitle: pageDefaults.subtitle,
        buttonText: 'explore our path'
      });
    } else if ((hero.title === 'the journey back to yourself' || 
                 hero.title === 'your story' || 
                 hero.title === 'heritage of stillness' ||
                 hero.title === 'spaces of light' ||
                 hero.title === 'your path to healing' ||
                 hero.title === 'sacred apothecary' ||
                 hero.title === 'connect in stillness') && page !== 'home') {
      // Auto-fix stale default record with actual website content
      hero.kicker = pageDefaults.kicker;
      hero.title = pageDefaults.title;
      hero.subtitle = pageDefaults.subtitle;
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

    hero.updatedAt = Date.now();
    const updatedHero = await hero.save();
    res.json(updatedHero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
