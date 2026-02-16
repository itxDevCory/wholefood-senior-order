// User Preferences Management
class PreferencesManager {
    constructor() {
        this.preferences = {
            favoriteItems: [],
            dietaryRestrictions: [],
            preferredBrands: [],
            substitutionRules: {},
            recentOrders: []
        };
        this.loadPreferences();
    }

    loadPreferences() {
        const saved = localStorage.getItem('wholefood_preferences');
        if (saved) {
            this.preferences = { ...this.preferences, ...JSON.parse(saved) };
        }
    }

    savePreferences() {
        localStorage.setItem('wholefood_preferences', JSON.stringify(this.preferences));
    }

    addFavorite(product) {
        const exists = this.preferences.favoriteItems.find(item => item.id === product.id);
        if (!exists) {
            this.preferences.favoriteItems.push({
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                image: product.image,
                category: product.category,
                addedAt: new Date().toISOString()
            });
            this.savePreferences();
            return true;
        }
        return false;
    }

    removeFavorite(productId) {
        this.preferences.favoriteItems = this.preferences.favoriteItems.filter(
            item => item.id !== productId
        );
        this.savePreferences();
    }

    isFavorite(productId) {
        return this.preferences.favoriteItems.some(item => item.id === productId);
    }

    getFavorites() {
        return this.preferences.favoriteItems;
    }

    addDietaryRestriction(restriction) {
        if (!this.preferences.dietaryRestrictions.includes(restriction)) {
            this.preferences.dietaryRestrictions.push(restriction);
            this.savePreferences();
        }
    }

    removeDietaryRestriction(restriction) {
        this.preferences.dietaryRestrictions = this.preferences.dietaryRestrictions.filter(
            r => r !== restriction
        );
        this.savePreferences();
    }

    addPreferredBrand(brand) {
        if (!this.preferences.preferredBrands.includes(brand)) {
            this.preferences.preferredBrands.push(brand);
            this.savePreferences();
        }
    }

    removePreferredBrand(brand) {
        this.preferences.preferredBrands = this.preferences.preferredBrands.filter(
            b => b !== brand
        );
        this.savePreferences();
    }

    addSubstitutionRule(originalProductId, substituteProductId, substituteProduct) {
        this.preferences.substitutionRules[originalProductId] = {
            substituteId: substituteProductId,
            substituteName: substituteProduct.name,
            substituteBrand: substituteProduct.brand,
            substituteImage: substituteProduct.image,
            addedAt: new Date().toISOString()
        };
        this.savePreferences();
    }

    removeSubstitutionRule(originalProductId) {
        delete this.preferences.substitutionRules[originalProductId];
        this.savePreferences();
    }

    getSubstitute(productId) {
        return this.preferences.substitutionRules[productId];
    }

    saveOrder(orderData) {
        const order = {
            id: `order_${Date.now()}`,
            items: orderData.items,
            total: orderData.total,
            date: new Date().toISOString(),
            deliveryTime: orderData.deliveryTime
        };

        this.preferences.recentOrders.unshift(order);
        
        // Keep only last 10 orders
        if (this.preferences.recentOrders.length > 10) {
            this.preferences.recentOrders = this.preferences.recentOrders.slice(0, 10);
        }

        this.savePreferences();
        return order;
    }

    getRecentOrders() {
        return this.preferences.recentOrders;
    }

    getLastOrder() {
        return this.preferences.recentOrders[0] || null;
    }

    reorderLastOrder() {
        const lastOrder = this.getLastOrder();
        if (lastOrder) {
            cart.clear();
            lastOrder.items.forEach(item => {
                cart.addItem(item, item.quantity);
            });
            return true;
        }
        return false;
    }

    exportPreferences() {
        return JSON.stringify(this.preferences, null, 2);
    }

    importPreferences(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.preferences = { ...this.preferences, ...imported };
            this.savePreferences();
            return true;
        } catch (error) {
            console.error('Error importing preferences:', error);
            return false;
        }
    }

    renderFavoritesPage() {
        const favoritesContainer = document.getElementById('favorites-list');
        if (!favoritesContainer) return;

        const favorites = this.getFavorites();

        if (favorites.length === 0) {
            favoritesContainer.innerHTML = `
                <div class="empty-state">
                    <p>No favorite items yet</p>
                    <p class="empty-state-subtitle">Add items to your favorites for quick access</p>
                    <a href="index.html" class="btn btn-primary">Browse Products</a>
                </div>
            `;
            return;
        }

        favoritesContainer.innerHTML = favorites.map(item => `
            <div class="product-card" data-product-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${item.name}</h3>
                    <p class="product-brand">${item.brand}</p>
                    <p class="product-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCartFromFavorites('${item.id}')">
                        Add to Cart
                    </button>
                    <button class="btn btn-secondary" onclick="preferences.removeFavorite('${item.id}'); preferences.renderFavoritesPage();">
                        Remove
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Initialize preferences manager
const preferences = new PreferencesManager();

// Helper function to add from favorites
async function addToCartFromFavorites(productId) {
    const favorite = preferences.getFavorites().find(item => item.id === productId);
    if (favorite) {
        cart.addItem(favorite, 1);
    }
}
