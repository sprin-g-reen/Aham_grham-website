window.addEventListener("load", () => {
  document.body.classList.add("page-ready");
});

function handleBookSessionClick(e) {
  if (e) e.preventDefault();
  window.location.href = 'book-session.html';
}

const nav = document.querySelector(".menu-buttons");
const indicator = document.querySelector(".nav-indicator");
const buttons = document.querySelectorAll(".nav-btn");

function updateIndicator(el) {
  if (!nav || !indicator) return;

  if (!el) {
    indicator.classList.remove("visible");
    return;
  }
  const rect = el.getBoundingClientRect();
  const parentRect = nav.getBoundingClientRect();

  indicator.style.width = `${rect.width}px`;
  indicator.style.left = `${rect.left - parentRect.left}px`;
  indicator.classList.add("visible");
}

buttons.forEach((btn) => {
  btn.addEventListener("mouseenter", () => updateIndicator(btn));
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

if (nav) {
  nav.addEventListener("mouseleave", () => {
    updateIndicator(null);
  });
}

const testimonials = [
  {
    text: "Every session is a data point. Our students don't just feel better - they can prove it with numbers.",
    name: "Dr. Leila Ahmadi",
    role: "Clinical Research Director",
    initials: "LA",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80"
  },
  {
    text: "The teachers here hold space with such grace. I've found a stillness I never thought possible in my hectic city life.",
    name: "Dr. Arjun Graham",
    role: "Director of Neuroscience",
    initials: "AG",
    image: "https://images.unsplash.com/photo-1469571486292-b53601020f09?auto=format&fit=crop&w=1600&q=80"
  },
  {
    text: "Every session guides me back to clarity. My posture improved, but more importantly, my mind became quieter and lighter.",
    name: "Dr. Priya Nair",
    role: "Head of Biomechanics",
    initials: "PN",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1600&q=80"
  },
  {
    text: "The blend of breathwork and mindful flow gave me back my focus. I now carry that calm into every part of my day.",
    name: "James Whitfield",
    role: "Lead Breathwork Researcher",
    initials: "JW",
    image: "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1600&q=80"
  }
];

let index = 0;
let testimonialTimer = null;
let autoSwitchInterval = null;

function renderFacultyIndicators() {
  const indicatorEl = document.getElementById("facultyIndicators");
  if (!indicatorEl) return;

  indicatorEl.innerHTML = testimonials
    .map((_, i) => {
      const isActive = i === index ? " active" : "";
      return `<button class="faculty-dot${isActive}" type="button" aria-label="show testimonial ${i + 1}" onclick="setTestimonial(${i})"></button>`;
    })
    .join("");
}

function updateTestimonial() {
  const textEl = document.getElementById("testimonialText");
  const nameEl = document.getElementById("userName");
  const roleEl = document.getElementById("userRole");
  const quoteCard = document.getElementById("facultyQuoteCard");

  if (!textEl || !nameEl || !roleEl || !quoteCard) return;

  if (testimonialTimer) {
    clearTimeout(testimonialTimer);
  }

  quoteCard.classList.add("is-switching");

  testimonialTimer = setTimeout(() => {
    textEl.innerText = testimonials[index].text;
    nameEl.innerText = testimonials[index].name;
    roleEl.innerText = testimonials[index].role;
    quoteCard.style.backgroundImage = `url("${testimonials[index].image}")`;
    renderFacultyIndicators();
    quoteCard.classList.remove("is-switching");
    testimonialTimer = null;
  }, 180);
}

function startAutoSwitch() {
  stopAutoSwitch();
  autoSwitchInterval = setInterval(() => {
    setTestimonial(index + 1);
  }, 5000);
}

function stopAutoSwitch() {
  if (autoSwitchInterval) {
    clearInterval(autoSwitchInterval);
    autoSwitchInterval = null;
  }
}

function setTestimonial(nextIndex) {
  index = ((nextIndex % testimonials.length) + testimonials.length) % testimonials.length;
  updateTestimonial();
  startAutoSwitch(); // Reset timer on manual switch
}

function initRevealAnimation() {
  const targets = document.querySelectorAll(
    "section, .footer, .bento-item, .bento-blog-item"
  );

  targets.forEach((el) => el.setAttribute("data-reveal", ""));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

// Mobile Menu Toggle
function setupMobileMenu() {
  const hamburger = document.querySelector(".hamburger-btn");
  const mobileOverlay = document.querySelector(".mobile-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      mobileOverlay.classList.toggle("active");
      document.body.style.overflow = mobileOverlay.classList.contains("active") ? "hidden" : "";
    });

    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileOverlay.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }
}

// Initialize
updateTestimonial();
startAutoSwitch();
initRevealAnimation();

// Theme Toggle Logic
function setupThemeToggle() {
  const icons = document.querySelectorAll('.material-symbols-outlined');
  let lightBtn = null;
  let darkBtn = null;

  icons.forEach(icon => {
    if (icon.textContent.trim() === 'light_mode') lightBtn = icon.parentElement;
    if (icon.textContent.trim() === 'dark_mode') darkBtn = icon.parentElement;
  });

  if (!lightBtn || !darkBtn) return;

  function setTheme(isLight) {
    if (isLight) {
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      lightBtn.style.display = 'none';
      darkBtn.style.display = 'flex';
    } else {
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
      lightBtn.style.display = 'flex';
      darkBtn.style.display = 'none';
    }
    
    // Force redraw for canvas-based elements (like light-rays)
    // Multiple dispatches to ensure complex animations catch the visibility change
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      if (window.lightRays) window.lightRays.onResize();
    }, 50);
    
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      if (window.lightRays) window.lightRays.onResize();
    }, 150);
    
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      if (window.lightRays) window.lightRays.onResize();
    }, 300);

  }

  lightBtn.addEventListener('click', () => setTheme(true));
  darkBtn.addEventListener('click', () => setTheme(false));

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    setTheme(true);
  } else {
    setTheme(false);
  }
}
setupThemeToggle();


/* GLOBAL DETAIL MODAL LOGIC */
function injectDetailModal() {
    if (document.getElementById('programModal')) return;
    
    const modalHTML = `
        <div id="programModal" class="detail-modal">
            <div class="detail-close" onclick="closeProgramModal()">
                <span class="material-symbols-outlined">close</span>
            </div>
            <div class="detail-content">
                <img id="modalImg" src="" alt="" class="detail-image">
                <div class="detail-info">
                    <h2 id="modalTitle">Item Title</h2>
                    <p id="modalDesc" class="mb-4 text-primary font-bold">
                        Description goes here...
                    </p>
                    <div id="modalAbout" class="text-white/60 text-sm mb-6 whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto">
                        Detailed about content goes here...
                    </div>
                    <button id="modalBookBtn" class="btn-primary w-fit" onclick="handleBookSessionClick(event)">book this session</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function openProgramDetail(title, image, description, category, about) {
    const modal = document.getElementById('programModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImg = document.getElementById('modalImg');
    const modalDesc = document.getElementById('modalDesc');
    const modalAbout = document.getElementById('modalAbout');
    const bookBtn = document.getElementById('modalBookBtn');
    
    if (!modal || !modalTitle || !modalImg) return;
    
    modalTitle.innerText = title;
    modalImg.src = image;
    if (modalDesc && description) {
        modalDesc.innerText = description.toLowerCase();
    }
    if (modalAbout) {
        modalAbout.innerText = about || "";
        modalAbout.style.display = about ? 'block' : 'none';
    }

    // Logic for conditional booking button
    if (bookBtn) {
        // Only show for Workshops and Upcoming Events (or all programs if category is not provided)
        if (!category || category === 'Workshop' || category === 'Upcoming Event') {
            bookBtn.style.display = 'block';
        } else {
            bookBtn.style.display = 'none';
        }
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProgramModal() {
    const modal = document.getElementById('programModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Global click listener for all display cards
document.addEventListener('click', (e) => {
    // Check if clicked element or its parent is a card
    const card = e.target.closest('.bento-item, .bento-card, .bento-blog-item');
    if (card) {
        // If it's a link or button inside the card, let it handle the click
        if (e.target.closest('a, button')) return;

        const titleEl = card.querySelector('h3');
        const imgEl = card.querySelector('img');
        const description = card.getAttribute('data-description');
        const about = card.getAttribute('data-about');
        const category = card.getAttribute('data-category');
        
        if (titleEl && imgEl) {
            openProgramDetail(titleEl.innerText, imgEl.src, description, category, about);
        }
    }
});

// Initialize Dynamic Content
async function loadProgramsToServices() {
    const grid = document.querySelector('.programs-grid');
    if (!grid) return;

    try {
        const response = await fetch('http://localhost:5000/api/programs');
        const programs = await response.json();

        if (programs.length > 0) {
            // Clear static content
            grid.innerHTML = '';
            
            // Bento patterns for a cycle of 8 items
            const patterns = [
                'span-2-1', 'span-2-2', 'span-1-1', 'span-1-1',
                'span-2-2', 'span-2-1', 'span-1-1', 'span-1-1'
            ];

            programs.forEach((prog, i) => {
                const patternClass = patterns[i % patterns.length];
                const imgSrc = prog.image ? `http://localhost:5000${prog.image}` : 'assets/AhamGraham-Web/placeholder.png';
                
                const cardHTML = `
                    <div class="bento-card ${patternClass}" 
                         data-description="${prog.description || ''}">
                        <img src="${imgSrc}" alt="${prog.name || ''}">
                        <div>
                            <h3>${(prog.name || '').toLowerCase()}</h3>
                        </div>
                    </div>
                `;
                grid.insertAdjacentHTML('beforeend', cardHTML);
            });
            
            // Re-initialize reveal animations for new items
            initRevealAnimation();
        }
    } catch (error) {
        console.error("Failed to load programs:", error);
    }
}

async function loadProgramsToHome() {
    const grid = document.querySelector('.bento-grid');
    if (!grid || document.querySelector('.programs-grid')) return; // Avoid running on services page

    try {
        const response = await fetch('http://localhost:5000/api/programs');
        const programs = await response.json();

        if (programs.length > 0) {
            // Clear static content
            grid.innerHTML = '';
            
            // Bento patterns for index page
            const patterns = [
                'row-2', 'span-2', '', '', 
                'span-2 row-2 brand-card', // Brand card placeholder (we'll handle it)
                '', '', 'row-2', '', 'span-2'
            ];

            const brandCardHTML = `
                <div class="bento-item span-2 row-2 brand-card">
                  <div class="brand-card-content">
                    <img src="assets/logo_transparent.png" alt="Aham Graham Logo" class="brand-logo-large">
                    <p class="brand-motto">return to your inner home</p>
                  </div>
                </div>
            `;

            let progIndex = 0;
            for (let i = 0; i < 10; i++) {
                if (i === 4) { // Insert brand card at 5th position
                    grid.insertAdjacentHTML('beforeend', brandCardHTML);
                    continue;
                }

                if (progIndex < programs.length) {
                    const prog = programs[progIndex];
                    const patternClass = patterns[i] || '';
                    const imgSrc = prog.image ? `http://localhost:5000${prog.image}` : 'assets/AhamGraham-Web/placeholder.png';
                    
                    const cardHTML = `
                        <div class="bento-item ${patternClass}" 
                             data-description="${prog.description || ''}">
                            <img src="${imgSrc}" alt="${prog.name || ''}" style="cursor: pointer;">
                            <div class="bento-overlay" onclick="event.stopPropagation(); window.location.href='services.html'" style="cursor: pointer;">
                                <div class="bento-content">
                                    <h3>${(prog.name || '').toLowerCase()}</h3>
                                </div>
                            </div>
                        </div>
                    `;
                    grid.insertAdjacentHTML('beforeend', cardHTML);
                    progIndex++;
                }
            }
            
            // Re-initialize reveal animations for new items
            initRevealAnimation();
        }
    } catch (error) {
        console.error("Failed to load programs for home:", error);
    }
}

async function loadEventsToBlog() {
    const grid = document.querySelector('.bento-blog-grid');
    if (!grid) return;

    try {
        const response = await fetch('http://localhost:5000/api/events');
        const events = await response.json();

        // Filter events that have isBlog set to true
        const blogEvents = events.filter(ev => ev.isBlog);

        if (blogEvents.length > 0) {
            // Clear static content
            grid.innerHTML = '';
            
            blogEvents.forEach((ev, i) => {
                const index = (i % 15) + 1; // 15 unique layouts c1-c15
                const imgSrc = ev.image ? `http://localhost:5000${ev.image}` : 'assets/AhamGraham-Web/placeholder.png';
                
                const cardHTML = `
                    <article class="bento-blog-item c${index}">
                        <img src="${imgSrc}" alt="${ev.name || ''}" style="cursor: pointer;">
                        <div class="bento-overlay" onclick="event.stopPropagation(); window.location.href='services.html'" style="cursor: pointer;">
                            <div class="blog-item-content">
                                <span class="category">${ev.category || 'Event'}</span>
                                <h3>${ev.name}</h3>
                                <p>${ev.description || ''}</p>
                            </div>
                        </div>
                    </article>
                `;
                grid.insertAdjacentHTML('beforeend', cardHTML);
            });
            
            // Re-initialize reveal animations
            initRevealAnimation();
        }
    } catch (error) {
        console.error("Failed to load blog events:", error);
    }
}

async function loadTestimonialsToHome() {
    const container = document.getElementById('testimonial-dome-container');
    if (!container || !window.DomeGallery) return;

    try {
        const response = await fetch('http://localhost:5000/api/testimonials');
        const dbTestimonials = await response.json();

        let baseTestimonials = [];
        
        if (dbTestimonials.length > 0) {
            baseTestimonials = dbTestimonials.map(t => ({
                src: t.image ? `http://localhost:5000${t.image}` : 'https://placehold.co/400x600/2c2c3a/white?text=' + t.name.charAt(0),
                name: t.name,
                role: t.role,
                text: t.content,
                alt: t.name
            }));
        } else {
            // Fallback to original static data if none in DB
            baseTestimonials = [
                {
                    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=776&auto=format&fit=crop',
                    name: 'Dr. Leila Ahmadi',
                    role: 'Clinical Research Director',
                    text: 'Every session is a data point. Our students don\'t just feel better - they can prove it with numbers.',
                    alt: 'Dr. Leila Ahmadi'
                },
                {
                    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=774&auto=format&fit=crop',
                    name: 'Marcus Thorne',
                    role: 'Professional Athlete',
                    text: 'The neurological synchronization techniques here transformed my recovery process completely.',
                    alt: 'Marcus Thorne'
                }
            ];
        }

        // Duplicate the data to fill the dense grid (min 20 items recommended for Dome)
        let testimonialData = [...baseTestimonials];
        while (testimonialData.length < 20) {
            testimonialData = [...testimonialData, ...baseTestimonials];
        }

        const isMobile = window.innerWidth <= 768;
        const mobileWidth = Math.floor(window.innerWidth * 0.98);
        const mobileHeight = Math.floor(window.innerHeight * 0.95);
        
        new DomeGallery(container, {
            images: testimonialData,
            fit: isMobile ? 1.1 : 0.8, 
            fitBasis: 'width',
            minRadius: 400,
            maxRadius: 2000,
            padFactor: isMobile ? 0.05 : 0.25,
            overlayBlurColor: '#05051a',
            openedImageWidth: isMobile ? `${mobileWidth}px` : '300px',
            openedImageHeight: isMobile ? `${mobileHeight}px` : '550px',
            imageBorderRadius: '30px',
            grayscale: false,
            segments: isMobile ? 30 : 55 
        });

    } catch (error) {
        console.error("Failed to load testimonials:", error);
    }
}

async function loadEventsToPage() {
    const mainGrid = document.getElementById('main-events-grid');
    const workshopGrid = document.getElementById('workshop-grid');
    const upcomingGrid = document.getElementById('upcoming-events-grid');
    const highlightGrid = document.getElementById('highlights-video-grid');

    if (!mainGrid && !workshopGrid && !upcomingGrid && !highlightGrid) return;

    try {
        const response = await fetch('http://localhost:5000/api/events');
        const events = await response.json();

        if (events.length > 0) {
            // Sort events by category
            const categorized = {
                'Main Event': [],
                'Workshop': [],
                'Highlight': [],
                'Upcoming Event': []
            };

            events.forEach(ev => {
                if (categorized[ev.category]) {
                    categorized[ev.category].push(ev);
                }
            });

            // Populate Main Events
            if (mainGrid && categorized['Main Event'].length > 0) {
                mainGrid.innerHTML = '';
                const mainPatterns = ['span-2', 'span-1', 'span-1', 'span-3', 'span-1', 'span-1', 'span-1', 'span-2'];
                categorized['Main Event'].forEach((ev, i) => {
                    const pattern = mainPatterns[i % mainPatterns.length];
                    mainGrid.insertAdjacentHTML('beforeend', createEventCard(ev, pattern));
                });
            }

            // Populate Workshops
            if (workshopGrid && categorized['Workshop'].length > 0) {
                workshopGrid.innerHTML = '';
                const workshopPatterns = ['sm:col-span-2 lg:col-span-2', 'sm:col-span-1 lg:col-span-1', 'sm:col-span-1 lg:col-span-1 lg:row-span-2', 'sm:col-span-1 lg:col-span-1'];
                categorized['Workshop'].forEach((ev, i) => {
                    const pattern = workshopPatterns[i % workshopPatterns.length];
                    workshopGrid.insertAdjacentHTML('beforeend', createEventCard(ev, pattern, true));
                });
            }

            // Populate Upcoming (Preserving Chroma Overlays)
            if (upcomingGrid && categorized['Upcoming Event'].length > 0) {
                upcomingGrid.innerHTML = '';
                const upcomingPatterns = ['span-1 chroma-card', 'span-1 chroma-card', 'span-2 chroma-card'];
                categorized['Upcoming Event'].forEach((ev, i) => {
                    const pattern = upcomingPatterns[i % upcomingPatterns.length];
                    upcomingGrid.insertAdjacentHTML('beforeend', createEventCard(ev, pattern));
                });
                
                // Re-add Chroma Overlays that were cleared
                upcomingGrid.insertAdjacentHTML('beforeend', `
                    <div class="chroma-overlay"></div>
                    <div class="chroma-fade"></div>
                `);
                
                // Re-initialize chroma effect if script is present
                if (window.initChromaEffect) window.initChromaEffect();
            }

            // Populate Highlights (Circular Gallery)
            const galleryContainer = document.getElementById('circular-gallery');
            if (galleryContainer && categorized['Highlight'].length > 0 && window.CircularGalleryApp) {
                galleryContainer.innerHTML = '';
                const highlightItems = categorized['Highlight'].map(ev => ({
                    image: ev.image ? `http://localhost:5000${ev.image}` : 'assets/AhamGraham-Web/placeholder.png',
                    text: ev.name
                }));
                new CircularGalleryApp(galleryContainer, { 
                    items: highlightItems, 
                    bend: 3, 
                    textColor: '#ffffff', 
                    borderRadius: 0.05, 
                    scrollEase: 0.02 
                });
            }

            // Re-initialize reveal animations
            initRevealAnimation();
        }
    } catch (error) {
        console.error("Failed to load events:", error);
    }
}

async function loadProductsToServices() {
    const grid = document.getElementById('dynamic-services-products');
    if (!grid) return;

    try {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();

        // Filter products for service page
        const serviceProducts = products.filter(p => p.isServicePage);

        if (serviceProducts.length > 0) {
            grid.innerHTML = '';
            
            serviceProducts.forEach(product => {
                const imgSrc = product.image && product.image !== 'no-photo.jpg' 
                    ? `http://localhost:5000/uploads/${product.image}` 
                    : 'https://images.unsplash.com/photo-1592179900431-1e021ea5c783?auto=format&fit=crop&q=80';
                
                const cardHTML = `
                    <div class="group cursor-pointer product-card rounded-[32px] shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 flex flex-col"
                         onclick="window.location.href='sacred-moon-oil.html'"
                         data-description="${product.description || ''}">
                        <img src="${imgSrc}" alt="${product.name}" class="w-full aspect-[4/3] object-cover rounded-t-[32px] transition-transform duration-500 group-hover:scale-105">
                        <div class="p-6">
                            <h3 class="text-white text-xl font-bold mb-1">${product.name}</h3>
                            <p class="text-gray-400 italic text-xs mb-4">${product.category || ''}</p>
                            <div class="flex justify-between items-center">
                                <p class="text-white font-bold text-xl">₹${product.price}</p>
                                <div class="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center group-hover:bg-[#3b82f6] transition-colors duration-300">
                                    <span class="material-symbols-outlined text-[#3b82f6] group-hover:text-white text-sm">shopping_bag</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                grid.insertAdjacentHTML('beforeend', cardHTML);
            });
            
            initRevealAnimation();
        }
    } catch (error) {
        console.error("Failed to load service products:", error);
    }
}

/**
 * Fetches and injects hero data for a specific page
 */
async function loadHeroForPage(pageName) {
    try {
        const response = await fetch(`http://localhost:5000/api/hero?page=${pageName}`);
        const hero = await response.json();

        if (hero) {
            const img = document.getElementById(`${pageName}-hero-image`);
            const kicker = document.getElementById(`${pageName}-hero-kicker`);
            const title = document.getElementById(`${pageName}-hero-title`);
            const subtitle = document.getElementById(`${pageName}-hero-subtitle`);

            if (img && hero.image) {
                img.src = hero.image.startsWith('/') ? `http://localhost:5000${hero.image}` : `assets/AhamGraham-Web/${hero.image}`;
            }
            if (kicker) kicker.innerText = hero.kicker;
            if (title) title.innerText = hero.title;
            if (subtitle) subtitle.innerText = hero.subtitle;
        }
    } catch (err) {
        console.error(`Error loading hero for ${pageName}:`, err);
    }
}

/**
 * Loads dynamic content into the About page
 */
async function loadAboutToPage() {
    const heroTitle = document.getElementById('about-hero-title');
    if (!heroTitle) return;

    try {
        const response = await fetch('http://localhost:5000/api/about');
        const about = await response.json();

        if (about) {
            // Hero
            if (about.hero) {
                const kicker = document.getElementById('about-hero-kicker');
                const subtitle = document.getElementById('about-hero-subtitle');
                const img = document.getElementById('about-hero-img');
                
                if (kicker) kicker.innerText = about.hero.kicker;
                if (heroTitle) heroTitle.innerText = about.hero.title;
                if (subtitle) subtitle.innerText = about.hero.subtitle;
                if (img && about.hero.image) {
                    img.src = about.hero.image.startsWith('/') ? `http://localhost:5000${about.hero.image}` : `assets/AhamGraham-Web/${about.hero.image}`;
                }
            }

            // Half Sections
            const halfContainer = document.getElementById('about-half-container');
            if (halfContainer && about.halfSections && about.halfSections.length > 0) {
                halfContainer.innerHTML = about.halfSections.map(section => `
                    <section class="about-card about-half">
                        <div>
                            <h2>${section.title}</h2>
                            <p>${section.content}</p>
                        </div>
                    </section>
                `).join('');
            }

            // Core Philosophy
            if (about.corePhilosophy) {
                const coreTitle = document.getElementById('about-core-title');
                const coreContent = document.getElementById('about-core-content');
                if (coreTitle) coreTitle.innerText = about.corePhilosophy.title;
                if (coreContent) coreContent.innerText = about.corePhilosophy.content;
            }

            // Lineage Voice
            if (about.lineageVoice) {
                const quoteTitle = document.getElementById('about-quote-title');
                const quoteText = document.getElementById('about-quote-text');
                const quoteAuthor = document.getElementById('about-quote-author');
                if (quoteTitle) quoteTitle.innerText = about.lineageVoice.title;
                if (quoteText) quoteText.innerText = about.lineageVoice.quote;
                if (quoteAuthor) quoteAuthor.innerText = about.lineageVoice.author;
            }

            // Ancient Lineage
            if (about.ancientLineage) {
                const miniKicker = document.getElementById('about-mini-kicker');
                const miniContent = document.getElementById('about-mini-content');
                if (miniKicker) miniKicker.innerText = about.ancientLineage.kicker;
                if (miniContent) miniContent.innerText = about.ancientLineage.content;
            }

            // Faculties
            if (about.faculties) {
                const facTitle = document.getElementById('about-faculties-title');
                const facSubtitle = document.getElementById('about-faculties-subtitle');
                const facGrid = document.getElementById('about-faculties-grid');

                if (facTitle) facTitle.innerText = about.faculties.title;
                if (facSubtitle) facSubtitle.innerText = about.faculties.subtitle;
                if (facGrid && about.faculties.guides) {
                    const displayGuides = about.faculties.guides.slice(0, 3);
                    facGrid.innerHTML = displayGuides.map(guide => `
                        <article class="guide-card">
                            <img src="${guide.image.startsWith('http') || guide.image.startsWith('/') ? guide.image : 'assets/' + guide.image}" alt="${guide.name}">
                            <div class="guide-content">
                                <h3>${guide.name}</h3>
                                <span class="guide-role">${guide.role}</span>
                                <p>${guide.bio}</p>
                            </div>
                        </article>
                    `).join('');
                }
            }

            // CTA
            if (about.cta) {
                const ctaTitle = document.getElementById('about-cta-title');
                const ctaSubtitle = document.getElementById('about-cta-subtitle');
                const ctaButton = document.getElementById('about-cta-button');
                const ctaSection = document.getElementById('about-cta-section');

                if (ctaTitle) ctaTitle.innerText = about.cta.title;
                if (ctaSubtitle) ctaSubtitle.innerText = about.cta.subtitle;
                if (ctaButton) ctaButton.innerText = about.cta.buttonText;
                if (ctaSection && about.cta.image) {
                    const imgUrl = about.cta.image.startsWith('/') ? `http://localhost:5000${about.cta.image}` : `assets/AhamGraham-Web/${about.cta.image}`;
                    ctaSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${imgUrl})`;
                    ctaSection.style.backgroundSize = 'cover';
                    ctaSection.style.backgroundPosition = 'center';
                }
            }
            
            initRevealAnimation();
        }
    } catch (error) {
        console.error("Failed to load about content:", error);
    }
}
/**
 * Loads dynamic centers into the Centers page
 */
async function loadCentersToPage() {
    const centersContainer = document.getElementById('centers-container');
    if (!centersContainer) return;

    try {
        const response = await fetch('http://localhost:5000/api/centers');
        const centers = await response.json();

        if (centers && centers.length > 0) {
            centersContainer.innerHTML = centers.map((center, index) => {
                const isReversed = index % 2 !== 0;
                const hasImage = !!center.image;
                const imageUrl = hasImage ? 'http://localhost:5000' + center.image : 'https://images.unsplash.com/photo-1544124499-17362c6ea00b?auto=format&fit=crop&w=1920&q=80';

                // Image Card (8 columns)
                const imageCard = `
                    <div class="md:col-span-8 group relative overflow-hidden rounded-[32px] bg-[#170529] shadow-2xl transition-all h-[480px]">
                        <img src="${imageUrl}" alt="${center.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                        <div class="absolute inset-0 bg-gradient-to-t from-[#170529]/40 to-transparent opacity-60"></div>
                    </div>
                `;

                // Info Card (4 columns)
                const infoCard = `
                    <div class="md:col-span-4 group flex flex-col bg-[#170529] rounded-[32px] overflow-hidden shadow-xl border border-white/5 h-[480px]">
                        <div class="p-10 flex-grow flex flex-col justify-center text-center text-white">
                            <div class="flex justify-center mb-6">
                                <span class="material-symbols-outlined text-4xl text-[#8c52ff]">architecture</span>
                            </div>
                            
                            <h3 class="text-2xl font-headline font-semibold mb-4 tracking-tight">${center.name}</h3>
                            
                            <p class="text-purple-200/70 text-sm italic leading-relaxed mb-8 line-clamp-6">
                                "${center.description}"
                            </p>
                            
                            <div class="h-px w-16 bg-white/10 mx-auto mb-8"></div>
                            
                            <div class="space-y-4">
                                <p class="text-white/60 text-[0.7rem] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                                    <span class="material-symbols-outlined text-sm">location_on</span> ${center.location}
                                </p>
                                <span class="inline-block px-4 py-1.5 rounded-full text-[0.65rem] uppercase tracking-widest font-bold bg-white/5 border border-white/10 ${center.status === 'opened' ? 'text-blue-400' : 'text-red-400'}">
                                    ${center.status}
                                </span>
                            </div>
                        </div>
                    </div>
                `;

                // Combine them in the correct order
                return isReversed ? (infoCard + imageCard) : (imageCard + infoCard);
            }).join('');
        }
    } catch (err) {
        console.error("Error loading centers:", err);
    }
}

function createEventCard(ev, patternClass, isWorkshop = false) {
    const imgSrc = ev.image ? `http://localhost:5000${ev.image}` : 'assets/AhamGraham-Web/placeholder.png';
    const overlayClass = isWorkshop ? '!bg-gradient-to-t !from-[#231f37]/80 !to-transparent' : '';
    const groupClass = isWorkshop ? 'group flex flex-col h-full' : '';
    
    return `
        <div class="bento-item ${patternClass} ${groupClass}" 
             data-description="${ev.description || ''}"
             data-about="${ev.about || ''}"
             data-category="${ev.category}">
            <img src="${imgSrc}" alt="${ev.name || ''}" class="${isWorkshop ? 'w-full h-full object-cover rounded-[28px]' : ''}">
            <div class="bento-overlay ${overlayClass}">
                <div class="bento-content ${isWorkshop ? 'mt-auto' : ''}">
                    <h3 class="${isWorkshop ? 'text-white' : ''}">${ev.name}</h3>
                    <p class="${isWorkshop ? 'text-white/80' : ''}">${ev.description?.substring(0, 60)}${ev.description?.length > 60 ? '...' : ''}</p>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we are on and load appropriate hero
    const path = window.location.pathname;
    const page = path.includes('about.html') ? 'about' :
                 path.includes('services.html') ? 'services' :
                 path.includes('events.html') ? 'events' :
                 path.includes('centers.html') ? 'centers' :
                 path.includes('shop.html') || path.includes('sacred-moon-oil.html') ? 'shop' : null;

    if (page) {
        loadHeroForPage(page);
    }

    if (path.includes('about.html')) {
        loadAboutToPage();
    }
    
    // Existing setup
    setupMobileMenu();
    injectDetailModal();
    loadProgramsToServices();
    loadProgramsToHome();
    loadEventsToBlog();
    loadEventsToPage();
    loadTestimonialsToHome();
    loadProductsToServices();
    loadAboutToPage();
    loadCentersToPage();

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProgramModal();
    });
    
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('programModal');
        if (e.target === modal) closeProgramModal();
    });
});



// Footer Accordion Logic
function setupFooterAccordion() {
  const headers = document.querySelectorAll('.footer-col h4');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      if (window.innerWidth <= 700) {
        const col = header.parentElement;
        col.classList.toggle('active');
      }
    });
  });
}
setupFooterAccordion();

// Global hook for the "Book Session" buttons (Bypass Auth for now)
window.handleBookSessionClick = function(event) {
    window.location.href = 'book-session.html';
};

window.handleAddToCartClick = function(event) {
    window.location.href = 'sacred-moon-oil.html';
};
