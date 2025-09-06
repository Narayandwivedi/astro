import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Create Cart Context
const CartContext = createContext();

// Cart Action Types
const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const { product, quantity = 1, specifications = '' } = action.payload;
      
      // Check if product already exists in cart
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === product._id && item.specifications === specifications
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product exists
        const updatedItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
          totalPrice: updatedItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
        };
      } else {
        // Add new item to cart
        const newItem = {
          id: Date.now() + Math.random(), // Unique ID for cart item
          product,
          quantity,
          specifications,
          addedAt: new Date().toISOString()
        };
        
        const updatedItems = [...state.items, newItem];
        
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
          totalPrice: updatedItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
        };
      }
    }

    case CART_ACTIONS.REMOVE_FROM_CART: {
      const updatedItems = state.items.filter(item => item.id !== action.payload.itemId);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: updatedItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, {
          type: CART_ACTIONS.REMOVE_FROM_CART,
          payload: { itemId }
        });
      }
      
      const updatedItems = state.items.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: updatedItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
    }

    case CART_ACTIONS.LOAD_CART: {
      const loadedItems = action.payload || [];
      return {
        ...state,
        items: loadedItems,
        totalItems: loadedItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: loadedItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      };
    }

    default:
      return state;
  }
};

// Initial cart state
const initialCartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false
};

// Cart Context Provider
export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('astro-satya-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('astro-satya-cart', JSON.stringify(cartState.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartState.items]);

  // Cart actions
  const addToCart = (product, quantity = 1, specifications = '') => {
    dispatch({
      type: CART_ACTIONS.ADD_TO_CART,
      payload: { product, quantity, specifications }
    });
  };

  const removeFromCart = (itemId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_FROM_CART,
      payload: { itemId }
    });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { itemId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Helper functions
  const getCartItemsCount = () => cartState.totalItems;

  const getCartTotal = () => cartState.totalPrice;

  const isProductInCart = (productId) => {
    return cartState.items.some(item => item.product._id === productId);
  };

  const getProductQuantityInCart = (productId) => {
    const item = cartState.items.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  // Calculate shipping (free for orders above ₹1000)
  const getShippingCost = () => {
    return cartState.totalPrice >= 1000 ? 0 : 50;
  };

  // Calculate final total including shipping
  const getFinalTotal = () => {
    return cartState.totalPrice + getShippingCost();
  };

  // Get cart summary for order
  const getCartSummary = () => {
    return {
      items: cartState.items,
      subtotal: cartState.totalPrice,
      shipping: getShippingCost(),
      total: getFinalTotal(),
      totalItems: cartState.totalItems
    };
  };

  const contextValue = {
    // State
    cart: cartState,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    
    // Helpers
    getCartItemsCount,
    getCartTotal,
    isProductInCart,
    getProductQuantityInCart,
    getShippingCost,
    getFinalTotal,
    getCartSummary
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use Cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;