import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppContext } from './AppContext';
import axios from 'axios';

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
      // Ensure each item has an ID - preserve server _id and create local id for UI
      const itemsWithIds = loadedItems.map(item => ({
        ...item,
        id: item._id || item.id || (Date.now() + Math.random()), // UI identifier
        _id: item._id // Preserve server ID for API calls
      }));
      return {
        ...state,
        items: itemsWithIds,
        totalItems: itemsWithIds.reduce((total, item) => total + item.quantity, 0),
        totalPrice: itemsWithIds.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      };
    }

    default:
      return state;
  }
};

// Transform server cart items to frontend format
const transformServerCartItem = (serverItem) => {
  return {
    id: serverItem._id || serverItem.id || (Date.now() + Math.random()),
    _id: serverItem._id, // Preserve server ID
    product: serverItem.productDetails || serverItem.product, // Use productDetails from server
    quantity: serverItem.quantity || 1,
    specifications: serverItem.specifications || '',
    addedAt: serverItem.addedAt || new Date().toISOString()
  };
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
  const { BACKEND_URL, isAuthenticated, user } = useContext(AppContext);
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);

  // Load cart from localStorage or server based on authentication
  useEffect(() => {
    if (isAuthenticated === null) return; // Wait for auth check to complete

    if (isAuthenticated) {
      // Load cart from server for authenticated users
      loadCartFromServer();
    } else {
      // Load cart from localStorage for non-authenticated users
      loadCartFromLocalStorage();
    }
  }, [isAuthenticated, user]);

  // Save cart to appropriate storage whenever cart changes
  useEffect(() => {
    if (isAuthenticated === null) return; // Wait for auth check to complete

    if (isAuthenticated) {
      // Don't save to localStorage for authenticated users
      // Cart operations will be synced with server directly
    } else {
      // Save to localStorage for non-authenticated users
      saveCartToLocalStorage();
    }
  }, [cartState.items, isAuthenticated]);

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('astro-satya-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  };

  const saveCartToLocalStorage = () => {
    try {
      localStorage.setItem('astro-satya-cart', JSON.stringify(cartState.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  const loadCartFromServer = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/cart`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const serverCart = response.data.data;
        console.log('Load cart - Server cart response:', serverCart);
        
        // Transform server cart items to frontend format
        const transformedItems = (serverCart.items || []).map(transformServerCartItem);
        console.log('Load cart - Transformed items:', transformedItems);
        
        dispatch({ 
          type: CART_ACTIONS.LOAD_CART, 
          payload: transformedItems
        });
      }
    } catch (error) {
      console.error('Error loading cart from server:', error);
      // Fallback to localStorage if server fails
      loadCartFromLocalStorage();
    }
  };

  // Cart actions
  const addToCart = async (product, quantity = 1, specifications = '') => {
    if (isAuthenticated) {
      // Add to server cart for authenticated users
      try {
        const response = await axios.post(`${BACKEND_URL}/api/cart/add`, {
          productId: product._id,
          quantity,
          specifications
        }, {
          withCredentials: true
        });

        if (response.data.success) {
          const serverCart = response.data.data;
          console.log('Add to cart - Server cart response:', serverCart);
          
          // Transform server cart items to frontend format
          const transformedItems = (serverCart.items || []).map(transformServerCartItem);
          console.log('Transformed cart items:', transformedItems);
          
          dispatch({ 
            type: CART_ACTIONS.LOAD_CART, 
            payload: transformedItems
          });
        }
      } catch (error) {
        console.error('Error adding to server cart:', error);
        // Fallback to local state
        dispatch({
          type: CART_ACTIONS.ADD_TO_CART,
          payload: { product, quantity, specifications }
        });
      }
    } else {
      // Add to local cart for non-authenticated users
      dispatch({
        type: CART_ACTIONS.ADD_TO_CART,
        payload: { product, quantity, specifications }
      });
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      // Remove from server cart for authenticated users
      try {
        // Find the cart item to get the product ID for server call
        const cartItem = cartState.items.find(item => item.id === itemId);
        if (!cartItem) {
          console.error('Cart item not found for removal');
          return;
        }

        // For server cart, use cart item _id from the server
        const serverItemId = cartItem._id || cartItem.id;
        console.log('Removing cart item:', { itemId, serverItemId, cartItem });
        
        if (!serverItemId || typeof serverItemId !== 'string' || serverItemId.length < 20) {
          console.error('Invalid server item ID for removal:', serverItemId);
          // Fallback to local removal if no valid server ID
          dispatch({
            type: CART_ACTIONS.REMOVE_FROM_CART,
            payload: { itemId }
          });
          return;
        }

        const response = await axios.delete(`${BACKEND_URL}/api/cart/remove/${serverItemId}`, {
          withCredentials: true
        });

        if (response.data.success) {
          const serverCart = response.data.data;
          const transformedItems = (serverCart.items || []).map(transformServerCartItem);
          dispatch({ 
            type: CART_ACTIONS.LOAD_CART, 
            payload: transformedItems
          });
        }
      } catch (error) {
        console.error('Error removing from server cart:', error);
        // Fallback to local state
        dispatch({
          type: CART_ACTIONS.REMOVE_FROM_CART,
          payload: { itemId }
        });
      }
    } else {
      // Remove from local cart for non-authenticated users
      dispatch({
        type: CART_ACTIONS.REMOVE_FROM_CART,
        payload: { itemId }
      });
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (isAuthenticated) {
      // Update server cart for authenticated users
      try {
        // Find the cart item to get the server ID
        const cartItem = cartState.items.find(item => item.id === itemId);
        if (!cartItem) {
          console.error('Cart item not found for update');
          return;
        }

        // For server cart, use cart item _id from the server
        const serverItemId = cartItem._id || cartItem.id;
        if (!serverItemId || typeof serverItemId !== 'string' || serverItemId.length < 20) {
          console.error('Invalid server item ID for update:', serverItemId);
          // Fallback to local update if no valid server ID
          dispatch({
            type: CART_ACTIONS.UPDATE_QUANTITY,
            payload: { itemId, quantity }
          });
          return;
        }

        const response = await axios.put(`${BACKEND_URL}/api/cart/update/${serverItemId}`, {
          quantity
        }, {
          withCredentials: true
        });

        if (response.data.success) {
          const serverCart = response.data.data;
          const transformedItems = (serverCart.items || []).map(transformServerCartItem);
          dispatch({ 
            type: CART_ACTIONS.LOAD_CART, 
            payload: transformedItems
          });
        }
      } catch (error) {
        console.error('Error updating server cart:', error);
        // Fallback to local state
        dispatch({
          type: CART_ACTIONS.UPDATE_QUANTITY,
          payload: { itemId, quantity }
        });
      }
    } else {
      // Update local cart for non-authenticated users
      dispatch({
        type: CART_ACTIONS.UPDATE_QUANTITY,
        payload: { itemId, quantity }
      });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      // Clear server cart for authenticated users
      try {
        const response = await axios.delete(`${BACKEND_URL}/api/cart/clear`, {
          withCredentials: true
        });

        if (response.data.success) {
          dispatch({ type: CART_ACTIONS.CLEAR_CART });
        }
      } catch (error) {
        console.error('Error clearing server cart:', error);
        // Fallback to local state
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
      }
    } else {
      // Clear local cart for non-authenticated users
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    }
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

  // Handle cart migration when user logs in
  const mergeCartOnLogin = async () => {
    if (!isAuthenticated || cartState.items.length === 0) return;

    try {
      const response = await axios.post(`${BACKEND_URL}/api/cart/merge`, {
        localCartItems: cartState.items
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        const mergedCart = response.data.data;
        dispatch({ 
          type: CART_ACTIONS.LOAD_CART, 
          payload: mergedCart.items || [] 
        });

        // Clear localStorage after successful merge
        try {
          localStorage.removeItem('astro-satya-cart');
        } catch (error) {
          console.error('Error clearing localStorage after merge:', error);
        }
      }
    } catch (error) {
      console.error('Error merging cart on login:', error);
    }
  };

  // Watch for authentication changes and merge cart when user logs in
  useEffect(() => {
    if (isAuthenticated === true && user) {
      // User just logged in, check if we need to merge localStorage cart
      const localCart = localStorage.getItem('astro-satya-cart');
      if (localCart) {
        try {
          const parsedCart = JSON.parse(localCart);
          if (parsedCart && parsedCart.length > 0) {
            mergeCartOnLogin();
          }
        } catch (error) {
          console.error('Error parsing local cart for merge:', error);
        }
      }
    }
  }, [isAuthenticated, user]);

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
    getCartSummary,
    mergeCartOnLogin
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