/**
 * ScrollVelocity - Vanilla JS implementation
 * Mimics the ScrollVelocity component from React Bits
 */

class ScrollVelocity {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    // Prevent multiple initializations on the same element
    if (this.container.dataset.velocityInitialized) {
      console.warn('ScrollVelocity already initialized on', containerSelector);
      return;
    }
    this.container.dataset.velocityInitialized = 'true';

    this.options = {
      velocity: options.velocity || 1,
      direction: options.direction || 1, 
      numCopies: options.numCopies || 10, // Increased for smoother coverage
      damping: 0.1,
      velocityMultiplier: 0.2,
      ...options
    };

    this.currentVelocity = this.options.velocity;
    this.targetVelocity = this.options.velocity;
    this.scrollVelocity = 0;
    this.lastScrollY = window.scrollY;
    this.x = 0;

    // Wait for fonts/layout to be ready
    if (document.readyState === 'complete') {
      this.init();
    } else {
      window.addEventListener('load', () => this.init());
    }
  }

  init() {
    const original = this.container.querySelector('.marquee-content');
    if (!original) return;

    // Set container styles
    this.container.style.overflow = 'hidden';
    this.container.style.width = '100%';
    
    // Create a track to hold clones
    this.track = document.createElement('div');
    this.track.style.display = 'flex';
    this.track.style.width = 'max-content';
    this.track.style.willChange = 'transform';
    this.track.style.backfaceVisibility = 'hidden';
    this.track.style.perspective = '1000px';
    this.track.style.transformStyle = 'preserve-3d';
    
    // Clear and clone
    const content = original.innerHTML;
    this.container.innerHTML = '';
    
    for (let i = 0; i < this.options.numCopies; i++) {
      const copy = document.createElement('div');
      copy.className = 'marquee-content';
      copy.style.flexShrink = '0';
      copy.innerHTML = content;
      this.track.appendChild(copy);
    }
    
    this.track.style.width = '100000px'; // Set a very large width to prevent accidental wrapping
    
    this.container.appendChild(this.track);
    
    // Small delay to ensure layout is computed before measuring
    requestAnimationFrame(() => {
      const firstCopy = this.track.firstElementChild;
      if (firstCopy) {
        this.copyWidth = firstCopy.getBoundingClientRect().width;
        
        window.addEventListener('resize', () => {
          const firstCopy = this.track.firstElementChild;
          if (firstCopy) {
            this.copyWidth = firstCopy.getBoundingClientRect().width;
          }
        });

        this.animate();
        this.listen();
      }
    });
  }

  listen() {
    // Scroll tracking disabled to maintain constant speed
  }

  animate() {
    // Move X
    this.x -= this.options.velocity * this.options.direction;

    // 6. Loop X seamlessly - using a more stable conditional wrap
    if (this.x <= -this.copyWidth) {
      this.x += this.copyWidth;
    } else if (this.x > 0) {
      this.x -= this.copyWidth;
    }

    // 7. Apply transform
    this.track.style.transform = `translate3d(${this.x.toFixed(3)}px, 0, 0)`;

    requestAnimationFrame(() => this.animate());
  }
}

window.ScrollVelocity = ScrollVelocity;


/**
// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Row 1: Left
  new ScrollVelocity('#marquee-1', {
    velocity: 0.8, // Reduced speed
    direction: 1
  });

  // Row 2: Right
  new ScrollVelocity('#marquee-2', {
    velocity: 0.8, // Reduced speed
    direction: -1
  });
});
**/

