const fs = require('fs');
const path = 'sacred-moon-oil.html';

let content = fs.readFileSync(path, 'utf8');

// Regex to find and remove the stars and rating block
const ratingBlockRegex = /<div class="flex items-center space-x-2">[\s\S]*?<div class="flex text-accent-blue">[\s\S]*?<\/div>[\s\S]*?<span class="text-xs font-bold uppercase tracking-wider text-text-secondary">[\s\S]*?<\/span>[\s\S]*?<\/div>/;

if (content.match(ratingBlockRegex)) {
    content = content.replace(ratingBlockRegex, '');
    fs.writeFileSync(path, content, 'utf8');
    console.log('Removed rating block from sacred-moon-oil.html');
} else {
    console.log('Rating block NOT found');
}
