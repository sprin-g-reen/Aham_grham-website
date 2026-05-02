
const fs = require('fs');
const path = 'style.css';

let content = fs.readFileSync(path, 'utf8');

content = content.replace(/border: none;\s+width: 40px;\s+height: 40px;\s+border-radius: 50%;/g, 
    'border: 1px solid rgba(255, 255, 255, 0.1);\n  width: 42px;\n  height: 42px;\n  border-radius: 12px;');

content = content.replace(/transform: scale\(1\.1\);\s+box-shadow: 0 4px 12px rgba\(0, 0, 0, 0\.2\);/g,
    'transform: translateY(-2px);\n  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);');

fs.writeFileSync(path, content);
console.log('Fixed buttons!');
