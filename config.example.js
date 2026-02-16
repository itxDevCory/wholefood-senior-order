// Configuration Example
// Copy this file to config.js and add your API key

const CONFIG = {
    // Get your API key from https://productapi.dev
    PRODUCT_API_KEY: 'your-api-key-here',
    
    // Store configuration
    STORE: {
        name: 'Whole Foods Philly Center City',
        address: '2101 Pennsylvania Ave',
        city: 'Philadelphia',
        state: 'PA',
        zipCode: '19130',
        phone: '215-557-0015'
    },
    
    // Delivery configuration
    DELIVERY: {
        freeDeliveryThreshold: 35.00,
        deliveryFee: 9.95,
        taxRate: 0.08
    },
    
    // UI configuration
    UI: {
        productsPerPage: 50,
        cacheExpiryMinutes: 30,
        showOrganicBadge: true,
        enableVoiceCommands: false
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
