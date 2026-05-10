/**
 * ScrollVelocity - Vanilla JS implementation
 * Mimics the ScrollVelocity component from React Bits
 */

class ScrollVelocity {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    // Prevent multiple initializations on the same element
    if (this.container.dataset.velocityInitialized) return;
    this.container.dataset.velocityInitialized = 'true';

    this.options = {
      velocity: options.velocity || 1,
      direction: options.direction || 1, 
      numCopies: options.numCopies || 12,
      ...options
    };

    this.x = 0;
    this.copyWidth = 0;

    // Fix: Handle initialization for all ready states
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Use a small timeout to ensure other scripts (like ai-tags.js) have finished injecting content
      setTimeout(() => this.init(), 50);
    } else {
      window.addEventListener('load', () => this.init());
      document.addEventListener('DOMContentLoaded', () => this.init());
    }
  }

  init() {
    if (this.initialized) return;
    const original = this.container.querySelector('.marquee-content');
    if (!original) return;

    this.initialized = true;
    
    // Create a track to hold clones
    this.track = document.createElement('div');
    this.track.style.display = 'flex';
    this.track.style.width = 'max-content';
    this.track.style.willChange = 'transform';
    
    // Clear and clone
    const content = original.innerHTML;
    this.container.innerHTML = '';
    
    for (let i = 0; i < this.options.numCopies; i++) {
      const copy = document.createElement('div');
      copy.className = 'marquee-content';
      copy.style.flexShrink = '0';
      copy.style.display = 'inline-block';
      copy.innerHTML = content;
      this.track.appendChild(copy);
    }
    
    this.container.appendChild(this.track);
    
    // Start measuring loop
    this.measureAndStart();
  }

  measureAndStart() {
    const firstCopy = this.track.firstElementChild;
    if (!firstCopy) return;

    const width = firstCopy.getBoundingClientRect().width;
    
    if (width > 0) {
      this.copyWidth = width;
      this.animate();
      
      window.addEventListener('resize', () => {
        const first = this.track.firstElementChild;
        if (first) this.copyWidth = first.getBoundingClientRect().width;
      });
    } else {
      // If width is 0, layout isn't ready. Try again next frame.
      requestAnimationFrame(() => this.measureAndStart());
    }
  }

  animate() {
    if (!this.copyWidth) return;

    // Move X
    this.x -= this.options.velocity * this.options.direction;

    // Seamless loop logic
    if (this.x <= -this.copyWidth) {
      this.x += this.copyWidth;
    } else if (this.x > 0) {
      this.x -= this.copyWidth;
    }

    // Apply transform with translate3d for hardware acceleration
    this.track.style.transform = `translate3d(${this.x.toFixed(2)}px, 0, 0)`;

    this.raf = requestAnimationFrame(() => this.animate());
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

