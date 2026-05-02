const fs = require('fs');
const path = 'style.css';

let content = fs.readFileSync(path, 'utf8');

// Make btn-desc look like btn-book in light mode
const lightBtnDescStyles = `html.light-theme .btn-desc {
  background: var(--btn-book-gradient) !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2) !important;
}

html.light-theme .btn-desc:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(22, 163, 74, 0.3) !important;
  filter: brightness(1.05);
}`;

const targetRegex = /html\.light-theme \.btn-desc \{[\s\S]*?\}\s*html\.light-theme \.btn-desc:hover \{[\s\S]*?\}/;
if (content.match(targetRegex)) {
    content = content.replace(targetRegex, lightBtnDescStyles);
} else {
    // Fallback search
    const singleRegex = /html\.light-theme \.btn-desc \{[\s\S]*?\}/;
    content = content.replace(singleRegex, lightBtnDescStyles);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Styled description button like book button in light mode');
