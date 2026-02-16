// Whole Foods Product API Integration using ProductAPI.dev
class WholeFoodsAPI {
    constructor() {
        this.apiKey = ''; // Will be set from config
        this.baseURL = 'https://api.productapi.dev/v1';
        this.storeId = 'whole-foods-philly-center-city';
        this.cache = new Map();
        this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    async searchProducts(query, category = null) {
        try {
            const cacheKey = `search_${query}_${category}`;
            const cached = this.getFromCache(cacheKey);
            if (cached) return cached;

            const params = new URLSearchParams({
                q: query,
                store: 'whole-foods',
                limit: 50
            });

            if (category) {
                params.append('category', category);
            }

            const response = await fetch(`${this.baseURL}/products/search?${params}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const products = this.normalizeProducts(data.products || []);
            this.setCache(cacheKey, products);
            return products;
        } catch (error) {
            console.error('Error searching products:', error);
            return this.getMockProducts(query, category);
        }
    }

    async getProductsByCategory(category) {
        try {
            const cacheKey = `category_${category}`;
            const cached = this.getFromCache(cacheKey);
            if (cached) return cached;

            const response = await fetch(`${this.baseURL}/products/category/${category}?store=whole-foods&limit=50`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const products = this.normalizeProducts(data.products || []);
            this.setCache(cacheKey, products);
            return products;
        } catch (error) {
            console.error('Error fetching category products:', error);
            return this.getMockProducts(null, category);
        }
    }

    async checkAvailability(productIds) {
        try {
            const response = await fetch(`${this.baseURL}/products/availability`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productIds: productIds,
                    store: 'whole-foods',
                    zipCode: '19130'
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data.availability || {};
        } catch (error) {
            console.error('Error checking availability:', error);
            // Return mock availability
            const availability = {};
            productIds.forEach(id => {
                availability[id] = Math.random() > 0.2; // 80% available
            });
            return availability;
        }
    }

    normalizeProducts(products) {
        return products.map(product => ({
            id: product.id || product.upc || `product_${Date.now()}_${Math.random()}`,
            name: product.name || product.title,
            brand: product.brand || 'Whole Foods',
            price: product.price || product.currentPrice || 0,
            originalPrice: product.originalPrice || product.price,
            image: product.image || product.imageUrl || 'images/placeholder.jpg',
            category: product.category || 'General',
            description: product.description || '',
            inStock: product.inStock !== false,
            unit: product.unit || 'each',
            organic: product.organic || false,
            size: product.size || ''
        }));
    }

    getMockProducts(query = null, category = null) {
        const mockProducts = [
            // Produce
            { id: 'prod_001', name: 'Organic Bananas', brand: '365 Everyday Value', price: 0.79, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', category: 'Produce', unit: 'lb', organic: true, inStock: true },
            { id: 'prod_002', name: 'Organic Avocados', brand: 'Whole Foods', price: 2.49, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400', category: 'Produce', unit: 'each', organic: true, inStock: true },
            { id: 'prod_003', name: 'Baby Spinach', brand: '365 Everyday Value', price: 3.99, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', category: 'Produce', unit: '5 oz', organic: true, inStock: true },
            { id: 'prod_004', name: 'Organic Strawberries', brand: 'Whole Foods', price: 5.99, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400', category: 'Produce', unit: '16 oz', organic: true, inStock: true },
            { id: 'prod_005', name: 'Organic Blueberries', brand: 'Whole Foods', price: 4.99, image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400', category: 'Produce', unit: '6 oz', organic: true, inStock: true },
            
            // Dairy
            { id: 'dairy_001', name: 'Organic Whole Milk', brand: '365 Everyday Value', price: 5.99, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', category: 'Dairy', unit: 'half gallon', organic: true, inStock: true },
            { id: 'dairy_002', name: 'Greek Yogurt', brand: 'Chobani', price: 1.49, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', category: 'Dairy', unit: '5.3 oz', organic: false, inStock: true },
            { id: 'dairy_003', name: 'Organic Eggs', brand: 'Vital Farms', price: 7.99, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', category: 'Dairy', unit: 'dozen', organic: true, inStock: true },
            { id: 'dairy_004', name: 'Butter', brand: 'Kerrygold', price: 4.99, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', category: 'Dairy', unit: '8 oz', organic: false, inStock: true },
            
            // Meat & Seafood
            { id: 'meat_001', name: 'Organic Chicken Breast', brand: 'Whole Foods', price: 9.99, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400', category: 'Meat', unit: 'lb', organic: true, inStock: true },
            { id: 'meat_002', name: 'Wild Salmon Fillet', brand: 'Whole Foods', price: 14.99, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', category: 'Seafood', unit: 'lb', organic: false, inStock: true },
            { id: 'meat_003', name: 'Ground Beef 85/15', brand: 'Whole Foods', price: 7.99, image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400', category: 'Meat', unit: 'lb', organic: false, inStock: true },
            
            // Bakery
            { id: 'bakery_001', name: 'Sourdough Bread', brand: 'Whole Foods Bakery', price: 4.99, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', category: 'Bakery', unit: 'loaf', organic: false, inStock: true },
            { id: 'bakery_002', name: 'Croissants', brand: 'Whole Foods Bakery', price: 5.99, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', category: 'Bakery', unit: '4 pack', organic: false, inStock: true },
            
            // Pantry
            { id: 'pantry_001', name: 'Organic Pasta', brand: '365 Everyday Value', price: 2.49, image: 'https://images.unsplash.com/photo-1551462147-37cbd8c5d00f?w=400', category: 'Pantry', unit: '16 oz', organic: true, inStock: true },
            { id: 'pantry_002', name: 'Olive Oil', brand: 'California Olive Ranch', price: 12.99, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', category: 'Pantry', unit: '25.4 oz', organic: false, inStock: true },
            { id: 'pantry_003', name: 'Organic Rice', brand: '365 Everyday Value', price: 4.99, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', category: 'Pantry', unit: '2 lb', organic: true, inStock: true },
            { id: 'pantry_004', name: 'Almond Butter', brand: 'Justin\'s', price: 8.99, image: 'https://images.unsplash.com/photo-1520869562399-e772f042f422?w=400', category: 'Pantry', unit: '16 oz', organic: true, inStock: true },
            
            // Beverages
            { id: 'bev_001', name: 'Orange Juice', brand: '365 Everyday Value', price: 4.99, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', category: 'Beverages', unit: '52 oz', organic: true, inStock: true },
            { id: 'bev_002', name: 'Sparkling Water', brand: 'La Croix', price: 5.99, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400', category: 'Beverages', unit: '12 pack', organic: false, inStock: true },
            { id: 'bev_003', name: 'Green Tea', brand: 'Yogi', price: 6.49, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400', category: 'Beverages', unit: '16 bags', organic: true, inStock: true }
        ];

        let filtered = mockProducts;

        if (category) {
            filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }

        if (query) {
            const searchTerm = query.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm) || 
                p.brand.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm)
            );
        }

        return filtered;
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }
}

// Export for use in other files
const wholeFoodsAPI = new WholeFoodsAPI();
