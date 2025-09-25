import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import OrderModal from '../components/OrderModal';
import { AppContext } from '../context/AppContext';
import { useCart } from '../context/CartContext';

const ShopPage = () => {
  const { BACKEND_URL, getImageURL } = useContext(AppContext);
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 12;


  // SEO optimization
  useEffect(() => {
    document.title = 'Spiritual Products Shop | Authentic Rudraksha, Gemstones & Yantras by Acharya Satya Prakash';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Shop authentic spiritual products from Astro Satya Prakash. Buy original Rudraksha, precious gemstones, powerful yantras, spiritual books, and blessed malas. All products energized by expert astrologer Acharya Satya Prakash Tripathi. Free shipping across India.');
    }

    let structuredData = document.querySelector('script[type="application/ld+json"][data-page="shop"]');
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.type = 'application/ld+json';
      structuredData.setAttribute('data-page', 'shop');
      document.head.appendChild(structuredData);
    }

    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Spiritual Products Shop",
      "description": "Authentic spiritual products including Rudraksha, gemstones, yantras, malas, and spiritual books. All products blessed and energized by expert astrologer Acharya Satya Prakash Tripathi",
      "url": "https://astrosatyaprakash.com/shop",
      "mainEntity": {
        "@type": "Store",
        "name": "Astro Satya Prakash Spiritual Store",
        "description": "Online spiritual products store offering authentic Rudraksha, gemstones, yantras, and spiritual items",
        "url": "https://astrosatyaprakash.com/shop",
        "founder": {
          "@type": "Person",
          "name": "Acharya Satya Prakash Tripathi",
          "jobTitle": "Vedic Astrologer & Spiritual Guide"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Spiritual Products Catalog",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Rudraksha Beads",
                "description": "Original Rudraksha beads from Nepal, energized with mantras",
                "category": "Spiritual Products"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Precious Gemstones",
                "description": "Natural gemstones for astrological benefits and healing",
                "category": "Gemstones"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Sacred Yantras",
                "description": "Powerful yantras for prosperity, protection, and spiritual growth",
                "category": "Yantras"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Spiritual Malas",
                "description": "Prayer beads and malas for meditation and spiritual practice",
                "category": "Malas"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Spiritual Books",
                "description": "Books on astrology, spirituality, and Vedic knowledge",
                "category": "Books"
              }
            }
          ]
        },
        "paymentAccepted": ["Cash", "Credit Card", "UPI", "Bank Transfer"],
        "currenciesAccepted": "INR",
        "areaServed": {
          "@type": "Country",
          "name": "India"
        }
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://astrosatyaprakash.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Shop",
            "item": "https://astrosatyaprakash.com/shop"
          }
        ]
      }
    });

    return () => {
      const script = document.querySelector('script[data-page="shop"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Build query parameters with pagination
        const queryParams = new URLSearchParams({
          enabled: 'true',
          inStock: 'all',
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        });

        // Add category filter if not "all"
        if (selectedCategory !== 'all') {
          queryParams.append('category', selectedCategory);
        }

        const response = await fetch(`${BACKEND_URL}/api/products?${queryParams}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.data || []);

        // Set pagination info from backend response
        if (data.pagination) {
          setTotalPages(data.pagination.pages);
          setTotalProducts(data.pagination.total);
        }

      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [BACKEND_URL, selectedCategory, currentPage, itemsPerPage]);

  // Reset current page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Fetch categories separately (only once)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/products/categories`);
        if (response.ok) {
          const data = await response.json();
          const categoryOptions = [
            { name: "All Products", value: "all" },
            ...data.data.map(cat => ({
              name: cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' '),
              value: cat
            }))
          ];
          setCategories(categoryOptions);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, [BACKEND_URL]);

  // Products are already filtered and paginated by the server
  const currentProducts = products;

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
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full cosmic-stars"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/5 via-yellow-900/5 to-orange-900/5"></div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center bg-white/90 backdrop-blur-sm border border-orange-300 rounded-full px-6 py-2 mb-6 shadow-lg">
              <span className="text-orange-600 text-sm font-semibold">🛍️ Authentic Spiritual Products</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="text-gray-800">Spiritual</span><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600">Shop</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 font-medium">
              आध्यात्मिक दुकान - Blessed by <strong>Acharya Satya Prakash Tripathi</strong>
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Discover our exclusive collection of <strong>authentic Rudraksha, precious gemstones, powerful yantras, and sacred spiritual items</strong>.
              Every product is personally energized and blessed with powerful mantras by expert astrologer Acharya Satya Prakash Tripathi for maximum spiritual benefits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#products"
                className="bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 hover:from-orange-700 hover:via-yellow-700 hover:to-orange-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                🛍️ Shop Now
              </a>
              <a
                href="https://wa.me/918839453431?text=Hi! I need help choosing spiritual products."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-gray-50 text-orange-800 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-orange-300 hover:border-orange-400 transform hover:-translate-y-1"
              >
                💬 Expert Guidance
              </a>
            </div>
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
      <section id="products" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
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
          ) : currentProducts.length === 0 ? (
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
              {currentProducts.map((product) => (
                <Link 
                  key={product._id} 
                  to={`/shop/product/${product._id}`}
                  onClick={() => window.scrollTo(0, 0)}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-orange-300 transform hover:-translate-y-1 cursor-pointer block"
                >
                  
                  {/* Product Image - Clean Image Only */}
                  {product.images && product.images.length > 0 && (
                    <div className="h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-50 relative flex items-center justify-center p-4">
                      <img 
                        src={getImageURL(product.images.find(img => img.isPrimary) || product.images[0])}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><span class="text-4xl">🔸</span></div>';
                        }}
                      />
                    </div>
                  )}

                  {/* Product Info - Amazon Style */}
                  <div className="p-3">
                    {/* Product Name */}
                    <div className="mb-2">
                      <h3 className="text-gray-800 font-medium text-sm sm:text-base line-clamp-2 leading-tight">{product.name}</h3>
                      {product.nameHi && (
                        <p className="text-gray-600 text-xs mt-1">{product.nameHi}</p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg sm:text-xl font-bold text-purple-600">₹{product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {product.inStock ? (
                      <div className="flex gap-2">
                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 text-sm flex items-center justify-center"
                        >
                          <span className="mr-1">🛒</span>
                          <span>Add to Cart</span>
                        </button>

                        {/* Buy Now Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleBuyNow(product);
                          }}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm flex items-center justify-center"
                        >
                          <span className="mr-1">⚡</span>
                          <span>Buy</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-400 text-white font-semibold py-2 px-3 rounded-lg cursor-not-allowed opacity-60 text-sm flex items-center justify-center"
                      >
                        <span className="mr-1">❌</span>
                        <span>Out of Stock</span>
                      </button>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-orange-300 text-orange-600 hover:bg-orange-50 cursor-pointer'
                  }`}
                >
                  ← Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {/* Show first page */}
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => {
                          setCurrentPage(1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-3 py-2 rounded-lg bg-white border border-orange-300 text-orange-600 hover:bg-orange-50 cursor-pointer"
                      >
                        1
                      </button>
                      {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
                    </>
                  )}

                  {/* Show current page and surrounding pages */}
                  {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .filter(page =>
                      page >= Math.max(1, currentPage - 2) &&
                      page <= Math.min(totalPages, currentPage + 2)
                    )
                    .map(page => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                          currentPage === page
                            ? 'bg-orange-600 text-white'
                            : 'bg-white border border-orange-300 text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  {/* Show last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="px-2 text-gray-500">...</span>}
                      <button
                        onClick={() => {
                          setCurrentPage(totalPages);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-3 py-2 rounded-lg bg-white border border-orange-300 text-orange-600 hover:bg-orange-50 cursor-pointer"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-orange-300 text-orange-600 hover:bg-orange-50 cursor-pointer'
                  }`}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Pagination Info */}
          {currentProducts.length > 0 && (
            <div className="mt-6 text-center text-gray-600">
              <p className="text-sm">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                {selectedCategory !== 'all' && ` in ${categories.find(cat => cat.value === selectedCategory)?.name}`}
              </p>
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
              Total Products Available: {totalProducts}
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
              href="https://wa.me/918839453431?text=Hi! I need help choosing the right spiritual products for me."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-600 font-semibold px-8 py-4 rounded-lg hover:bg-orange-50 transition-colors shadow-lg"
            >
              💬 WhatsApp Consultation
            </a>
            <a
              href="tel:+918839453431"
              className="bg-orange-700 text-white font-semibold px-8 py-4 rounded-lg hover:bg-orange-800 transition-colors shadow-lg"
            >
              📞 Call: +91 8839453431
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