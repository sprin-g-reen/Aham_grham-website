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


