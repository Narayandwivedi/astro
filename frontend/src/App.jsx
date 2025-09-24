import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContextProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import Homepage from './pages/Homepage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ShopPage from './pages/ShopPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import BookingsPage from './pages/BookingsPage';
import AddressPage from './pages/AddressPage';
import ManageAddressPage from './pages/ManageAddressPage';
import About from './pages/About';
import Login from './pages/Login';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="App w-full">
      <div className="w-full">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/category/:category" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/shop/product/:id" element={<ProductDetailPage />} />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/orders/:orderId" element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          } />
          <Route path="/addresses" element={
            <ProtectedRoute>
              <AddressPage />
            </ProtectedRoute>
          } />
          <Route path="/manage-addresses" element={
            <ProtectedRoute>
              <ManageAddressPage />
            </ProtectedRoute>
          } />
          <Route path="/blog" element={<BlogsPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      
      {/* Footer - Hidden on login page */}
      {!isLoginPage && <Footer />}
      
      {/* Mobile Bottom Navigation - Hidden on login page */}
      {!isLoginPage && <MobileBottomNav />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContextProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AppContextProvider>
      
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  )
}

export default App