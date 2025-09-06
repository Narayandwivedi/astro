import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useApi } from '../context/ApiContext';
import OrderModal from './OrderModal';

const CartModal = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartSummary } = useCart();
  const api = useApi();
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setOrderModalOpen(true);
  };

  const handleContinueShopping = () => {
    onClose();
  };

  const cartSummary = getCartSummary();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                🛒 Shopping Cart
                {cart.totalItems > 0 && (
                  <span className="ml-2 bg-orange-600 text-white text-sm px-2 py-1 rounded-full">
                    {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
                  </span>
                )}
              </h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto">
            {cart.items.length === 0 ? (
              /* Empty Cart */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-8xl mb-4">🛒</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some spiritual products to your cart to get started!</p>
                <button
                  onClick={handleContinueShopping}
                  className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              /* Cart Items */
              <div className="p-6">
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex items-center space-x-4">
                      
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img 
                            src={api.getImageURL(item.product.images.find(img => img.isPrimary) || item.product.images[0])}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <span className="text-3xl">{item.product.icon || '🔮'}</span>
                        )}
                        {/* Fallback icon */}
                        <div className="hidden w-16 h-16 items-center justify-center">
                          <span className="text-3xl">{item.product.icon || '🔮'}</span>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-lg mb-1 truncate">{item.product.name}</h4>
                        <p className="text-orange-600 font-medium text-sm mb-2">{item.product.nameHi}</p>
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold text-orange-600">₹{item.product.price.toLocaleString()}</span>
                          {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                            <span className="text-sm text-gray-500 line-through">₹{item.product.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                        {item.specifications && (
                          <p className="text-xs text-gray-600 mt-1 bg-yellow-100 px-2 py-1 rounded">
                            Note: {item.specifications}
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center space-y-2">
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
                          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-gray-800">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">₹{item.product.price.toLocaleString()} each</p>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        title="Remove from cart"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
                  
                  <div className="space-y-3">
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
                      <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        🎉 You qualify for free shipping!
                      </div>
                    )}
                    
                    {cartSummary.shipping > 0 && (
                      <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        Add ₹{(1000 - cartSummary.subtotal).toLocaleString()} more for free shipping
                      </div>
                    )}
                    
                    <hr className="border-gray-300" />
                    
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total:</span>
                      <span className="text-orange-600">₹{cartSummary.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {cart.items.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleContinueShopping}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
                
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                  className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Clear Cart
                </button>
                
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white py-3 px-6 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  🛒 Checkout - ₹{cartSummary.total.toLocaleString()}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        cartItems={cart.items}
        cartMode={true}
      />
    </>
  );
};

export default CartModal;