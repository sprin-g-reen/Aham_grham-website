function renderCart() {
    const container = document.getElementById('cart-container');
    if (!container) return;

    let cart = [];
    try {
        const stored = localStorage.getItem('aham_cart');
        if (stored) {
            cart = JSON.parse(stored);
        }
    } catch (e) {
        console.error("Cart retrieval error:", e);
        cart = [];
    }

    if (!Array.isArray(cart) || cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart" style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 20px; text-align: center;">
                <span class="material-symbols-outlined empty-cart-icon">shopping_cart_off</span>
                <h2 class="empty-cart-title">your cart is empty</h2>
                <p class="empty-cart-text">prepare for your ritual tools and vessels by exploring our collection.</p>
                <button class="btn-primary" style="padding: 12px 32px; border-radius: 999px;" onclick="window.location.href='sacred-moon-oil.html'">explore products</button>
            </div>
        `;
        return;
    }

    let subtotal = 0;
    let itemsHTML = '<div class="cart-items">';
    
    cart.forEach((item, index) => {
        subtotal += item.price;
        itemsHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Ritual Vessel</p>
                </div>
                <div class="cart-item-price">₹${item.price}</div>
                <button class="remove-btn" onclick="removeFromCart(${index})">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
        `;
    });
    
    itemsHTML += '</div>';

    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    const summaryHTML = `
        <div class="cart-summary">
            <h2 class="text-2xl mb-8">Summary</h2>
            <div class="summary-row">
                <span>Subtotal</span>
                <span>₹${subtotal}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>Free</span>
            </div>
            <div class="summary-total summary-row">
                <span>Total</span>
                <span>₹${total}</span>
            </div>
            <button class="checkout-btn" onclick="proceedToCheckout()">proceed to checkout</button>
        </div>
    `;

    container.innerHTML = itemsHTML + summaryHTML;
}

window.removeFromCart = function(index) {
    let cart = JSON.parse(localStorage.getItem('aham_cart') || '[]');
    cart.splice(index, 1);
    localStorage.setItem('aham_cart', JSON.stringify(cart));
    renderCart();
    window.updateCartBadge();
};

window.proceedToCheckout = function() {
    alert("Checkout process starting... (Redirecting to payment gateway)");
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCart);
} else {
    renderCart();
}
