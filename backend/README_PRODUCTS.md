# Products/Shop Backend API Documentation

## Overview
Complete backend implementation for managing spiritual products/shop with all features required for the Astro Satya e-commerce functionality.

## Database Schema (Product Model)

### Core Fields
- **nameEn/nameHi** (String): Product name in English and Hindi
- **descriptionEn/descriptionHi** (String): Product descriptions in both languages
- **price/originalPrice** (Number): Current and original pricing
- **discountPercentage** (Number): Auto-calculated discount
- **category** (String): Product categories (rudraksha, gemstone, yantra, etc.)
- **icon** (String): Emoji representation
- **images** (Array): Product images with URL, alt text, and primary flag

### Inventory Management
- **inStock** (Boolean): Stock availability status
- **stockQuantity** (Number): Available quantity
- **lowStockAlert** (Number): Alert threshold
- **isEnabled** (Boolean): Enable/disable product
- **isFeatured** (Boolean): Homepage featured products

### Product Specifications
- **specifications** (Object): Material, weight, size, color, origin, certification
- **spiritualBenefits** (Array): List of spiritual benefits
- **rulingPlanet** (String): Associated planet
- **chakra** (String): Associated chakra
- **mantra** (String): Associated mantra

### Usage & Care
- **usageInstructions** (Object): Instructions in English and Hindi
- **careInstructions** (Object): Care instructions in both languages
- **tags** (Array): Search and categorization tags

### Sales & Analytics
- **rating/reviewCount** (Number): Customer ratings and review counts
- **salesCount** (Number): Total sales tracking
- **viewCount** (Number): Product view tracking
- **sortOrder** (Number): Custom display order

### E-commerce Features
- **weight/dimensions** (Object): Shipping calculations
- **shippingClass** (String): Shipping category
- **whatsappMessage** (String): Pre-formatted WhatsApp message
- **slug** (String): SEO-friendly URL

## API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products with filters
- `GET /api/products/featured` - Get featured products for homepage
- `GET /api/products/categories` - Get product categories
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get single product (increments view count)
- `POST /api/products/:id/purchase` - Track purchase via WhatsApp

### Admin Endpoints
- `POST /api/products/admin/create` - Create new product
- `PUT /api/products/admin/:id` - Update product
- `DELETE /api/products/admin/:id` - Delete product
- `PATCH /api/products/admin/:id/status` - Enable/disable product
- `PATCH /api/products/admin/:id/stock` - Update stock levels
- `PATCH /api/products/admin/sort-order` - Update display order

## Query Parameters

### GET /api/products
- `category` - Filter by category ('all', 'rudraksha', 'gemstone', etc.)
- `enabled` - Filter by enabled status ('true', 'false', 'all')
- `inStock` - Filter by stock status ('true', 'false', 'all')
- `featured` - Filter featured products ('true')
- `search` - Search in names, descriptions, and tags
- `minPrice/maxPrice` - Price range filtering
- `page/limit` - Pagination (default: page=1, limit=20)
- `sort` - Sort options ('sortOrder', 'price-asc', 'price-desc', 'popular', 'rating', 'newest')

## Product Categories
- `rudraksha` - Rudraksha beads and accessories
- `gemstone` - Precious and semi-precious stones
- `yantra` - Sacred geometric designs
- `mala` - Prayer beads and rosaries
- `spiritual-items` - General spiritual items
- `books` - Spiritual and religious books
- `accessories` - Spiritual accessories
- `puja-items` - Puja and ritual items

## Usage Examples

### Get Featured Products for Homepage
```javascript
GET /api/products/featured?limit=6
```

### Get Products by Category
```javascript
GET /api/products?category=rudraksha&enabled=true&inStock=true
```

### Search Products
```javascript
GET /api/products/search?q=rudraksha&category=all
```

### Create New Product (Admin)
```javascript
POST /api/products/admin/create
{
  "nameEn": "7 Mukhi Rudraksha",
  "nameHi": "सात मुखी रुद्राक्ष",
  "descriptionEn": "Seven faced Rudraksha for wealth and prosperity...",
  "descriptionHi": "धन और समृद्धि के लिए सात मुखी रुद्राक्ष...",
  "price": 800,
  "originalPrice": 1200,
  "category": "rudraksha",
  "icon": "🔮",
  "inStock": true,
  "stockQuantity": 20,
  "spiritualBenefits": ["Wealth", "Prosperity", "Business Success"],
  "rulingPlanet": "Saturn",
  "specifications": {
    "material": "Natural Rudraksha",
    "size": "14-18mm",
    "origin": "Nepal"
  }
}
```

### Track Purchase
```javascript
POST /api/products/507f1f77bcf86cd799439011/purchase
{
  "quantity": 1
}
```

### Update Stock (Admin)
```javascript
PATCH /api/products/admin/507f1f77bcf86cd799439011/stock
{
  "stockQuantity": 15,
  "inStock": true
}
```

## Data Seeding

Run the seeder to populate with sample spiritual products:
```bash
node seeders/productSeeder.js
```

This creates 12 authentic spiritual products including:
- Rudraksha beads (1 Mukhi, 5 Mukhi)
- Gemstones (Neelam, Pukhraj, Ruby, Gomed)
- Malas (Sphatik, Tulsi)
- Yantras (Shree Yantra, Navgraha)
- Spiritual items (Parad Shivling, Gomti Chakra)

## Features Implemented

### Product Management
- ✅ Complete CRUD operations
- ✅ Enable/disable products
- ✅ Featured product marking
- ✅ Stock management
- ✅ Category-based organization

### E-commerce Features
- ✅ Price and discount management
- ✅ Inventory tracking with alerts
- ✅ WhatsApp integration for purchases
- ✅ Product view and sales analytics
- ✅ Search functionality

### Spiritual Product Features
- ✅ Ruling planet associations
- ✅ Chakra connections
- ✅ Spiritual benefits listing
- ✅ Usage and care instructions
- ✅ Mantra associations
- ✅ Authentic specifications

### API Features
- ✅ Advanced filtering and sorting
- ✅ Full-text search capabilities
- ✅ Pagination support
- ✅ Category management
- ✅ Analytics tracking
- ✅ Error handling and validation

## Integration with Frontend

### Homepage Shop Section
```javascript
// Get featured products for homepage
fetch('/api/products/featured?limit=6')
  .then(res => res.json())
  .then(data => {
    setFeaturedProducts(data.data);
  });
```

### Shop Page Integration
```javascript
// Get products by category with pagination
fetch(`/api/products?category=${selectedCategory}&page=${page}&limit=12`)
  .then(res => res.json())
  .then(data => {
    setProducts(data.data);
    setPagination(data.pagination);
  });
```

### Search Integration
```javascript
// Search products
fetch(`/api/products/search?q=${searchTerm}&category=${category}`)
  .then(res => res.json())
  .then(data => {
    setSearchResults(data.data);
  });
```

### WhatsApp Purchase Tracking
```javascript
// Track when user clicks WhatsApp buy button
fetch(`/api/products/${productId}/purchase`, { 
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ quantity: 1 })
})
.then(res => res.json())
.then(data => {
  console.log('Purchase tracked');
  // Redirect to WhatsApp
  window.open(`https://wa.me/91883945431?text=${product.whatsappMessage}`);
});
```

### Product Detail Page
```javascript
// Get single product (auto-increments view count)
fetch(`/api/products/${productId}`)
  .then(res => res.json())
  .then(data => {
    setProduct(data.data);
  });
```

## Virtual Fields

The Product model includes several computed virtual fields:

- **formattedPrice** - "₹8,500" format
- **formattedOriginalPrice** - "₹12,000" format
- **savings** - Calculated savings amount
- **formattedSavings** - "₹3,500" format
- **stockStatus** - 'in-stock', 'low-stock', or 'out-of-stock'
- **primaryImage** - First image marked as primary

## Advanced Features

### Smart Stock Management
- Automatic stock status updates
- Low stock alerts
- Out-of-stock auto-disable option

### SEO Optimization
- Auto-generated slugs from product names
- Meta descriptions for search engines
- Tag-based categorization

### Analytics & Reporting
- Sales count tracking
- View count monitoring
- Popular product identification
- Category performance metrics

## Next Steps

1. **Image Upload**: File upload system for product images
2. **Reviews**: Customer review and rating system
3. **Wishlist**: User wishlist functionality
4. **Recommendations**: AI-based product recommendations
5. **Inventory Alerts**: Email/SMS notifications for low stock
6. **Bulk Operations**: Bulk product import/export
7. **Advanced Search**: Filters by price, rating, availability
8. **Payment Integration**: Direct payment gateway integration

The products backend is now fully functional and ready to power your spiritual e-commerce store!

## Sample Data Included

The seeder includes authentic spiritual products:
- **Rudraksha**: 1 Mukhi (₹12,000), 5 Mukhi (₹500)
- **Gemstones**: Neelam (₹8,500), Pukhraj (₹6,500), Ruby (₹7,800), Gomed (₹3,200)
- **Malas**: Sphatik Mala (₹800), Tulsi Mala (₹600)
- **Yantras**: Shree Yantra (₹2,500), Navgraha Yantra (₹4,500)
- **Spiritual Items**: Parad Shivling (₹15,000), Gomti Chakra Set (₹450)

All products include complete bilingual descriptions, spiritual benefits, usage instructions, and authentic specifications!