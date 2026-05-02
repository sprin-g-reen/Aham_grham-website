/**
 * DomeGallery Vanilla JS Port
 * Based on React Bits DomeGallery
 */

class DomeGallery {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      images: [],
      fit: 0.5,
      fitBasis: 'auto',
      minRadius: 600,
      maxRadius: 1200,
      padFactor: 0.25,
      overlayBlurColor: '#05051a',
      maxVerticalRotationDeg: 5,
      dragSensitivity: 20,
      enlargeTransitionMs: 300,
      segments: 35,
      dragDampening: 0.6,
      openedImageWidth: '400px',
      openedImageHeight: '400px',
      imageBorderRadius: '30px',
      openedImageBorderRadius: '30px',
      grayscale: true,
      ...options
    };

    this.rotation = { x: 0, y: 0 };
    this.startRot = { x: 0, y: 0 };
    this.startPos = null;
    this.isDragging = false;
    this.hasMoved = false;
    this.inertiaRAF = null;
    this.isOpening = false;
    this.openStartedAt = 0;
    this.lastDragEndAt = 0;
    this.lockedRadius = null;

    this.init();
  }

  init() {
    this.items = this.buildItems(this.options.images, this.options.segments);
    this.render();
    this.setupResizeObserver();
    this.setupInteractions();
    this.applyTransform(0, 0);
    this.startAutoRotate();
  }

  startAutoRotate() {
    const speed = 0.06; // degrees per frame
    const step = () => {
      if (!this.isDragging && !this.inertiaRAF && !this.focusedEl) {
        this.rotation.y = ((this.rotation.y + speed + 180) % 360 + 360) % 360 - 180;
        this.applyTransform(0, this.rotation.y);
      }
      this.autoRotateRAF = requestAnimationFrame(step);
    };
    this.autoRotateRAF = requestAnimationFrame(step);
  }

  buildItems(pool, seg) {
    const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
    const evenYs = [-4, -2, 0, 2, 4];
    const oddYs = [-3, -1, 1, 3, 5];

    const coords = xCols.flatMap((x, c) => {
      const ys = c % 2 === 0 ? evenYs : oddYs;
      return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
    });

    const totalSlots = coords.length;
    if (pool.length === 0) return coords.map(c => ({ ...c, src: '', alt: '' }));

    const normalizedImages = pool.map(image => (typeof image === 'string' ? { src: image, alt: '' } : image));
    const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

    return coords.map((c, i) => ({
      ...c,
      src: usedImages[i].src,
      alt: usedImages[i].alt,
      name: usedImages[i].name || '',
      role: usedImages[i].role || '',
      text: usedImages[i].text || ''
    }));
  }

  render() {
    this.container.innerHTML = `
      <div class="sphere-root" style="--segments-x: ${this.options.segments}; --segments-y: ${this.options.segments};">
        <main class="sphere-main">
          <div class="stage">
            <div class="sphere"></div>
          </div>
          <div class="overlay"></div>
          <div class="overlay overlay--blur"></div>
          <div class="edge-fade edge-fade--top"></div>
          <div class="edge-fade edge-fade--bottom"></div>
          <div class="viewer">
            <div class="scrim"></div>
            <div class="frame"></div>
          </div>
        </main>
      </div>
    `;

    this.rootEl = this.container.querySelector('.sphere-root');
    this.sphereEl = this.container.querySelector('.sphere');
    this.viewerEl = this.container.querySelector('.viewer');
    this.scrimEl = this.container.querySelector('.scrim');
    this.frameEl = this.container.querySelector('.frame');
    this.mainEl = this.container.querySelector('.sphere-main');

    this.items.forEach((it, i) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'item';
      itemEl.dataset.src = it.src;
      itemEl.dataset.offsetX = it.x;
      itemEl.dataset.offsetY = it.y;
      itemEl.dataset.sizeX = it.sizeX;
      itemEl.dataset.sizeY = it.sizeY;
      itemEl.dataset.name = it.name;
      itemEl.dataset.role = it.role;
      itemEl.dataset.text = it.text;

      itemEl.style.setProperty('--offset-x', it.x);
      itemEl.style.setProperty('--offset-y', it.y);
      itemEl.style.setProperty('--item-size-x', it.sizeX);
      itemEl.style.setProperty('--item-size-y', it.sizeY);

      itemEl.innerHTML = `
        <div class="item__image" role="button" tabindex="0">
          <img src="${it.src}" draggable="false" alt="${it.alt}">
        </div>
      `;

      itemEl.querySelector('.item__image').addEventListener('click', (e) => this.onTileClick(e, itemEl));
      this.sphereEl.appendChild(itemEl);
    });
  }

  setupResizeObserver() {
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width);
      const h = Math.max(1, cr.height);
      const aspect = w / h;
      let basis;

      if (this.options.fitBasis === 'min') basis = Math.min(w, h);
      else if (this.options.fitBasis === 'max') basis = Math.max(w, h);
      else if (this.options.fitBasis === 'width') basis = w;
      else if (this.options.fitBasis === 'height') basis = h;
      else basis = aspect >= 1.3 ? w : Math.min(w, h);

      let radius = basis * this.options.fit;
      radius = Math.max(this.options.minRadius, Math.min(radius, this.options.maxRadius));
      this.lockedRadius = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(Math.min(w, h) * this.options.padFactor));
      this.rootEl.style.setProperty('--radius', `${this.lockedRadius}px`);
      this.rootEl.style.setProperty('--viewer-pad', `${viewerPad}px`);
      this.rootEl.style.setProperty('--overlay-blur-color', this.options.overlayBlurColor);
      this.rootEl.style.setProperty('--tile-radius', this.options.imageBorderRadius);
      this.rootEl.style.setProperty('--enlarge-radius', this.options.openedImageBorderRadius);
      this.rootEl.style.setProperty('--image-filter', this.options.grayscale ? 'grayscale(1)' : 'none');
      
      this.applyTransform(this.rotation.x, this.rotation.y);
    });
    ro.observe(this.rootEl);
  }

  applyTransform(xDeg, yDeg) {
    if (this.sphereEl) {
      this.sphereEl.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  }

  setupInteractions() {
    this.mainEl.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));
    
    this.scrimEl.addEventListener('click', () => this.closeItem());
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeItem();
    });
  }

  onPointerDown(e) {
    if (this.focusedEl) return;
    this.stopInertia();
    this.isDragging = true;
    this.hasMoved = false;
    this.startRot = { ...this.rotation };
    this.startPos = { x: e.clientX, y: e.clientY };
    this.lastPointerPos = { x: e.clientX, y: e.clientY, t: performance.now() };
    this.velocity = { x: 0, y: 0 };
  }

  onPointerMove(e) {
    if (this.focusedEl || !this.isDragging || !this.startPos) return;

    const dxTotal = e.clientX - this.startPos.x;
    const dyTotal = e.clientY - this.startPos.y;

    if (!this.hasMoved) {
      if (dxTotal * dxTotal + dyTotal * dyTotal > 16) this.hasMoved = true;
    }

    const nextY = ((this.startRot.y + dxTotal / this.options.dragSensitivity + 180) % 360 + 360) % 360 - 180;

    this.rotation = { x: 0, y: nextY };
    this.applyTransform(0, nextY);

    // Track velocity
    const now = performance.now();
    const dt = now - this.lastPointerPos.t;
    if (dt > 0) {
      this.velocity = {
        x: (e.clientX - this.lastPointerPos.x) / dt,
        y: (e.clientY - this.lastPointerPos.y) / dt
      };
    }
    this.lastPointerPos = { x: e.clientX, y: e.clientY, t: now };
  }

  onPointerUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.hasMoved) {
      this.lastDragEndAt = performance.now();
      this.startInertia(this.velocity.x, this.velocity.y);
    }
    this.hasMoved = false;
  }

  stopInertia() {
    if (this.inertiaRAF) {
      cancelAnimationFrame(this.inertiaRAF);
      this.inertiaRAF = null;
    }
  }

  startInertia(vx, vy) {
    const MAX_V = 1.4;
    let vX = Math.max(-MAX_V, Math.min(MAX_V, vx)) * 80;
    const friction = 0.94 + 0.055 * this.options.dragDampening;

    const step = () => {
      vX *= friction;
      
      if (Math.abs(vX) < 0.01) {
        this.inertiaRAF = null;
        return;
      }

      const nextY = ((this.rotation.y + vX / 200 + 180) % 360 + 360) % 360 - 180;

      this.rotation = { x: 0, y: nextY };
      this.applyTransform(0, nextY);
      this.inertiaRAF = requestAnimationFrame(step);
    };

    this.stopInertia();
    this.inertiaRAF = requestAnimationFrame(step);
  }

  onTileClick(e, itemEl) {
    if (this.hasMoved || performance.now() - this.lastDragEndAt < 80 || this.isOpening) return;
    this.openItem(itemEl);
  }

  openItem(itemEl) {
    this.isOpening = true;
    this.openStartedAt = performance.now();
    this.focusedEl = itemEl;
    this.rootEl.setAttribute('data-enlarging', 'true');

    const offsetX = parseFloat(itemEl.dataset.offsetX);
    const offsetY = parseFloat(itemEl.dataset.offsetY);
    const sizeX = parseFloat(itemEl.dataset.sizeX);
    const sizeY = parseFloat(itemEl.dataset.sizeY);

    // Calculate rotation to center the clicked item
    const unit = 360 / this.options.segments / 2;
    const itemRotY = unit * (offsetX + (sizeX - 1) / 2);
    const itemRotX = unit * (offsetY - (sizeY - 1) / 2);

    let rotYDelta = -(itemRotY + this.rotation.y) % 360;
    if (rotYDelta < -180) rotYDelta += 360;
    if (rotYDelta > 180) rotYDelta -= 360;
    const rotXDelta = -itemRotX - this.rotation.x;

    itemEl.style.setProperty('--rot-y-delta', `${rotYDelta}deg`);
    itemEl.style.setProperty('--rot-x-delta', `${rotXDelta}deg`);

    // Reference for positioning
    const refDiv = document.createElement('div');
    refDiv.className = 'item__image item__image--reference';
    refDiv.style.opacity = '0';
    refDiv.style.transform = `rotateX(${-itemRotX}deg) rotateY(${-itemRotY}deg)`;
    itemEl.appendChild(refDiv);

    // FLIP Animation
    const tileR = refDiv.getBoundingClientRect();
    const frameR = this.frameEl.getBoundingClientRect();
    const mainR = this.mainEl.getBoundingClientRect();

    this.originalTilePos = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
    
    const imgEl = itemEl.querySelector('img');
    imgEl.style.visibility = 'hidden';

    const overlay = document.createElement('div');
    overlay.className = 'enlarge';
    overlay.style.width = `${frameR.width}px`;
    overlay.style.height = `${frameR.height}px`;
    overlay.style.left = `${frameR.left - mainR.left}px`;
    overlay.style.top = `${frameR.top - mainR.top}px`;
    
    const tx0 = tileR.left - frameR.left;
    const ty0 = tileR.top - frameR.top;
    const sx0 = tileR.width / frameR.width;
    const sy0 = tileR.height / frameR.height;

    overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${sx0}, ${sy0})`;
    overlay.style.opacity = '0';

    overlay.innerHTML = `
      <img src="${itemEl.dataset.src}" alt="">
      <div class="testimonial-content">
        <p class="testimonial-text">"${itemEl.dataset.text}"</p>
        <p class="testimonial-author">${itemEl.dataset.name}</p>
        <p class="testimonial-role">${itemEl.dataset.role}</p>
      </div>
    `;

    this.viewerEl.appendChild(overlay);
    this.enlargedEl = overlay;

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      overlay.style.transform = 'translate(0, 0) scale(1)';
    });

    const wantsResize = this.options.openedImageWidth || this.options.openedImageHeight;
    if (wantsResize) {
      overlay.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'transform') return;
        overlay.style.transition = `left ${this.options.enlargeTransitionMs}ms ease, top ${this.options.enlargeTransitionMs}ms ease, width ${this.options.enlargeTransitionMs}ms ease, height ${this.options.enlargeTransitionMs}ms ease`;
        
        const targetW = parseInt(this.options.openedImageWidth);
        const targetH = parseInt(this.options.openedImageHeight);
        
        const centeredLeft = frameR.left - mainR.left + (frameR.width - targetW) / 2;
        const centeredTop = frameR.top - mainR.top + (frameR.height - targetH) / 2;

        overlay.style.left = `${centeredLeft}px`;
        overlay.style.top = `${centeredTop}px`;
        overlay.style.width = `${targetW}px`;
        overlay.style.height = `${targetH}px`;
      }, { once: true });
    }
  }

  closeItem() {
    if (!this.focusedEl || performance.now() - this.openStartedAt < 250) return;
    
    const overlay = this.enlargedEl;
    const parent = this.focusedEl;
    const rootRect = this.rootEl.getBoundingClientRect();
    const originalPos = this.originalTilePos;

    const currentRect = overlay.getBoundingClientRect();
    
    const animatingOverlay = document.createElement('div');
    animatingOverlay.className = 'enlarge-closing';
    animatingOverlay.style.cssText = `
      position: absolute;
      left: ${currentRect.left - rootRect.left}px;
      top: ${currentRect.top - rootRect.top}px;
      width: ${currentRect.width}px;
      height: ${currentRect.height}px;
      z-index: 9999;
      border-radius: var(--enlarge-radius, 32px);
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,.35);
      transition: all ${this.options.enlargeTransitionMs}ms ease-out;
      pointer-events: none;
    `;

    const img = overlay.querySelector('img').cloneNode();
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    animatingOverlay.appendChild(img);

    overlay.remove();
    this.rootEl.appendChild(animatingOverlay);

    requestAnimationFrame(() => {
      animatingOverlay.style.left = `${originalPos.left - rootRect.left}px`;
      animatingOverlay.style.top = `${originalPos.top - rootRect.top}px`;
      animatingOverlay.style.width = `${originalPos.width}px`;
      animatingOverlay.style.height = `${originalPos.height}px`;
      animatingOverlay.style.opacity = '0';
    });

    animatingOverlay.addEventListener('transitionend', () => {
      animatingOverlay.remove();
      const imgEl = parent.querySelector('img');
      imgEl.style.visibility = '';
      const refDiv = parent.querySelector('.item__image--reference');
      if (refDiv) refDiv.remove();
      
      parent.style.setProperty('--rot-y-delta', '0deg');
      parent.style.setProperty('--rot-x-delta', '0deg');
      
      this.rootEl.removeAttribute('data-enlarging');
      this.focusedEl = null;
      this.isOpening = false;
    }, { once: true });
  }
}

// Export for use
window.DomeGallery = DomeGallery;
