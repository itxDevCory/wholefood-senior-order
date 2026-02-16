// Main Application Logic
class WholeFoodApp {
    constructor() {
        this.currentCategory = null;
        this.currentProducts = [];
        this.apiKeySet = false;
        this.init();
    }

    async init() {
        // Load user profile
        await this.loadUserProfile();
        
        // Check for API key
        this.checkApiKey();
        
        // Update cart display
        cart.updateCartDisplay();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load initial content based on page
        this.loadPageContent();
    }

    async loadUserProfile() {
        try {
            const response = await fetch('data/user-profile.json');
            this.userProfile = await response.json();
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    checkApiKey() {
        const savedKey = localStorage.getItem('wholefood_api_key');
        if (savedKey) {
            wholeFoodsAPI.setApiKey(savedKey);
            this.apiKeySet = true;
        } else {
            this.promptForApiKey();
        }
    }

    promptForApiKey() {
        const modal = document.getElementById('api-key-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    saveApiKey() {
        const input = document.getElementById('api-key-input');
        if (input && input.value.trim()) {
            const apiKey = input.value.trim();
            localStorage.setItem('wholefood_api_key', apiKey);
            wholeFoodsAPI.setApiKey(apiKey);
            this.apiKeySet = true;
            
            const modal = document.getElementById('api-key-modal');
            if (modal) {
                modal.style.display = 'none';
            }
            
            // Reload products if on main page
            if (this.currentCategory) {
                this.loadCategory(this.currentCategory);
            }
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                if (searchInput) {
                    this.performSearch(searchInput.value);
                }
            });
        }

        // API Key modal
        const saveApiKeyBtn = document.getElementById('save-api-key');
        if (saveApiKeyBtn) {
            saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
        }

        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.loadCategory(category);
            });
        });
    }

    loadPageContent() {
        const path = window.location.pathname;
        
        if (path.includes('index.html') || path.endsWith('/')) {
            this.loadHomePage();
        } else if (path.includes('cart.html')) {
            cart.renderCartPage();
        } else if (path.includes('favorites.html')) {
            preferences.renderFavoritesPage();
        } else if (path.includes('checkout.html')) {
            this.loadCheckoutPage();
        }
    }

    async loadHomePage() {
        // Load featured/popular products
        const featuredContainer = document.getElementById('featured-products');
        if (featuredContainer) {
            this.showLoading(featuredContainer);
            const products = await wholeFoodsAPI.getMockProducts();
            this.renderProducts(products.slice(0, 8), featuredContainer);
        }
    }

    async loadCategory(category) {
        this.currentCategory = category;
        const productsContainer = document.getElementById('products-grid');
        
        if (!productsContainer) return;

        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        this.showLoading(productsContainer);
        
        const products = await wholeFoodsAPI.getProductsByCategory(category);
        this.currentProducts = products;
        this.renderProducts(products, productsContainer);
    }

    async performSearch(query) {
        if (!query.trim()) return;

        const productsContainer = document.getElementById('products-grid') || 
                                 document.getElementById('search-results');
        
        if (!productsContainer) return;

        this.showLoading(productsContainer);
        
        const products = await wholeFoodsAPI.searchProducts(query);
        this.currentProducts = products;
        this.renderProducts(products, productsContainer);

        // Update page title if exists
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = `Search Results for "${query}"`;
        }
    }

    renderProducts(products, container) {
        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No products found</p>
                    <p class="empty-state-subtitle">Try a different search or category</p>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                    ${product.organic ? '<span class="organic-badge">Organic</span>' : ''}
                    ${!product.inStock ? '<span class="out-of-stock-badge">Out of Stock</span>' : ''}
                    <button class="favorite-btn ${preferences.isFavorite(product.id) ? 'active' : ''}" 
                            onclick="app.toggleFavorite('${product.id}')"
                            aria-label="Add to favorites">
                        ♥
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-brand">${product.brand}</p>
                    <div class="product-price-row">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        ${product.unit ? `<span class="product-unit">/ ${product.unit}</span>` : ''}
                    </div>
                </div>
                <button class="btn btn-primary add-to-cart-btn" 
                        onclick="app.addToCart('${product.id}')"
                        ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        `).join('');
    }

    showLoading(container) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading products...</p>
            </div>
        `;
    }

    addToCart(productId) {
        const product = this.currentProducts.find(p => p.id === productId);
        if (product) {
            cart.addItem(product, 1);
        }
    }

    toggleFavorite(productId) {
        const product = this.currentProducts.find(p => p.id === productId);
        if (product) {
            if (preferences.isFavorite(productId)) {
                preferences.removeFavorite(productId);
            } else {
                preferences.addFavorite(product);
            }
            
            // Update button state
            const btn = document.querySelector(`[data-product-id="${productId}"] .favorite-btn`);
            if (btn) {
                btn.classList.toggle('active');
            }
        }
    }

    loadCheckoutPage() {
        // Pre-fill user information
        if (this.userProfile) {
            const user = this.userProfile.user;
            
            const fields = {
                'customer-name': user.name,
                'customer-email': user.email,
                'customer-phone': user.phone,
                'delivery-address': `${user.deliveryAddress.street}, ${user.deliveryAddress.apartment}`,
                'delivery-city': user.deliveryAddress.city,
                'delivery-state': user.deliveryAddress.state,
                'delivery-zip': user.deliveryAddress.zipCode
            };

            Object.keys(fields).forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = fields[fieldId];
                }
            });
        }

        // Update order summary
        this.updateCheckoutSummary();
    }

    updateCheckoutSummary() {
        const items = cart.items;
        const subtotal = cart.getTotal();
        const tax = subtotal * 0.08;
        const deliveryFee = subtotal > 35 ? 0 : 9.95;
        const total = subtotal + tax + deliveryFee;

        const summaryEl = document.getElementById('checkout-items-summary');
        if (summaryEl) {
            summaryEl.innerHTML = items.map(item => `
                <div class="checkout-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
        }

        const updateField = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = `$${value.toFixed(2)}`;
        };

        updateField('checkout-subtotal', subtotal);
        updateField('checkout-tax', tax);
        updateField('checkout-delivery', deliveryFee);
        updateField('checkout-total', total);
    }

    async placeOrder() {
        const deliveryTime = document.getElementById('delivery-time')?.value;
        const specialInstructions = document.getElementById('special-instructions')?.value;

        if (!deliveryTime) {
            alert('Please select a delivery time');
            return;
        }

        // Check availability before placing order
        const unavailableItems = await cart.checkAvailability();
        
        if (unavailableItems.length > 0) {
            const proceed = confirm(
                `The following items are out of stock:\n${unavailableItems.map(i => i.name).join('\n')}\n\nWould you like to proceed without these items?`
            );
            
            if (!proceed) return;
            
            // Remove unavailable items
            unavailableItems.forEach(item => cart.removeItem(item.id));
        }

        const orderData = {
            items: cart.items,
            total: cart.getTotal(),
            deliveryTime: deliveryTime,
            specialInstructions: specialInstructions,
            customer: this.userProfile?.user
        };

        // Save order to history
        const order = preferences.saveOrder(orderData);

        // Clear cart
        cart.clear();

        // Show confirmation
        window.location.href = `order-confirmation.html?orderId=${order.id}`;
    }

    quickReorder() {
        const success = preferences.reorderLastOrder();
        if (success) {
            window.location.href = 'cart.html';
        } else {
            alert('No previous orders found');
        }
    }
}

// Initialize app
const app = new WholeFoodApp();

// Make functions available globally for onclick handlers
window.app = app;
window.cart = cart;
window.preferences = preferences;
