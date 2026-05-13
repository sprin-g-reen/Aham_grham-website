async function fetchProducts() {
  const API_URL = (window.API_BASE_URL || '') + '/api';
  const UPLOADS_URL = (window.API_BASE_URL || '') + '/uploads';

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
          const finalImageUrl = (featured.image.startsWith('http') || featured.image.startsWith('data:')) ? featured.image : `${UPLOADS_URL}/${featured.image}`;
          imageEl.src = finalImageUrl;

          // Dynamically update Featured Product buttons if they exist
          const buyBtn = document.getElementById('featuredProductBuyBtn');
          const cartBtn = document.getElementById('featuredProductCartBtn');

          if (buyBtn) {
            buyBtn.onclick = () => {
              window.location.href = `product-detail.html?name=${encodeURIComponent(featured.name)}`;
            };
          }

          if (cartBtn) {
            cartBtn.onclick = () => {
              if (window.addToCart) {
                window.addToCart(featured.name, featured.price, finalImageUrl);
                if (window.showToast) window.showToast(`${featured.name} added to cart!`);
              }
            };
          }
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
          <div class="aspect-square rounded-[32px] overflow-hidden relative border border-white/5 shadow-2xl cursor-pointer mb-6" 
            onclick="window.location.href='product-detail.html?name=' + encodeURIComponent('${product.name}')">
            <img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="${imageUrl}" alt="${product.name}">
          </div>
          <div class="space-y-1 text-left px-2">
            <h3 class="text-xl font-sans font-medium product-card-title">${product.name}</h3>
            <p class="text-text-secondary font-sans text-sm opacity-60">₹ ${product.price}.00</p>
            <div class="pt-4">
              <button class="btn-add-to-cart"
                data-name="${product.name.replace(/"/g, '&quot;')}"
                data-price="${product.price}"
                data-image="${imageUrl}"
                onclick="event.stopPropagation(); const d=this.dataset; addToCart(d.name, parseFloat(d.price), d.image);">
                Add to Cart
              </button>
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

