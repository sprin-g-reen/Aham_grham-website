class LightRays {
  constructor(options = {}) {
    this.container = options.container;
    this.raysOrigin = options.raysOrigin || 'top-center';
    this.raysColor = options.raysColor || '#ffffff';
    this.raysSpeed = options.raysSpeed !== undefined ? options.raysSpeed : 1;
    this.lightSpread = options.lightSpread !== undefined ? options.lightSpread : 0.5;
    this.rayLength = options.rayLength !== undefined ? options.rayLength : 1.0;
    this.pulsating = options.pulsating || false;
    this.fadeDistance = options.fadeDistance !== undefined ? options.fadeDistance : 1.0;
    this.saturation = options.saturation !== undefined ? options.saturation : 1.0;
    this.followMouse = options.followMouse !== undefined ? options.followMouse : false;
    this.mouseInfluence = options.mouseInfluence !== undefined ? options.mouseInfluence : 0.5;
    this.noiseAmount = options.noiseAmount !== undefined ? options.noiseAmount : 0.0;
    this.distortion = options.distortion !== undefined ? options.distortion : 0.0;

    this.mouse = { x: 0.5, y: 0.5 };
    this.smoothMouse = { x: 0.5, y: 0.5 };
    
    if (!this.container) return;
    this.init();
  }

  hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
  }

  getAnchorAndDir(origin, w, h) {
    const outside = 0.2;
    switch (origin) {
      case 'top-left': return { anchor: [0, -outside * h], dir: [0, 1] };
      case 'top-right': return { anchor: [w, -outside * h], dir: [0, 1] };
      case 'left': return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
      case 'right': return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
      case 'bottom-left': return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
      case 'bottom-center': return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
      case 'bottom-right': return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
      default: return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
    }
  }

  init() {
    const { Renderer, Program, Triangle, Mesh } = ogl;
    
    this.renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true
    });
    const gl = this.renderer.gl;
    this.container.appendChild(gl.canvas);

    const vert = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const frag = `
      precision highp float;
      uniform float iTime;
      uniform vec2  iResolution;
      uniform vec2  rayPos;
      uniform vec2  rayDir;
      uniform vec3  raysColor;
      uniform float raysSpeed;
      uniform float lightSpread;
      uniform float rayLength;
      uniform float pulsating;
      uniform float fadeDistance;
      uniform float saturation;
      uniform vec2  mousePos;
      uniform float mouseInfluence;
      uniform float noiseAmount;
      uniform float distortion;
      varying vec2 vUv;

      float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
        vec2 sourceToCoord = coord - raySource;
        vec2 dirNorm = normalize(sourceToCoord);
        float cosAngle = dot(dirNorm, rayRefDirection);
        float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
        float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
        float distance = length(sourceToCoord);
        float maxDistance = iResolution.x * rayLength;
        float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
        float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
        float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;
        float baseStrength = clamp(
          (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
          (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
          0.0, 1.0
        );
        return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
      }

      void main() {
        vec2 coord = vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y);
        vec2 finalRayDir = rayDir;
        if (mouseInfluence > 0.0) {
          vec2 mouseScreenPos = mousePos * iResolution.xy;
          vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
          finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
        }
        vec4 rays1 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed);
        vec4 rays2 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed);
        vec4 fragColor = rays1 * 0.8 + rays2 * 0.7; // Boosted intensity
        if (noiseAmount > 0.0) {
          float n = noise(coord * 0.01 + iTime * 0.1);
          fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
        }
        float brightness = 1.0 - (coord.y / iResolution.y);
        fragColor.rgb *= 1.2; // Global brightness boost
        fragColor.x *= 0.2 + brightness * 0.8;
        fragColor.y *= 0.4 + brightness * 0.6;
        fragColor.z *= 0.6 + brightness * 0.5;

        if (saturation != 1.0) {
          float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
          fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
        }
        fragColor.rgb *= raysColor;
        gl_FragColor = fragColor;
      }
    `;

    this.uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      rayPos: { value: [0, 0] },
      rayDir: { value: [0, 1] },
      raysColor: { value: this.hexToRgb(this.raysColor) },
      raysSpeed: { value: this.raysSpeed },
      lightSpread: { value: this.lightSpread },
      rayLength: { value: this.rayLength },
      pulsating: { value: this.pulsating ? 1.0 : 0.0 },
      fadeDistance: { value: this.fadeDistance },
      saturation: { value: this.saturation },
      mousePos: { value: [0.5, 0.5] },
      mouseInfluence: { value: this.mouseInfluence },
      noiseAmount: { value: this.noiseAmount },
      distortion: { value: this.distortion }
    };

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: this.uniforms
    });
    this.mesh = new Mesh(gl, { geometry, program });

    window.addEventListener('resize', this.onResize.bind(this));
    this.onResize();

    if (this.followMouse) {
      window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    this.animate();
  }

  onResize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.renderer.setSize(w, h);
    const dpr = this.renderer.dpr;
    this.uniforms.iResolution.value = [w * dpr, h * dpr];
    const { anchor, dir } = this.getAnchorAndDir(this.raysOrigin, w * dpr, h * dpr);
    this.uniforms.rayPos.value = anchor;
    this.uniforms.rayDir.value = dir;
  }

  onMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = (e.clientX - rect.left) / rect.width;
    this.mouse.y = (e.clientY - rect.top) / rect.height;
  }

  animate(t) {
    this.raf = requestAnimationFrame(this.animate.bind(this));
    this.uniforms.iTime.value = t * 0.001;

    if (this.followMouse) {
      const smoothing = 0.92;
      this.smoothMouse.x = this.smoothMouse.x * smoothing + this.mouse.x * (1 - smoothing);
      this.smoothMouse.y = this.smoothMouse.y * smoothing + this.mouse.y * (1 - smoothing);
      this.uniforms.mousePos.value = [this.smoothMouse.x, this.smoothMouse.y];

      // Update branding glow based on rays hitting the center
      const brandEl = document.querySelector('.hero-brand');
      if (brandEl) {
        // Calculate the angle of the ray pointing to the mouse
        const dx = this.smoothMouse.x - 0.5;
        const dy = this.smoothMouse.y - (-0.2); // Rays origin is at [0.5, -0.2]
        const rayAngle = Math.atan2(dx, dy);
        
        // The logo is at [0.5, 0.5], which is straight down (angle 0)
        // We check if the ray angle is close to 0
        const angularDistance = Math.abs(rayAngle);
        
        // Threshold depends on lightSpread. Higher spread = easier to hit.
        const threshold = 0.15 + (this.lightSpread * 0.2);
        
        if (angularDistance < threshold) {
          // Add a subtle shimmer that stays very close to 100% opacity
          const shimmer = Math.sin(this.uniforms.iTime.value * this.raysSpeed * 2.0) * 0.03 + 0.97;
          brandEl.style.opacity = shimmer.toString();
          brandEl.classList.add('is-glowing');
        } else {
          brandEl.style.opacity = ''; // Reverts to CSS default (0.12)
          brandEl.classList.remove('is-glowing');
        }

      }

    }

    this.renderer.render({ scene: this.mesh });
  }


  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    if (this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

// Auto-initialize if container exists
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('light-rays-hero');
  if (container) {
    new LightRays({
      container: container,
      raysOrigin: 'top-center',
      raysColor: '#6366f1',
      raysSpeed: 1.5,
      lightSpread: 0.8,
      rayLength: 1.2,
      followMouse: true,
      mouseInfluence: 0.1,
      noiseAmount: 0.1,
      distortion: 0.05
    });
  }
});
