import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useCart } from '../context/CartContext';
import { useApi } from '../context/ApiContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartSummary } = useCart();
  const api = useApi();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      return;
    }
    navigate('/checkout');
  };

  const cartSummary = getCartSummary();

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="pt-28 pb-6 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Shopping Cart
              </h1>
              {cart.totalItems > 0 && (
                <p className="text-gray-600 mt-1">
                  {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
                </p>
              )}
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </div>
      </div>

      {cart.items.length === 0 ? (
        /* Empty Cart */
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Add some spiritual products to your cart to get started!
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Cart Items - Mobile First Design */}
            <div className="flex-1">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    
                    {/* Mobile Layout */}
                    <div className="flex space-x-4">
                      
                      {/* Product Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img 
                            src={api.getImageURL(item.product.images.find(img => img.isPrimary) || item.product.images[0])}
                            alt={item.product.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <span className="text-2xl sm:text-3xl">{item.product.icon || '🔮'}</span>
                        )}
                        {/* Fallback icon */}
                        <div className="hidden w-16 h-16 sm:w-20 sm:h-20 items-center justify-center">
                          <span className="text-2xl sm:text-3xl">{item.product.icon || '🔮'}</span>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate">
                              {item.product.name}
                            </h3>
                            <p className="text-orange-600 font-medium text-sm">
                              {item.product.nameHi}
                            </p>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            title="Remove from cart"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {/* Price */}
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-xl font-bold text-orange-600">
                            ₹{item.product.price?.toLocaleString() || '0'}
                          </span>
                          {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.product.originalPrice?.toLocaleString() || '0'}
                            </span>
                          )}
                        </div>

                        {/* Specifications */}
                        {item.specifications && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-600 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded">
                              <strong>Note:</strong> {item.specifications}
                            </p>
                          </div>
                        )}

                        {/* Quantity and Total - Mobile Layout */}
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Item Total */}
                          <div className="text-right">
                            <p className="font-bold text-gray-800 text-lg">
                              ₹{((item.product.price || 0) * item.quantity).toLocaleString()}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-gray-500">
                                ₹{item.product.price?.toLocaleString() || '0'} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Order Summary - Sticky on Desktop */}
            <div className="lg:w-96">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:sticky lg:top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({cartSummary.totalItems} items):</span>
                    <span className="font-medium">₹{cartSummary.subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span className={`font-medium ${cartSummary.shipping === 0 ? 'text-green-600' : ''}`}>
                      {cartSummary.shipping === 0 ? 'FREE' : `₹${cartSummary.shipping}`}
                    </span>
                  </div>
                  
                  {cartSummary.shipping === 0 && cartSummary.subtotal >= 1000 && (
                    <div className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded border border-green-200">
                      🎉 You qualify for free shipping!
                    </div>
                  )}
                  
                  {cartSummary.shipping > 0 && (
                    <div className="text-xs text-orange-700 bg-orange-50 px-3 py-2 rounded border border-orange-200">
                      Add ₹{(1000 - cartSummary.subtotal).toLocaleString()} more for free shipping
                    </div>
                  )}
                  
                  <hr className="border-gray-300" />
                  
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total:</span>
                    <span className="text-orange-600">₹{cartSummary.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    🛒 Checkout - ₹{cartSummary.total.toLocaleString()}
                  </button>
                  
                  <button
                    onClick={() => navigate('/shop')}
                    className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Security & Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="text-center">
                      <div className="text-green-600 text-2xl mb-1">🔒</div>
                      <p className="text-xs text-gray-600 font-medium">Secure</p>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-600 text-2xl mb-1">🚚</div>
                      <p className="text-xs text-gray-600 font-medium">Free Shipping</p>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-600 text-2xl mb-1">💬</div>
                      <p className="text-xs text-gray-600 font-medium">Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CartPage;