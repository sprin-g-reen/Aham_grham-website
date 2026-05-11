/**
 * Page Content Synchronization Script
 * Fetches dynamic content (Hero, Sections, About Us) from the backend
 * and updates the website elements in real-time.
 */

async function initPageContentSync() {
  const path = window.location.pathname;
  const pageName = path.split('/').pop().replace('.html', '') || 'home';
  
  // Determine if we're on the About page or a regular Hero-based page
  const isAboutPage = pageName === 'about';
  const apiUrl = isAboutPage 
    ? 'http://localhost:5000/api/about' 
    : `http://localhost:5000/api/hero?page=${pageName}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Failed to fetch content for ${pageName}`);
    const data = await response.json();

    if (isAboutPage) {
      syncAboutPage(data);
    } else {
      syncHeroPage(data, pageName);
    }
  } catch (error) {
    console.error('Page Content Sync Error:', error);
  }
}

/**
 * Updates a standard page with Hero and Sections data
 */
function syncHeroPage(data, pageName) {
  if (!data) return;

  // 1. Update Hero Section
  updateElement('[data-content="hero-kicker"]', data.kicker);
  updateElement('[data-content="hero-title"]', data.title);
  updateElement('[data-content="hero-subtitle"]', data.subtitle);
  
  if (data.image) {
    const heroImg = document.querySelector('[data-content="hero-image"]');
    if (heroImg) {
      // Correctly handle backend-served images
      const imgSrc = data.image.startsWith('http') ? data.image : `http://localhost:5000${data.image}`;
      if (heroImg.tagName === 'IMG') heroImg.src = imgSrc;
      else if (heroImg.tagName === 'IMAGE') heroImg.setAttribute('href', imgSrc);
      else heroImg.style.backgroundImage = `url(${imgSrc})`;
    }
  }

  // 2. Update Dynamic Sections (Recursive mapping)
  if (data.sections) {
    Object.keys(data.sections).forEach(sectionKey => {
      const section = data.sections[sectionKey];
      if (typeof section === 'object') {
        // Handle nested fields (like experience.yoga.title)
        syncNestedSection(section, sectionKey);
      } else {
        updateElement(`[data-content="section-${sectionKey}"]`, section);
      }
    });
  }
}

/**
 * Updates the About Us page specifically
 */
function syncAboutPage(data) {
  if (!data) return;

  // Hero
  updateElement('[data-content="about-hero-kicker"]', data.hero?.kicker);
  updateElement('[data-content="about-hero-title"]', data.hero?.title);
  updateElement('[data-content="about-hero-subtitle"]', data.hero?.subtitle);

  // Narrative Sections (Half Sections)
  if (data.halfSections && data.halfSections.length >= 2) {
    updateElement('[data-content="about-left-title"]', data.halfSections[0].title);
    updateElement('[data-content="about-left-content"]', data.halfSections[0].content);
    updateElement('[data-content="about-right-title"]', data.halfSections[1].title);
    updateElement('[data-content="about-right-content"]', data.halfSections[1].content);
  }

  // Core Philosophy
  updateElement('[data-content="about-philosophy-title"]', data.corePhilosophy?.title);
  updateElement('[data-content="about-philosophy-content"]', data.corePhilosophy?.content);

  // Bottom CTA
  updateElement('[data-content="about-cta-title"]', data.cta?.title);
  updateElement('[data-content="about-cta-subtitle"]', data.cta?.subtitle);
  updateElement('[data-content="about-cta-button"]', data.cta?.buttonText);
}

/**
 * Helper to sync nested section objects (e.g. sections.experience.yoga.title)
 */
function syncNestedSection(obj, parentKey) {
  Object.keys(obj).forEach(key => {
    const val = obj[key];
    if (typeof val === 'object' && val !== null) {
      syncNestedSection(val, `${parentKey}-${key}`);
    } else {
      updateElement(`[data-content="section-${parentKey}-${key}"]`, val);
    }
  });
}

/**
 * Safe element updater
 */
function updateElement(selector, value) {
  if (!value) return;
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.value = value;
    } else {
      el.innerHTML = value.replace(/\n/g, '<br>');
    }
  });
}

// Run on load
document.addEventListener('DOMContentLoaded', initPageContentSync);
