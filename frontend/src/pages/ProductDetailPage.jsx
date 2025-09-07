import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import OrderModal from '../components/OrderModal';
import { useApi } from '../context/ApiContext';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api.endpoints.products}/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data.data);
        
        // Fetch related products from same category
        if (data.data.category) {
          fetchRelatedProducts(data.data.category, data.data._id);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async (category, currentProductId) => {
      try {
        const response = await fetch(`${api.endpoints.products}?category=${category}&limit=4`);
        if (response.ok) {
          const data = await response.json();
          // Filter out current product
          const filtered = data.data.filter(p => p._id !== currentProductId);
          setRelatedProducts(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, api.endpoints.products]);

  const handleBuyNow = (product) => {
    addToCart(product, 1);
    navigate('/cart');
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleOrderModalClose = () => {
    setOrderModalOpen(false);
  };

  const handleRelatedProductClick = (productId) => {
    navigate(`/shop/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="w-full">
        <Navigation />
        <div className="pt-32 pb-16 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <Navigation />
        <div className="pt-32 pb-16 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/shop')}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Navigation />
      
      {/* Breadcrumb */}
      <section className="pt-32 pb-6 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-orange-600">Home</button>
            <span>›</span>
            <button onClick={() => navigate('/shop')} className="hover:text-orange-600">Shop</button>
            <span>›</span>
            <span className="text-gray-800 font-medium">{product?.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Product Images */}
            <div className="space-y-4 max-w-lg mx-auto lg:mx-0">
              {/* Main Image */}
              <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl overflow-hidden aspect-square flex items-center justify-center p-8">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={api.getImageURL(product.images[selectedImageIndex])} 
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <span className="text-8xl">{product.icon || '🔮'}</span>
                )}
                {/* Fallback icon */}
                <div className="hidden w-full h-full items-center justify-center">
                  <span className="text-8xl">{product.icon || '🔮'}</span>
                </div>
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-orange-500 ring-2 ring-orange-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={api.getImageURL(image)} 
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              
              {/* Product Title & Category */}
              <div>
                <div className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold mb-3 capitalize">
                  {product.category.replace('-', ' ')}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <p className="text-xl text-orange-600 font-medium">{product.nameHi}</p>
              </div>

              {/* Rating & Stock */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400 text-lg">
                    {"★".repeat(Math.floor(product.rating || 4.5))}
                    {"☆".repeat(5 - Math.floor(product.rating || 4.5))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating || '4.5'} ({product.reviewCount || '50+'} reviews)
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-orange-600">₹{product.price?.toLocaleString()}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-gray-600 text-sm">Inclusive of all taxes • Free shipping across India</p>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                <p className="text-gray-600 text-sm italic">{product.descriptionHi}</p>
              </div>

              {/* Benefits */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">Benefits</h3>
                  <ul className="space-y-2">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 text-lg">✓</span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                {product.weight && (
                  <div>
                    <span className="text-sm text-gray-600">Weight:</span>
                    <p className="font-semibold">{product.weight}</p>
                  </div>
                )}
                {product.material && (
                  <div>
                    <span className="text-sm text-gray-600">Material:</span>
                    <p className="font-semibold">{product.material}</p>
                  </div>
                )}
                {product.origin && (
                  <div>
                    <span className="text-sm text-gray-600">Origin:</span>
                    <p className="font-semibold">{product.origin}</p>
                  </div>
                )}
                {product.certification && (
                  <div>
                    <span className="text-sm text-gray-600">Certification:</span>
                    <p className="font-semibold">{product.certification}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {product.inStock ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-4 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-lg"
                    >
                      🛒 Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="w-full py-4 px-6 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      Buy Now - अभी खरीदें
                    </button>
                  </div>
                ) : (
                  <button
                    disabled
                    className="w-full py-4 px-6 bg-gray-300 text-gray-500 cursor-not-allowed rounded-lg font-semibold text-lg"
                  >
                    Out of Stock
                  </button>
                )}
                
                <div className="grid grid-cols-2 gap-3 text-center text-sm">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-green-600 text-lg mb-1">🚚</div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-gray-600">Across India</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-blue-600 text-lg mb-1">🔮</div>
                    <p className="font-medium">Energized</p>
                    <p className="text-gray-600">Blessed by Pandits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct._id} 
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handleRelatedProductClick(relatedProduct._id)}
                >
                  {/* Product Image */}
                  <div className="h-48 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center relative p-4">
                    {relatedProduct.images && relatedProduct.images.length > 0 ? (
                      <img 
                        src={api.getImageURL(relatedProduct.images[0])}
                        alt={relatedProduct.name}
                        className="w-32 h-32 object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <span className="text-6xl">{relatedProduct.icon || '🔮'}</span>
                    )}
                    <div className="absolute top-3 right-3">
                      <div className="bg-white bg-opacity-90 text-orange-600 p-2 rounded-full shadow-md">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{relatedProduct.name}</h3>
                    <p className="text-sm text-orange-600 mb-2">{relatedProduct.nameHi}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-orange-600">₹{relatedProduct.price?.toLocaleString()}</span>
                      <div className="text-yellow-400">
                        {"★".repeat(Math.floor(relatedProduct.rating || 4.5))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Order Modal */}
      <OrderModal 
        isOpen={orderModalOpen}
        onClose={handleOrderModalClose}
        product={product}
      />

    </div>
  );
};

export default ProductDetailPage;