const fs = require('fs');
const path = 'sacred-moon-oil.html';

let content = fs.readFileSync(path, 'utf8');

// Add Light Theme Overrides for the search bar
const lightThemeCSS = `
    html.light-theme .search-input {
      background: rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.1);
      color: #333;
    }

    html.light-theme .search-icon {
      color: rgba(0, 0, 0, 0.3);
    }
`;

// Insert before the closing </style> tag
if (!content.includes('html.light-theme .search-input')) {
    content = content.replace(/(\s*)<\/style>/, (match, p1) => {
        return lightThemeCSS + p1 + '</style>';
    });
}

fs.writeFileSync(path, content, 'utf8');
console.log('Added light theme overrides for search bar in sacred-moon-oil.html');
