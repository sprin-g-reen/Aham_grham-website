class TrueFocus {
  constructor(options = {}) {
    this.sentence = options.sentence || 'aham graham';
    this.containerId = options.containerId || 'focus-loader';
    this.blurAmount = options.blurAmount || 5;
    this.borderColor = options.borderColor || '#6366f1';
    this.glowColor = options.glowColor || 'rgba(99, 102, 241, 0.6)';
    this.animationDuration = options.animationDuration || 0.5;
    this.pauseBetweenAnimations = options.pauseBetweenAnimations || 1;

    this.currentIndex = 0;
    this.words = this.sentence.split(' ');
    this.container = document.getElementById(this.containerId);
    
    if (!this.container) return;

    this.init();
  }

  init() {
    this.render();
    this.wordElements = this.container.querySelectorAll('.focus-word');
    this.frame = this.container.querySelector('.focus-frame');
    
    window.addEventListener('resize', () => this.updateFocus(false));
    
    this.startAnimation();
    // Initial update
    setTimeout(() => this.updateFocus(true), 100);
  }

  render() {
    const wordsHtml = this.words
      .map((word, index) => `<span class="focus-word" data-index="${index}">${word}</span>`)
      .join('');

    this.container.innerHTML = `
      <div class="focus-container">
        ${wordsHtml}
        <div class="focus-frame">
          <span class="corner top-left"></span>
          <span class="corner top-right"></span>
          <span class="corner bottom-left"></span>
          <span class="corner bottom-right"></span>
        </div>
      </div>
    `;

    this.container.style.setProperty('--border-color', this.borderColor);
    this.container.style.setProperty('--glow-color', this.glowColor);
  }

  updateFocus(animate = true) {
    if (this.currentIndex >= this.wordElements.length) return;

    const activeWord = this.wordElements[this.currentIndex];
    
    // Update active class and blur
    this.wordElements.forEach((el, idx) => {
      if (idx === this.currentIndex) {
        el.classList.add('active');
        el.style.filter = 'blur(0px)';
      } else {
        el.classList.remove('active');
        el.style.filter = `blur(${this.blurAmount}px)`;
      }
      el.style.transition = `filter ${this.animationDuration}s ease, color ${this.animationDuration}s ease`;
    });

    // Calculate position
    const parentRect = this.container.querySelector('.focus-container').getBoundingClientRect();
    const activeRect = activeWord.getBoundingClientRect();

    const x = activeRect.left - parentRect.left;
    const y = activeRect.top - parentRect.top;
    const width = activeRect.width;
    const height = activeRect.height;

    if (window.gsap) {
      window.gsap.to(this.frame, {
        x: x,
        y: y,
        width: width,
        height: height,
        duration: animate ? this.animationDuration : 0,
        ease: "power2.inOut"
      });
    } else {
      this.frame.style.transition = animate ? `all ${this.animationDuration}s ease` : 'none';
      this.frame.style.transform = `translate(${x}px, ${y}px)`;
      this.frame.style.width = `${width}px`;
      this.frame.style.height = `${height}px`;
    }
  }

  startAnimation() {
    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.words.length;
      this.updateFocus();
    }, (this.animationDuration + this.pauseBetweenAnimations) * 1000);
  }

  stop() {
    clearInterval(this.interval);
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  const loader = new TrueFocus({
    sentence: 'aham grham',
    animationDuration: 0.8,
    pauseBetweenAnimations: 0.5
  });

  let isHiding = false;
  const hideLoader = () => {
    if (isHiding) return;
    isHiding = true;
    
    // Give it a moment to show the animation
    setTimeout(() => {
      const loaderEl = document.getElementById('focus-loader');
      if (loaderEl) {
        loaderEl.classList.add('loader-hidden');
        setTimeout(() => {
          loader.stop();
          loaderEl.remove();
        }, 800); // Wait for transition
      }
    }, 1000); // Minimum display time for impact
  };

  window.addEventListener('load', hideLoader);
  
  // Fallback: hide loader after 5 seconds regardless of load event
  setTimeout(hideLoader, 5000);
});
