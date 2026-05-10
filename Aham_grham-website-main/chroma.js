function initChromaEffect() {
  const chromaGrid = document.querySelector('.chroma-grid-container');
  const fadeOverlay = document.querySelector('.chroma-fade');
  const cards = document.querySelectorAll('.chroma-card');
  
  if (!chromaGrid) return;

  // Cleanup old listeners if any (optional but good practice)
  // Since we use GSAP quicksetters, we should ensure they target current elements
  const setX = gsap.quickSetter(chromaGrid, '--x', 'px');
  const setY = gsap.quickSetter(chromaGrid, '--y', 'px');
  const pos = { x: 0, y: 0 };
  const damping = 0.45;
  const ease = 'power3.out';

  // Initialize position
  const rect = chromaGrid.getBoundingClientRect();
  pos.x = rect.width / 2;
  pos.y = rect.height / 2;
  setX(pos.x);
  setY(pos.y);

  const moveTo = (x, y) => {
    gsap.to(pos, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX(pos.x);
        setY(pos.y);
      },
      overwrite: true
    });
  };

  // Use removeEventListener then addEventListener to prevent duplicates
  chromaGrid.removeEventListener('pointermove', chromaGrid._moveHandler);
  chromaGrid._moveHandler = (e) => {
    const r = chromaGrid.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    if (fadeOverlay) gsap.to(fadeOverlay, { opacity: 0, duration: 0.25, overwrite: true });
  };
  chromaGrid.addEventListener('pointermove', chromaGrid._moveHandler);

  chromaGrid.removeEventListener('pointerleave', chromaGrid._leaveHandler);
  chromaGrid._leaveHandler = () => {
    if (fadeOverlay) {
        gsap.to(fadeOverlay, {
            opacity: 1,
            duration: 0.6,
            overwrite: true
        });
    }
  };
  chromaGrid.addEventListener('pointerleave', chromaGrid._leaveHandler);

  // Individual Card Spotlight
  cards.forEach(card => {
    card.removeEventListener('mousemove', card._mouseHandler);
    card._mouseHandler = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };
    card.addEventListener('mousemove', card._mouseHandler);
  });
}

// Global initialization
window.initChromaEffect = initChromaEffect;
document.addEventListener('DOMContentLoaded', initChromaEffect);
