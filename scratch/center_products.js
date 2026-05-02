const fs = require('fs');
const path = 'sacred-moon-oil.html';

let content = fs.readFileSync(path, 'utf8');

// Update the header container to center items
const headerRegex = /<div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">/;
if (content.match(headerRegex)) {
    // Change justify-between to items-center and add text-center
    content = content.replace(headerRegex, '<div class="flex flex-col items-center text-center mb-16 gap-8">');
    console.log('Centered header container');
}

// Ensure the title div doesn't have alignment issues
const titleDivRegex = /<div>\s*<h2 class="text-3xl font-serif mb-2 text-white">Products<\/h2>/;
if (content.match(titleDivRegex)) {
    // Already in a centered flex, but making sure the search container doesn't push it
    console.log('Found title div');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Updated sacred-moon-oil.html to center products text');
