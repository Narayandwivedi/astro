# Services Backend API Documentation

## Overview
Complete backend implementation for managing astrological services with all features required for the Astro Satya website.

## Database Schema (Service Model)

### Fields
- **titleEn** (String): Service name in English
- **titleHi** (String): Service name in Hindi
- **descriptionEn** (String): Service description in English  
- **descriptionHi** (String): Service description in Hindi
- **price** (Number): Current service price
- **originalPrice** (Number): Original price before discount
- **discountPercentage** (Number): Auto-calculated discount percentage
- **duration** (String): Service consultation duration
- **category** (String): Service category (Personal, Business, etc.)
- **icon** (String): Emoji icon for the service
- **isEnabled** (Boolean): Enable/disable service
- **isPopular** (Boolean): Mark as popular service
- **features** (Array): List of service features
- **availableOnline/Offline** (Boolean): Booking options
- **slug** (String): Auto-generated URL slug
- **bookingCount** (Number): Track number of bookings
- **rating** (Number): Service rating (0-5)
- **reviewCount** (Number): Number of reviews
- **sortOrder** (Number): Custom sort order

## API Endpoints

### Public Endpoints
- `GET /api/services` - Get all services with filters
- `GET /api/services/popular` - Get popular services for homepage
- `GET /api/services/categories` - Get service categories
- `GET /api/services/:id` - Get service by ID or slug
- `POST /api/services/:id/book` - Increment booking count

### Admin Endpoints
- `POST /api/services/admin/create` - Create new service
- `PUT /api/services/admin/:id` - Update service
- `DELETE /api/services/admin/:id` - Delete service
- `PATCH /api/services/admin/:id/status` - Enable/disable service
- `PATCH /api/services/admin/sort-order` - Update sort order

## Query Parameters

### GET /api/services
- `category` - Filter by category ('all', 'Personal', 'Business', etc.)
- `enabled` - Filter by enabled status ('true', 'false', 'all')
- `popular` - Filter popular services ('true')
- `page` - Page number for pagination (default: 1)
- `limit` - Items per page (default: 50)
- `sort` - Sort options ('sortOrder', 'price-asc', 'price-desc', 'popular', 'newest')

## Usage Examples

### Get All Enabled Services
```javascript
GET /api/services?enabled=true&category=all
```

### Get Popular Services for Homepage
```javascript
GET /api/services/popular?limit=6
```

### Get Services by Category
```javascript
GET /api/services?category=Personal&enabled=true
```

### Create New Service (Admin)
```javascript
POST /api/services/admin/create
{
  "titleEn": "New Service",
  "titleHi": "नई सेवा",
  "descriptionEn": "Service description...",
  "descriptionHi": "सेवा विवरण...",
  "price": 1500,
  "originalPrice": 2000,
  "duration": "45 mins",
  "category": "Personal",
  "icon": "🔮",
  "isPopular": false,
  "features": ["Feature 1", "Feature 2"]
}
```

### Enable/Disable Service
```javascript
PATCH /api/services/admin/:id/status
{
  "enabled": false
}
```

## Data Seeding

Run the seeder to populate with all 15 services from your website:
```bash
node seeders/serviceSeeder.js
```

## Features

### Service Management
- ✅ Create, read, update, delete services
- ✅ Enable/disable services
- ✅ Popular service marking
- ✅ Custom sort ordering
- ✅ Category-based filtering

### Data Features
- ✅ Bilingual support (English/Hindi)
- ✅ Price and discount management
- ✅ Auto-generated URL slugs
- ✅ Booking count tracking
- ✅ Rating and review system
- ✅ Service features listing

### API Features  
- ✅ Pagination support
- ✅ Multiple sort options
- ✅ Category filtering
- ✅ Search and filtering
- ✅ Error handling
- ✅ Input validation

## Integration with Frontend

### Homepage Integration
```javascript
// Get popular services for homepage
fetch('/api/services/popular?limit=6')
  .then(res => res.json())
  .then(data => {
    setTopServices(data.data);
  });
```

### Services Page Integration
```javascript
// Get services by category
fetch(`/api/services?category=${selectedCategory}&enabled=true`)
  .then(res => res.json())
  .then(data => {
    setServices(data.data);
  });
```

### Booking Integration
```javascript
// Track booking when user clicks "Book Now"
fetch(`/api/services/${serviceId}/book`, { method: 'POST' })
  .then(res => res.json())
  .then(data => {
    console.log('Booking tracked');
  });
```

## Next Steps

1. **Authentication**: Add admin authentication middleware
2. **Validation**: Enhanced input validation
3. **Images**: Add image upload for service icons
4. **Search**: Full-text search functionality
5. **Analytics**: Service performance tracking
6. **Caching**: Redis caching for popular endpoints

The backend is now ready to serve your services with all the functionality needed for the Astro Satya website!