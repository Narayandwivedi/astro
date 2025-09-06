import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import OrderModal from '../components/OrderModal';
import { useApi } from '../context/ApiContext';
import { useCart } from '../context/CartContext';

const CategoryPage = () => {
  const api = useApi();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('sortOrder');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Category display information
  const categoryInfo = {
    rudraksha: {
      title: 'Rudraksha Collection',
      titleHi: 'रुद्राक्ष संग्रह',
      description: 'Sacred Rudraksha beads blessed with divine energy for spiritual growth and protection.',
      descriptionHi: 'आध्यात्मिक विकास और सुरक्षा के लिए दिव्य ऊर्जा से भरे पवित्र रुद्राक्ष मनके।',
      icon: '🔮',
      color: 'from-orange-500 to-red-500'
    },
    gemstone: {
      title: 'Gemstone Collection',
      titleHi: 'रत्न संग्रह',
      description: 'Authentic gemstones with powerful healing properties and astrological benefits.',
      descriptionHi: 'शक्तिशाली उपचार गुणों और ज्योतिषीय लाभों के साथ प्रामाणिक रत्न।',
      icon: '💎',
      color: 'from-blue-500 to-purple-500'
    },
    mala: {
      title: 'Mala Collection',
      titleHi: 'माला संग्रह',
      description: 'Sacred prayer malas crafted for meditation and spiritual practice.',
      descriptionHi: 'ध्यान और आध्यात्मिक साधना के लिए बनाई गई पवित्र प्रार्थना माला।',
      icon: '📿',
      color: 'from-green-500 to-teal-500'
    },
    books: {
      title: 'Spiritual Books',
      titleHi: 'आध्यात्मिक पुस्तकें',
      description: 'Ancient wisdom and spiritual knowledge in carefully curated books.',
      descriptionHi: 'सावधानीपूर्वक चुनी गई पुस्तकों में प्राचीन ज्ञान और आध्यात्मिक जानकारी।',
      icon: '📚',
      color: 'from-yellow-500 to-orange-500'
    },
    yantra: {
      title: 'Yantra Collection',
      titleHi: 'यंत्र संग्रह',
      description: 'Sacred yantras for meditation, prosperity and spiritual protection.',
      descriptionHi: 'ध्यान, समृद्धि और आध्यात्मिक सुरक्षा के लिए पवित्र यंत्र।',
      icon: '🕉️',
      color: 'from-purple-500 to-pink-500'
    }
  };

  const currentCategory = categoryInfo[category] || {
    title: category?.charAt(0).toUpperCase() + category?.slice(1) || 'Products',
    titleHi: 'उत्पाद',
    description: `Explore our ${category} collection.`,
    descriptionHi: `हमारे ${category} संग्रह का अन्वेषण करें।`,
    icon: '🔮',
    color: 'from-orange-500 to-red-500'
  };

  // Fetch products by category
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api.endpoints.products}/category/${category}?page=${currentPage}&sort=${sortBy}&enabled=true&inStock=all`);
        if (!response.ok) {
          throw new Error('Failed to fetch category products');
        }
        const data = await response.json();
        setProducts(data.data || []);
        setPagination(data.pagination || {});
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching category products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchCategoryProducts();
    }
  }, [category, currentPage, sortBy]);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <Navigation />
      

      {/* Category Header & Filters */}
      <section className="pt-24 pb-8 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Category Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="text-4xl">{currentCategory.icon}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {currentCategory.title}
              </h1>
            </div>
            <p className="text-lg text-orange-600 font-medium">
              {currentCategory.titleHi}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">
                {loading ? 'Loading...' : `${pagination.total || 0} products found`}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="text-gray-600 font-medium">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="sortOrder">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Loading {currentCategory.title.toLowerCase()}...</p>
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
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">{currentCategory.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Products Found</h2>
              <p className="text-gray-600 mb-6">No products available in this category yet.</p>
              <button 
                onClick={() => navigate('/shop')}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Browse All Products
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
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
                        <span className="text-6xl">{product.icon || currentCategory.icon}</span>
                      )}
                      {/* Fallback icon */}
                      <div className="hidden w-32 h-32 items-center justify-center">
                        <span className="text-6xl">{product.icon || currentCategory.icon}</span>
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

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {[...Array(pagination.pages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === page
                              ? 'bg-orange-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.pages}
                      className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Back to Shop */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <button
            onClick={() => navigate('/shop')}
            className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            ← Back to All Products
          </button>
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

export default CategoryPage;