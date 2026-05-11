const API_URL = '/api';
const UPLOADS_URL = '/uploads';

async function fetchProducts() {
  const nameEl = document.getElementById('featuredProductName');
  const priceEl = document.getElementById('featuredProductPrice');
  const descEl = document.getElementById('featuredProductDesc');
  const imageEl = document.getElementById('featuredProductImage');
  const gridContainer = document.getElementById('dynamic-product-grid');

  try {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();
    
    // 1. Handle Featured Product
    if (nameEl && priceEl && descEl && imageEl) {
      const featured = products
        .filter(p => p.isMostSelling)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      if (featured) {
        nameEl.innerHTML = featured.name;
        
        if (featured.price) {
          priceEl.innerText = `₹${featured.price}.00`;
          priceEl.style.display = 'block';
        } else {
          priceEl.style.display = 'none';
        }

        if (featured.description) {
          descEl.innerText = featured.description;
          descEl.style.display = 'block';
        } else {
          descEl.style.display = 'none';
        }
        
        if (featured.image) {
          imageEl.src = (featured.image.startsWith('http') || featured.image.startsWith('data:')) ? featured.image : `${UPLOADS_URL}/${featured.image}`;
        }
      }
    }

    // 2. Handle Product Grid (Show all products)
    if (gridContainer && products.length > 0) {
      gridContainer.innerHTML = ''; // Clear existing
      
      products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'space-y-6 group review-card cursor-pointer';
        productCard.setAttribute('data-name', product.name);
        productCard.setAttribute('data-price', `₹${product.price}`);
        productCard.setAttribute('data-desc', product.description);
        productCard.setAttribute('data-offer', product.offer || '');

        const imageUrl = product.image 
          ? (product.image.startsWith('http') || product.image.startsWith('data:') 
              ? product.image 
              : `${UPLOADS_URL}/${product.image}`)
          : 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80';

        productCard.innerHTML = `
          <div class="aspect-square rounded-3xl overflow-hidden relative border border-white/10 shadow-xl cursor-pointer" 
            onclick="openProductModal(this.closest('.review-card'));">
            <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="${imageUrl}" alt="${product.name}">
          </div>
          <div class="space-y-3 w-full mt-4 z-20 relative">
            <div class="grid grid-cols-3 gap-2 w-full">
              <button class="py-2.5 bg-accent-blue/20 text-accent-cyan border border-accent-blue/30 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-accent-blue/30 transition-all" 
                onclick="event.stopPropagation(); openProductModal(this.closest('.review-card'));">Buy</button>
              <button class="py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all" 
                data-name="${product.name.replace(/"/g, '&quot;')}"
                data-price="${product.price}"
                data-image="${imageUrl}"
                onclick="event.stopPropagation(); const d=this.dataset; addToCart(d.name, parseFloat(d.price), d.image);">Cart</button>
              <button class="py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all" 
                onclick="event.stopPropagation(); openReviewModal(this.closest('.review-card'));">Review</button>
            </div>
          </div>
        `;
        gridContainer.appendChild(productCard);
      });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

document.addEventListener('DOMContentLoaded', fetchProducts);

