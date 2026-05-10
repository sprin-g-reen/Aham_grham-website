const fs = require('fs');
const path = 'style.css';

let content = fs.readFileSync(path, 'utf8');

// Update light theme btn-desc styles
const lightBtnDescStyles = `html.light-theme .btn-desc {
  background: rgba(22, 163, 74, 0.12) !important;
  border: 1px solid rgba(22, 163, 74, 0.35) !important;
  color: #166534 !important;
}

html.light-theme .btn-desc:hover {
  background: rgba(22, 163, 74, 0.2) !important;
  border-color: rgba(22, 163, 74, 0.5) !important;
}`;

// Find the existing definition and replace it
const targetRegex = /html\.light-theme \.btn-desc \{[\s\S]*?\}/;
if (content.match(targetRegex)) {
    content = content.replace(targetRegex, lightBtnDescStyles);
} else {
    // If not found as a block, look for individual properties or append
    console.log('Target block not found, appending to light-theme section');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Improved light mode description button visibility in style.css');
