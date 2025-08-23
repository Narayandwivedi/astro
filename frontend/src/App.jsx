import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import ShopPage from './pages/ShopPage';
import About from './pages/About';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';
import './App.css'

function App() {
  return (
    <Router>
      <div className="App w-full">
        <div className="w-full">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/blog" element={<BlogsPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Other routes will be added later */}
          </Routes>
        </div>
        
        {/* Footer */}
        <Footer />
        
        {/* Mobile Bottom Navigation - Only visible on mobile */}
        <MobileBottomNav />
      </div>
    </Router>
  )
}

export default App