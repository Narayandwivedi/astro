import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApiProvider } from './context/ApiContext';
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
import About from './pages/About';
import Login from './pages/Login';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import './App.css'

function App() {
  return (
    <ApiProvider>
      <CartProvider>
        <Router>
          <AppContextProvider>
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
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/shop/product/:id" element={<ProductDetailPage />} />
                <Route path="/blog" element={<BlogsPage />} />
                <Route path="/blog/:slug" element={<BlogDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>
            
            {/* Footer */}
            <Footer />
            
            {/* Mobile Bottom Navigation - Only visible on mobile */}
            <MobileBottomNav />
          </div>
        </AppContextProvider>
      </Router>
    </CartProvider>
  </ApiProvider>
  )
}

export default App