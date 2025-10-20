document.addEventListener('DOMContentLoaded', () => {
  // --- SHARED DATA & CONFIG ---
  const SELLER_WA_NUMBER = '2348039135420';
  window.PRODUCTS = [
    { id: 'p1', name: 'Gold-plated bookmark', price: 2500, desc: 'Elegant metal bookmark with gold finish.', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop' }, // Example image
    { id: 'p2', name: 'Luxe scented candle', price: 4200, desc: 'White jar candle, subtle amber scent.', img: 'https://images.unsplash.com/photo-1585253391965-7b3b6f0e4b3e?q=80&w=2574&auto=format&fit=crop' }, // Example image
    { id: 'p3', name: 'Silk scarf (white)', price: 7600, desc: 'Lightweight silk scarf, minimalist.', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2598&auto=format&fit=crop' }, // Example image
    { id: 'p4', name: 'Small jewelry box', price: 5800, desc: 'Velvet lined, gold clasp.', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2670&auto=format&fit=crop' }, // Example image
    { id: 'p5', name: 'Minimalist Wallet', price: 3000, desc: 'Slim leather wallet, RFID protected.', img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=2564&auto=format&fit=crop' }, // Example image
    { id: 'p6', name: 'Ceramic Coffee Mug', price: 1800, desc: 'Hand-crafted, matte finish.', img: 'https://images.unsplash.com/photo-1565384935391-49265c36fb1a?q=80&w=2574&auto=format&fit=crop' }, // Example image
    { id: 'p7', name: 'Desk Organizer', price: 4500, desc: 'Bamboo wood, multiple compartments.', img: 'https://images.unsplash.com/photo-1549497538-22b79a293409?q=80&w=2574&auto=format&fit=crop' }, // Example image
    { id: 'p8', name: 'Portable Bluetooth Speaker', price: 9000, desc: 'Compact, high-fidelity sound.', img: 'https://images.unsplash.com/photo-1588613252834-3158169e1b3c?q=80&w=2574&auto=format&fit=crop' }  // Example image
  ];

  // --- GLOBAL STATE MANAGEMENT ---
  const cart = JSON.parse(localStorage.getItem('luxeFindCart')) || {};
  let productStockStatus = JSON.parse(localStorage.getItem('luxeFindProductStock')) || {};
  PRODUCTS.forEach(p => {
    if (productStockStatus[p.id] === undefined) {
      productStockStatus[p.id] = true; // Default to in stock
    }
  });

  window.formatCurrency = n => '₦' + Number(n).toLocaleString();

  // --- DOM ELEMENT SELECTORS (check for existence) ---
  const contactPopup = document.getElementById('contact-popup');
  const headerContactBtn = document.getElementById('header-contact-btn');
  const closeContactPopupBtn = document.getElementById('close-contact-popup');
  const cartPanelContainer = document.getElementById('cart-panel-container');
  const cartPanel = document.getElementById('cart-panel');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const viewCartBtn = document.getElementById('view-cart');
  const floatingCartBtn = document.getElementById('floating-cart-btn');
  const closeCartPanelBtn = document.getElementById('close-cart-panel');
  const cartItemsEl = document.getElementById('cart-items');
  const checkoutLink = document.getElementById('checkout-link');
  const clearCartBtn = document.getElementById('clear-cart');
  const subtotalEl = document.getElementById('subtotal');
  const cartCountEl = document.getElementById('cart-count');
  const floatingCartCountEl = document.getElementById('floating-cart-count');
  const checkoutForm = document.getElementById('checkout-form');

  // --- CORE FUNCTIONS ---

  // Contact Popup Logic
  if (headerContactBtn && contactPopup && closeContactPopupBtn) {
    headerContactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      contactPopup.classList.remove('hidden');
      contactPopup.classList.add('flex');
    });
    closeContactPopupBtn.addEventListener('click', () => {
      contactPopup.classList.add('hidden');
      contactPopup.classList.remove('flex');
    });
  }

  // Cart Panel Logic
  function openCart() {
    if (!cartPanelContainer) return;
    renderCartItems();
    cartPanelContainer.classList.remove('hidden');
    setTimeout(() => {
      if (cartBackdrop) cartBackdrop.style.opacity = '1';
      if (cartPanel) cartPanel.style.transform = 'translateX(0)';
    }, 10);
  }

  function closeCart() {
    if (!cartPanelContainer) return;
    if (cartBackdrop) cartBackdrop.style.opacity = '0';
    if (cartPanel) cartPanel.style.transform = 'translateX(100%)';
    setTimeout(() => {
      cartPanelContainer.classList.add('hidden');
    }, 300);
  }

  function updateCartDisplay() {
    const totalItems = Object.values(cart).reduce((s, n) => s + n, 0);
    if (cartCountEl) cartCountEl.textContent = totalItems;
    if (floatingCartCountEl) floatingCartCountEl.textContent = totalItems;

    let sum = 0;
    for (const id in cart) {
      const p = PRODUCTS.find(x => x.id === id);
      if (p) sum += p.price * cart[id];
    }
    if (subtotalEl) subtotalEl.textContent = formatCurrency(sum);

    if (checkoutLink) {
      if (totalItems > 0) {
        checkoutLink.textContent = 'Proceed to Checkout';
      } else {
        checkoutLink.textContent = 'Add items & Checkout';
      }
    }

    localStorage.setItem('luxeFindCart', JSON.stringify(cart));
  }

  function renderCartItems() {
    if (!cartItemsEl) return;
    if (Object.keys(cart).length === 0) {
      cartItemsEl.innerHTML = '<p class="text-gray-500 text-center">Your cart is empty.</p>';
      return;
    }
    cartItemsEl.innerHTML = '';
    for (const id in cart) {
      const p = PRODUCTS.find(x => x.id === id);
      if (p) {
        const itemEl = document.createElement('div');
        itemEl.className = 'flex justify-between items-center py-2 border-b';
        itemEl.innerHTML = `
          <div>
            <p class="font-semibold">${p.name}</p>
            <p class="text-sm text-gray-600">${cart[id]} x ${formatCurrency(p.price)}</p>
          </div>
          <p class="font-bold">${formatCurrency(cart[id] * p.price)}</p>
        `;
        cartItemsEl.appendChild(itemEl);
      }
    }
  }

  // --- EVENT LISTENERS ---
  if (viewCartBtn) viewCartBtn.addEventListener('click', openCart);
  if (floatingCartBtn) floatingCartBtn.addEventListener('click', openCart);
  if (closeCartPanelBtn) closeCartPanelBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (Object.keys(cart).length === 0) return;
      if (confirm('Are you sure you want to clear your cart?')) {
        Object.keys(cart).forEach(id => { delete cart[id]; });
        updateCartDisplay();
        renderCartItems();
        // If on shop page, re-render products to update quantities
        if (typeof renderProducts === 'function') {
          renderProducts(PRODUCTS, productStockStatus, formatCurrency, cart, updateCartDisplay);
        }
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && cartPanelContainer && !cartPanelContainer.classList.contains('hidden')) {
      closeCart();
    }
  });

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const totalItems = Object.values(cart).reduce((s, n) => s + n, 0);
      if (totalItems === 0) {
        alert("Your cart is empty. Please add items before sending an order.");
        return;
      }

      const name = document.getElementById('customer-name').value;
      const phone = document.getElementById('customer-phone').value;
      const address = document.getElementById('customer-address').value;

      // --- Phone Number Validation ---
      const nigerianPhoneRegex = /^(070|080|081|090|091)\d{8}$/;
      if (!nigerianPhoneRegex.test(phone)) {
        alert("Please enter a valid 11-digit Nigerian phone number starting with 070, 080, 081, 090, or 091.");
        return; // Stop the submission
      }
      // --- End Validation ---

      const divider = '-----------------------------------';
      let message = `*NEW ORDER - Luxe Find*\n${divider}\n\n`;
      message += `*Customer Details:*\n`;
      message += `Name: ${name}\n`;
      message += `Phone: ${phone}\n`;
      message += `Address: ${address}\n\n`;
      message += `${divider}\n\n*Items:*\n`;

      let sum = 0;
      let itemIndex = 1;
      for (const id in cart) {
        const p = PRODUCTS.find(x => x.id === id);
        if (p) {
          const itemTotal = p.price * cart[id];
          sum += itemTotal;
          message += `${itemIndex}. ${p.name} (x${cart[id]})\n   _${formatCurrency(itemTotal)}_\n\n`;
          itemIndex++;
        }
      }
      message += `${divider}\n*TOTAL: ${formatCurrency(sum)}*`;

      const whatsappUrl = `https://wa.me/${SELLER_WA_NUMBER}?text=${encodeURIComponent(message)}`;
      
      // Clear cart and redirect
      localStorage.removeItem('luxeFindCart');
      // Redirect to the thank-you page, passing the WhatsApp URL as a parameter
      window.location.href = `thank-you.html?wa=${encodeURIComponent(whatsappUrl)}`;
    });
  }

  // --- PAGE-SPECIFIC INITIALIZATION ---
  // This makes the shared script aware of page-specific functions
  
  // For Luxe Find 3.html
  if (typeof renderFeaturedProducts === 'function') {
    renderFeaturedProducts(PRODUCTS, productStockStatus, formatCurrency, cart, updateCartDisplay, openCart);
  }

  // For shop.html
  if (typeof renderProducts === 'function') {
    renderProducts(PRODUCTS, productStockStatus, formatCurrency, cart, updateCartDisplay);
  }

  // For admin.html
  if (typeof renderProductList === 'function') {
    renderProductList(PRODUCTS, productStockStatus);
  }

  // --- GLOBAL INITIALIZATION ---
  updateCartDisplay();

  // Open cart if URL param is present
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('openCart') === 'true') {
    openCart();
  }
});