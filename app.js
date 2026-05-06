window.addEventListener("load", () => {
  document.body.classList.add("page-ready");
});

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
    const card = e.target.closest('.bento-item, .bento-card, .bento-blog-item, .product-card');
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
                            <img src="${imgSrc}" alt="${prog.name || ''}">
                            <div class="bento-overlay">
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
                        <img src="${imgSrc}" alt="${ev.name || ''}">
                        <div class="blog-item-content">
                            <span class="category">${ev.category || 'Event'}</span>
                            <h3>${ev.name}</h3>
                            <p>${ev.description || ''}</p>
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
    injectDetailModal();
    loadProgramsToServices();
    loadProgramsToHome();
    loadEventsToBlog();
    loadEventsToPage();
    
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
