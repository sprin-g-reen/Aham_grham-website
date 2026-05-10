async function initAiTags() {
  const API_URL = 'http://localhost:5000/api/aitags';
  let aiTags = [];

  // 1. Setup delegation immediately
  document.addEventListener('click', (e) => {
    const tag = e.target.closest('.footer-tag');
    if (tag) {
      const tagName = tag.innerText.trim();
      const tagData = aiTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
      
      const titleEl = document.getElementById('aiTagName');
      const descEl = document.getElementById('aiTagDesc');
      const modal = document.getElementById('aiTagModal');

      if (titleEl && descEl && modal) {
        titleEl.innerText = tagName;
        descEl.innerText = tagData ? tagData.description : 'Advanced biological integration through ancient techniques and modern science.';
        modal.classList.add('active');
      }
    }
  });

  // 2. Fetch Tags
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      aiTags = await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch AI tags:', error);
  }

  // Use fallback tags if nothing is in the database or fetch failed
  if (!aiTags || aiTags.length === 0) {
    aiTags = [
      { name: 'Neurological Sync', description: 'Aligns neural pathways for optimal focus and cognitive clarity.' },
      { name: 'Bio-Hacked Grip', description: 'Advanced tactile feedback loops for perfect connection.' },
      { name: 'Quantum Mindfulness', description: 'Deep state meditation assisted by wave-frequency resonance.' },
      { name: 'Cerebral Flow', description: 'Enhances mental liquidity and creative problem solving.' },
      { name: 'Neural Reset', description: 'Calibrates the nervous system back to its original balanced state.' },
      { name: 'Synaptic Anchor', description: 'Provides a firm mental foundation for deep meditative states.' },
      { name: 'Data-Driven Zen', description: 'Achieving peace through biological feedback and ancient wisdom.' }
    ];
  }

  // 3. Inject Tags into Marquees
  const marquee1 = document.querySelector('#marquee-1 .marquee-content');
  const marquee2 = document.querySelector('#marquee-2 .marquee-content');

  if (marquee1 && marquee2 && aiTags.length > 0) {
    // Split tags between the two marquees
    const half = Math.ceil(aiTags.length / 2);
    const tags1 = aiTags.slice(0, half);
    const tags2 = aiTags.slice(half);

    marquee1.innerHTML = tags1.map(tag => `<span class="footer-tag">${tag.name}</span>`).join('');
    marquee2.innerHTML = tags2.map(tag => `<span class="footer-tag">${tag.name}</span>`).join('');

    // Re-initialize velocity marquees if the class exists
    if (window.ScrollVelocity) {
      new ScrollVelocity('#marquee-1', { velocity: 0.8, direction: 1 });
      new ScrollVelocity('#marquee-2', { velocity: 0.8, direction: -1 });
    }
  }

  // 4. Setup Modal CSS/HTML (if not already there)
  if (!document.getElementById('aiTagModal')) {
    const modalHTML = `
      <div id="aiTagModal" class="ai-tag-modal">
        <div class="ai-tag-overlay"></div>
        <div class="ai-tag-card">
          <button class="ai-tag-close"><span class="material-symbols-outlined">close</span></button>
          <div class="ai-tag-scroll-area">
            <div class="ai-tag-content">
              <div class="ai-tag-badge">AI Enhanced</div>
              <h2 id="aiTagName" class="ai-tag-title"></h2>
              <div class="ai-tag-divider"></div>
              <p id="aiTagDesc" class="ai-tag-description"></p>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const style = document.createElement('style');
    style.textContent = `
      .ai-tag-modal { position: fixed; inset: 0; z-index: 10000; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: all 0.5s ease; padding: 20px; }
      .ai-tag-modal.active { opacity: 1; pointer-events: auto; }
      .ai-tag-overlay { position: absolute; inset: 0; background: rgba(5, 5, 26, 0.85); backdrop-filter: blur(12px); }
      .ai-tag-card { position: relative; z-index: 10; background: #0a0a20; border: 1px solid rgba(124, 77, 255, 0.3); border-radius: 32px; max-width: 500px; width: 100%; max-height: 80vh; transform: scale(0.9); transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; flex-direction: column; overflow: hidden; }
      .ai-tag-modal.active .ai-tag-card { transform: scale(1); }
      .ai-tag-scroll-area { padding: 48px; overflow-y: auto; }
      .ai-tag-close { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.05); border: none; color: white; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; z-index: 20; display: flex; align-items: center; justify-content: center; }
      .ai-tag-title { font-size: 28px; color: white; margin-bottom: 12px; word-break: break-word; overflow-wrap: break-word; }
      .ai-tag-description { color: #94a3b8; line-height: 1.6; word-break: break-word; overflow-wrap: break-word; }
      .footer-tag { cursor: pointer !important; pointer-events: auto !important; margin: 0 20px; font-weight: 500; }
      html.light-theme .ai-tag-card { background: white; color: black; }
      html.light-theme .ai-tag-title { color: black; }
      html.light-theme .ai-tag-description { color: #4b5563; }
      html.light-theme .ai-tag-close { color: black; }
    `;
    document.head.appendChild(style);

    const modal = document.getElementById('aiTagModal');
    modal.querySelector('.ai-tag-close').addEventListener('click', () => modal.classList.remove('active'));
    modal.querySelector('.ai-tag-overlay').addEventListener('click', () => modal.classList.remove('active'));
  }
}

document.addEventListener('DOMContentLoaded', initAiTags);
