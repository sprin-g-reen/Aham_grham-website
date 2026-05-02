const fs = require('fs');
const path = 'services.html';

let content = fs.readFileSync(path, 'utf8');

// Update about-main padding for mobile
const mobileMediaQueryRegex = /@media \(max-width: 640px\) \{([\s\S]*?)\}/;

if (content.match(mobileMediaQueryRegex)) {
    const currentStyles = content.match(mobileMediaQueryRegex)[1];
    const newStyles = currentStyles + '\n      .about-main { padding: 80px 16px 20px; }\n      .services-feature-shell { padding-left: 0; padding-right: 0; margin-left: 0; margin-right: 0; }';
    content = content.replace(mobileMediaQueryRegex, `@media (max-width: 640px) {${newStyles}    }`);
    console.log('Updated about-main mobile padding in services.html');
}

fs.writeFileSync(path, content, 'utf8');
