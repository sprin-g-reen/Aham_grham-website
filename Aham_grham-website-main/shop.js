function openProductModal(card) {
  showProductInfoView(); // Ensure we start on product info
  const modal = document.getElementById('productModal');
  const img = card.querySelector('img').src;
  const title = card.querySelector('h4').innerText;
  const priceStr = card.querySelector('p.text-text-secondary').innerText;
  const priceNum = parseFloat(priceStr.replace('₹', ''));
  
  document.getElementById('modalImg').src = img;
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalDetail').innerText = "Celestial Vessel of Energy.";
  document.getElementById('modalPrice').innerText = priceStr;
  document.getElementById('modalOldPrice').innerText = '₹' + (priceNum * 1.5).toFixed(0);
  document.getElementById('modalPrice').style.display = 'block';
  document.getElementById('modalOldPrice').style.display = 'block';
  document.querySelector('.modal-badge').innerText = "Free Shipping";
  document.querySelector('.modal-buy-btn').innerText = "Buy";
  document.querySelector('.modal-tax').style.display = 'block';
  document.querySelector('.modal-offer').style.display = 'block';
  document.querySelector('.modal-stock').style.display = 'flex';
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; 
}

function openReviewModal(card) {
  showProductInfoView(); // Reviews can also show the form if needed
  const modal = document.getElementById('productModal');
  const img = card.querySelector('img').src;
  const text = card.querySelector('p.italic').innerText;
  const name = card.querySelector('p.text-accent-cyan').innerText.replace('— ', '');
  
  document.getElementById('modalImg').src = img;
  document.getElementById('modalTitle').innerText = name;
  document.getElementById('modalDetail').innerText = text;
  document.getElementById('modalPrice').innerText = "Verified Reflection";
  document.getElementById('modalOldPrice').style.display = 'none';
  document.getElementById('modalPrice').style.display = 'block';
  document.querySelector('.modal-badge').innerText = "Student Reflection";
  document.querySelector('.modal-buy-btn').innerText = "Join Practice";
  document.querySelector('.modal-tax').style.display = 'none';
  document.querySelector('.modal-offer').style.display = 'none';
  document.querySelector('.modal-stock').style.display = 'none';
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function showReviewsListView() {
  document.getElementById('productInfoView').classList.add('hidden');
  document.getElementById('reviewsListView').classList.remove('hidden');
}

function showProductInfoView() {
  document.getElementById('productInfoView').classList.remove('hidden');
  document.getElementById('reviewsListView').classList.add('hidden');
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  modal.classList.remove('active');
  document.body.style.overflow = ''; // Restore scroll
}

// Add click event to all product cards
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => openProductModal(card));
  });

  // Add click event to all review cards
  document.querySelectorAll('.review-card').forEach(card => {
    card.addEventListener('click', () => openReviewModal(card));
  });
});
