
# Whole Foods Easy Order - Senior-Friendly Grocery Ordering Interface

A modern, streamlined, and accessible web application designed specifically for elderly users to order groceries from Whole Foods with ease.

## 🎯 Features

### Core Functionality
- **Senior-Friendly Interface**: Large fonts (20px+), high contrast colors, clear navigation
- **Simple Navigation**: Intuitive 3-click ordering process
- **Product Browsing**: Category-based shopping with clear product images
- **Smart Cart Management**: Easy quantity adjustment with large +/- buttons
- **Favorites System**: Save frequently purchased items for quick reordering
- **Quick Reorder**: One-click reorder of last purchase
- **Real-time Availability**: Integration with ProductAPI.dev for current product data
- **Substitution Management**: Pre-approve substitutes for out-of-stock items
- **Order History**: Track past orders and reorder easily

### Accessibility Features
- Minimum 20px font size (up to 40px for headings)
- High contrast color scheme
- Large touch targets (minimum 56px height)
- Clear focus indicators for keyboard navigation
- Screen reader compatible
- WCAG 2.1 AA compliant design

### Pre-configured User Information
- **Customer**: Dr. Thomas Peter Bridge
- **Email**: peterbridge140@gmail.com
- **Phone**: 973-545-6899
- **Delivery Address**: 1414 S Penn Square, Apt 36g, Philadelphia, PA 19102
- **Store**: Whole Foods Philly Center City (2101 Pennsylvania Ave, Philadelphia, PA 19130)

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- ProductAPI.dev API key (get one at https://productapi.dev)

### Installation

1. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or use a local server for better performance:
     ```bash
     # Using Python 3
     python3 -m http.server 8000
     
     # Using Node.js (with http-server)
     npx http-server
     ```

2. **Enter API Key**:
   - On first launch, you'll be prompted to enter your ProductAPI.dev API key
   - The key will be saved locally for future use
   - Get your API key at: https://productapi.dev

3. **Start Shopping**:
   - Browse products by category
   - Search for specific items
   - Add items to cart
   - Proceed to checkout

## 📁 Project Structure

```
wholefood-senior-order/
├── index.html              # Main shopping page
├── cart.html               # Shopping cart page
├── favorites.html          # Saved favorite items
├── checkout.html           # Checkout and delivery info
├── order-confirmation.html # Order confirmation page
├── css/
│   └── main.css           # All styling (senior-friendly design)
├── js/
│   ├── app.js             # Main application logic
│   ├── cart.js            # Shopping cart management
│   ├── preferences.js     # User preferences & favorites
│   └── wholefoodsAPI.js   # ProductAPI.dev integration
├── data/
│   └── user-profile.json  # Pre-filled user information
└── README.md              # This file
```

## 🎨 Design Philosophy

### Ultra-Modern & Minimalist
- Clean, uncluttered interface
- Clear visual hierarchy
- Obvious next steps at every stage
- No guessing required

### Senior-Friendly
- **Large Text**: 20-40px font sizes
- **High Contrast**: Dark text on light backgrounds
- **Big Buttons**: Minimum 56px height, easy to tap
- **Clear Labels**: No ambiguous icons or jargon
- **Simple Navigation**: Maximum 3 clicks to complete any task

### Color Scheme
- **Primary**: #00704A (Whole Foods Green)
- **Secondary**: #FF6B35 (Accent Orange)
- **Success**: #28A745 (Confirmation Green)
- **Background**: #FFFFFF (Clean White)
- **Text**: #1A1A1A (High Contrast Black)

## 🛠️ How to Use

### For Dr. Bridge (End User)

1. **Starting a New Order**:
   - Click "Start New Order" on the home page
   - Browse categories (Produce, Dairy, Meat, etc.)
   - Or use the search bar to find specific items

2. **Adding Items**:
   - Click on a category to see products
   - Click "Add to Cart" on any item
   - Click the ♥ button to save as favorite

3. **Managing Cart**:
   - Click "Cart" in the top navigation
   - Use +/- buttons to adjust quantities
   - Click "Remove" to delete items
   - Click "Proceed to Checkout" when ready

4. **Checkout**:
   - Your information is pre-filled
   - Select a delivery time
   - Add special instructions (optional)
   - Click "Place Order"

5. **Quick Reorder**:
   - Click "Quick Reorder" on home page
   - Your last order is automatically added to cart

### For Developers

#### Customizing User Profile
Edit `data/user-profile.json`:
```json
{
  "user": {
    "name": "Your Name",
    "email": "your@email.com",
    "phone": "123-456-7890",
    "deliveryAddress": {
      "street": "123 Main St",
      "apartment": "Apt 1",
      "city": "City",
      "state": "ST",
      "zipCode": "12345"
    }
  }
}
```

#### Adding Mock Products
Edit `js/wholefoodsAPI.js` in the `getMockProducts()` method to add more products.

#### Styling Adjustments
All styles are in `css/main.css`. Key CSS variables:
```css
:root {
    --font-base: 20px;      /* Base font size */
    --font-large: 24px;     /* Large text */
    --font-xlarge: 32px;    /* Extra large text */
    --primary-color: #00704A; /* Main brand color */
}
```

## 🔌 API Integration

### ProductAPI.dev Setup

1. Sign up at https://productapi.dev
2. Get your API key
3. Enter it when prompted in the app
4. The app will fetch real-time product data from Whole Foods

### API Features Used
- Product search
- Category browsing
- Availability checking
- Product details and images

### Fallback System
If the API is unavailable, the app uses mock data to ensure functionality.

## 💾 Data Storage

### Local Storage
The app uses browser localStorage to save:
- Shopping cart items
- Favorite products
- User preferences
- Order history
- API key

### Privacy
All data is stored locally on the user's device. No data is sent to external servers except for product information from ProductAPI.dev.

## 🔄 Future Enhancements

Potential features to add:
- [ ] Voice command integration
- [ ] Prescription medication ordering
- [ ] Meal planning suggestions
- [ ] Nutritional information display
- [ ] Recurring order scheduling
- [ ] Multiple delivery address support
- [ ] Payment integration
- [ ] Real-time order tracking

## 🐛 Troubleshooting

### Products Not Loading
- Check your internet connection
- Verify your API key is correct
- The app will use mock data if API fails

### Cart Not Saving
- Ensure browser allows localStorage
- Check browser privacy settings
- Try clearing cache and reloading

### Display Issues
- Ensure browser zoom is at 100%
- Try a different browser
- Clear browser cache

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📄 License

This project is created for personal use by Dr. Thomas Peter Bridge.

## 👨‍💻 Support

For technical support or questions:
- Review this README
- Check browser console for errors
- Ensure API key is valid

## 🙏 Acknowledgments

- Whole Foods Market for product inspiration
- ProductAPI.dev for product data integration
- Unsplash for product placeholder images

---

**Made with ❤️ for easier grocery shopping**
