const fs = require('fs');
const path = 'sacred-moon-oil.html';

let content = fs.readFileSync(path, 'utf8');

// Add HTML
const html = `
        <div class="search-container mb-6">
          <input type="text" class="search-input" placeholder="Search products...">
          <span class="material-symbols-outlined search-icon">search</span>
        </div>
`;

// Insert the search bar before the title container
// Using a regex that handles potential whitespace and newlines more robustly
const titleRegex = /<div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">/;
if (content.match(titleRegex)) {
    console.log('Found title container');
    content = content.replace(titleRegex, (match) => {
        return match + html;
    });
} else {
    console.log('Title container NOT found');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Script execution finished');
