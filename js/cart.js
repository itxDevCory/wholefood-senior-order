// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadCart();
    }

    loadCart() {
        const saved = localStorage.getItem('wholefood_cart');
        if (saved) {
            this.items = JSON.parse(saved);
        }
    }

    saveCart() {
        localStorage.setItem('wholefood_cart', JSON.stringify(this.items));
        this.updateCartDisplay();
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.showNotification(`Added ${product.name} to cart`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clear() {
        this.items = [];
        this.saveCart();
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        
        if (cartCount) {
            const count = this.getItemCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
        
        if (cartTotal) {
            cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
        }

        // Update cart page if we're on it
        if (window.location.pathname.includes('cart.html') || document.getElementById('cart-items')) {
            this.renderCartPage();
        }
    }

    renderCartPage() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartMessage = document.getElementById('empty-cart');
        const cartSummary = document.getElementById('cart-summary');

        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
            if (cartSummary) cartSummary.style.display = 'none';
            cartItemsContainer.innerHTML = '';
            return;
        }

        if (emptyCartMessage) emptyCartMessage.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';

        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-brand">${item.brand}</p>
                    <p class="cart-item-price">$${item.price.toFixed(2)} ${item.unit ? '/ ' + item.unit : ''}</p>
                    ${!item.inStock ? '<p class="out-of-stock-badge">Out of Stock</p>' : ''}
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})" aria-label="Decrease quantity">
                            <span>−</span>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})" aria-label="Increase quantity">
                            <span>+</span>
                        </button>
                    </div>
                    <p class="cart-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-btn" onclick="cart.removeItem('${item.id}')" aria-label="Remove item">
                        Remove
                    </button>
                </div>
            </div>
        `).join('');

        // Update summary
        const subtotalEl = document.getElementById('subtotal');
        const taxEl = document.getElementById('tax');
        const totalEl = document.getElementById('total');

        const subtotal = this.getTotal();
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + tax;

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    async checkAvailability() {
        const productIds = this.items.map(item => item.id);
        const availability = await wholeFoodsAPI.checkAvailability(productIds);
        
        this.items.forEach(item => {
            item.inStock = availability[item.id] !== false;
        });
        
        this.saveCart();
        return this.items.filter(item => !item.inStock);
    }
}

// Initialize cart
const cart = new ShoppingCart();
