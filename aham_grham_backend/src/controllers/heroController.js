import Hero from '../models/Hero.js';

export const getHero = async (req, res) => {
  try {
    const page = req.query.page || 'home';
    let hero = await Hero.findOne({ page });

    // Provide sensible defaults based on page name
    const defaults = {
      about: { kicker: 'our story', title: 'heritage of stillness', subtitle: 'preserving the sacred geometry of the soul through rigorous practice.' },
      services: { kicker: 'precision yoga', title: 'your path to healing', subtitle: 'clinical wisdom meets ancestral lineage.' },
      events: { kicker: 'sacred gatherings', title: 'connect in stillness', subtitle: 'immersive experiences for the modern seeker.' },
      centers: { kicker: 'physical sanctuaries', title: 'spaces of light', subtitle: 'visit our physical locations for deep immersion.' },
      shop: { kicker: 'sacred apothecary', title: 'tools for the soul', subtitle: 'hand-crafted oils and traditional tools.' },
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
    } else if (hero.title === 'the journey back to yourself' && page !== 'home') {
      // Auto-fix stale default record
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
