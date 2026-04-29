const fs = require('fs');
const path = 'services.html';

let content = fs.readFileSync(path, 'utf8');

// Update mobile media query in services.html
const mobileMediaQueryRegex = /@media \(max-width: 640px\) \{([\s\S]*?)\}/;

const mobileOverrides = `
      .programs-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .span-2-2, .span-2-1, .span-1-1 { grid-column: span 1; }
      .about-hero { margin: 80px 20px 0; }
      .programs-shell { padding: 0; }
      .bento-card { 
        padding: 24px; 
        min-height: 240px;
      }
      .bento-card h3 {
        font-size: 24px;
      }
      .card-actions {
        gap: 8px;
      }
      .btn-card {
        padding: 8px 10px;
        font-size: 11px;
      }
`;

if (content.match(mobileMediaQueryRegex)) {
    content = content.replace(mobileMediaQueryRegex, `@media (max-width: 640px) {${mobileOverrides}    }`);
    console.log('Updated mobile styles in services.html');
}

fs.writeFileSync(path, content, 'utf8');
