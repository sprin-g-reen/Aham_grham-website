const fs = require('fs');
const path = 'sacred-moon-oil.html';

let content = fs.readFileSync(path, 'utf8');

// Add placeholder styles
const placeholderCSS = `
    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    html.light-theme .search-input::placeholder {
      color: rgba(0, 0, 0, 0.4);
    }
`;

// Insert before the closing </style> tag
if (!content.includes('.search-input::placeholder')) {
    content = content.replace(/(\s*)<\/style>/, (match, p1) => {
        return placeholderCSS + p1 + '</style>';
    });
}

fs.writeFileSync(path, content, 'utf8');
console.log('Added placeholder styles for search bar in sacred-moon-oil.html');
