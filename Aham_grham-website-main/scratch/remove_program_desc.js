const fs = require('fs');
const path = 'services.html';

let content = fs.readFileSync(path, 'utf8');

// Regex to find and remove <p> tags inside bento-card divs that contain program descriptions
// We want to keep the kicker/subtitle in the hero, just remove from cards.
const bentoCardDescriptionRegex = /(<div class="bento-card[^>]*>[\s\S]*?<div>[\s\S]*?<h3>.*?<\/h3>)[\s\S]*?(<p>.*?<\/p>)/g;

content = content.replace(bentoCardDescriptionRegex, '$1');

fs.writeFileSync(path, content, 'utf8');
console.log('Removed program descriptions from services.html');
