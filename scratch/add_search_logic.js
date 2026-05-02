const fs = require('fs');
const path = 'sacred-moon-oil.html';

let content = fs.readFileSync(path, 'utf8');

// Add Search Logic
const searchScript = `
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const productCards = document.querySelectorAll('.review-card');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        productCards.forEach(card => {
          const altText = card.querySelector('img')?.alt?.toLowerCase() || '';
          if (altText.includes(searchTerm)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }
`;

// Append to the end of the script block
if (!content.includes('Search functionality')) {
    content = content.replace(/<\/script>/, (match) => {
        return searchScript + '\n  </script>';
    });
}

fs.writeFileSync(path, content, 'utf8');
console.log('Added search logic to sacred-moon-oil.html');
