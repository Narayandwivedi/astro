import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import OrderModal from '../components/OrderModal';
import { useApi } from '../context/ApiContext';
import { useCart } from '../context/CartContext';

const ShopPage = () => {
  const api = useApi();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([
    { name: "All Products", value: "all" }
  ]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api.endpoints.products}?enabled=true&inStock=all`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.data || []);
        
        // Extract unique categories from products
        const uniqueCategories = [...new Set(data.data.map(product => product.category))];
        const categoryOptions = [
          { name: "All Products", value: "all" },
          ...uniqueCategories.map(cat => ({
            name: cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' '),
            value: cat
          }))
        ];
        setCategories(categoryOptions);
        
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleBuyNow = (product) => {
    addToCart(product, 1);
    navigate('/cart');
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleOrderModalClose = () => {
    setOrderModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="w-full">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              Spiritual Shop
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              आध्यात्मिक दुकान - Authentic Spiritual Products
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our collection of authentic Rudraksha, precious gemstones, yantras, and spiritual items. 
              All products are energized and blessed by Pandit Satya Prakash Tripathi for maximum benefits.
            </p>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              श्रेणी के अनुसार खरीदारी करें - Find What You Need
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: 'Rudraksha', icon: '🔮', color: 'from-orange-500 to-red-500', value: 'rudraksha' },
              { name: 'Gemstones', icon: '💎', color: 'from-blue-500 to-purple-500', value: 'gemstone' },
              { name: 'Mala', icon: '📿', color: 'from-green-500 to-teal-500', value: 'mala' },
              { name: 'Books', icon: '📚', color: 'from-yellow-500 to-orange-500', value: 'books' },
              { name: 'Yantras', icon: '🕉️', color: 'from-purple-500 to-pink-500', value: 'yantra' }
            ].map((category) => (
              <div
                key={category.value}
                onClick={() => navigate(`/shop/category/${category.value}`)}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-white text-center shadow-lg hover:shadow-xl transition-shadow`}>
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                  <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm font-medium">
                    Explore
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 font-medium">Filter Products by Category</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😞</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Products Found</h2>
              <p className="text-gray-600 mb-6">No products available in this category.</p>
              <button 
                onClick={() => setSelectedCategory('all')}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product._id} 
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
                  onClick={() => navigate(`/shop/product/${product._id}`)}
                >
                  
                  {/* Product Image */}
                  <div className="h-48 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center relative p-4">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={api.getImageURL(product.images.find(img => img.isPrimary) || product.images[0])}
                        alt={product.name}
                        className="w-32 h-32 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <span className="text-6xl">{product.icon || '🔮'}</span>
                    )}
                    {/* Fallback icon */}
                    <div className="hidden w-32 h-32 items-center justify-center">
                      <span className="text-6xl">{product.icon || '🔮'}</span>
                    </div>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <div className="bg-white bg-opacity-90 hover:bg-opacity-100 text-orange-600 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group-hover:scale-110">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-orange-600 font-medium mb-3">{product.nameHi}</p>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <p className="text-gray-700 text-xs mb-4 font-medium">
                      {product.descriptionHi}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {"★".repeat(Math.floor(product.rating || 4.5))}
                        {"☆".repeat(5 - Math.floor(product.rating || 4.5))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {product.rating || '4.5'} ({product.reviewCount || '50+'})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-orange-600">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <div className={`text-xs font-bold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {product.inStock ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                        >
                          🛒 Add to Cart
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyNow(product);
                          }}
                          className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                          Buy Now
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 px-4 bg-gray-300 text-gray-500 cursor-not-allowed rounded-lg font-semibold"
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Buy from Astro Satya?
            </h2>
            <p className="text-lg text-gray-600">
              हमसे क्यों खरीदें - Your Trusted Spiritual Partner
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Total Products Available: {products.length}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-green-600">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">100% Authentic</h3>
              <p className="text-gray-600">All products are genuine and certified for authenticity</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-orange-600">🔮</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Energized & Blessed</h3>
              <p className="text-gray-600">Products blessed with powerful mantras and rituals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-blue-600">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery across India with secure packaging</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-purple-600">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Guidance</h3>
              <p className="text-gray-600">Personal consultation for product selection and usage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-yellow-600">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need Help Choosing Products?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Get personalized recommendations from Pandit Satya Prakash Tripathi 
            based on your birth chart and specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/91883945431?text=Hi! I need help choosing the right spiritual products for me."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-600 font-semibold px-8 py-4 rounded-lg hover:bg-orange-50 transition-colors shadow-lg"
            >
              💬 WhatsApp Consultation
            </a>
            <a
              href="tel:+91883945431"
              className="bg-orange-700 text-white font-semibold px-8 py-4 rounded-lg hover:bg-orange-800 transition-colors shadow-lg"
            >
              📞 Call: +91 883945431
            </a>
          </div>
        </div>
      </section>

      {/* Order Modal */}
      <OrderModal 
        isOpen={orderModalOpen}
        onClose={handleOrderModalClose}
        product={selectedProduct}
      />

    </div>
  );
};

export default ShopPage;