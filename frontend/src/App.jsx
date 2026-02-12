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

const SITE_URL = 'https://astrosatyaprakash.com';
const SITE_NAME = 'Astro Satya Prakash';
const DEFAULT_IMAGE = `${SITE_URL}/satya2.webp`;

const routeSeo = [
  { pattern: /^\/$/, title: 'Astro Satya Prakash - Vedic Astrology & Consultation', description: 'Expert Vedic astrology guidance by Acharya Satya Prakash Tripathi. Book online consultation for kundli, marriage, career, and vastu guidance.' },
  { pattern: /^\/about$/, title: 'About Acharya Satya Prakash Tripathi | Astro Satya Prakash', description: 'Learn about Acharya Satya Prakash Tripathi, his astrology experience, and spiritual consultation approach.' },
  { pattern: /^\/services$/, title: 'Astrology Services | Astro Satya Prakash', description: 'Explore astrology services including kundli analysis, marriage consultation, career guidance, and vastu advice.' },
  { pattern: /^\/services\/[^/]+$/, title: 'Service Details | Astro Satya Prakash', description: 'Detailed information about this astrology service, consultation process, and booking options.' },
  { pattern: /^\/shop$/, title: 'Astrology Products Shop | Astro Satya Prakash', description: 'Browse astrology and spiritual products selected by Acharya Satya Prakash.' },
  { pattern: /^\/shop\/category\/[^/]+$/, title: 'Product Category | Astro Satya Prakash', description: 'Browse products in this category from Astro Satya Prakash shop.' },
  { pattern: /^\/shop\/product\/[^/]+$/, title: 'Product Details | Astro Satya Prakash', description: 'View product details, benefits, and purchase options from Astro Satya Prakash.' },
  { pattern: /^\/blog$/, title: 'Astrology Blog | Astro Satya Prakash', description: 'Read astrology insights, remedies, and guidance articles from Astro Satya Prakash.' },
  { pattern: /^\/blog\/[^/]+$/, title: 'Astrology Article | Astro Satya Prakash', description: 'Read this astrology article and practical spiritual guidance from Astro Satya Prakash.' },
  { pattern: /^\/contact$/, title: 'Contact Astro Satya Prakash', description: 'Contact Acharya Satya Prakash Tripathi for consultations and astrology guidance.' },
  { pattern: /^\/terms$/, title: 'Terms and Conditions | Astro Satya Prakash', description: 'Read the terms and conditions for Astro Satya Prakash services and website usage.' },
  { pattern: /^\/privacy$/, title: 'Privacy Policy | Astro Satya Prakash', description: 'Review the privacy policy and data handling practices of Astro Satya Prakash.' },
  { pattern: /^\/login$/, title: 'Login | Astro Satya Prakash', description: 'Securely log in to your Astro Satya Prakash account.', robots: 'noindex, nofollow' },
  { pattern: /^\/cart$/, title: 'Your Cart | Astro Satya Prakash', description: 'Review selected products before checkout.', robots: 'noindex, nofollow' },
  { pattern: /^\/checkout$/, title: 'Checkout | Astro Satya Prakash', description: 'Complete your order securely.', robots: 'noindex, nofollow' },
  { pattern: /^\/orders$/, title: 'Your Orders | Astro Satya Prakash', description: 'View your order history and details.', robots: 'noindex, nofollow' },
  { pattern: /^\/orders\/[^/]+$/, title: 'Order Details | Astro Satya Prakash', description: 'Track and review your order details.', robots: 'noindex, nofollow' },
  { pattern: /^\/bookings$/, title: 'Your Bookings | Astro Satya Prakash', description: 'Manage your consultation bookings.', robots: 'noindex, nofollow' },
  { pattern: /^\/addresses$/, title: 'Saved Addresses | Astro Satya Prakash', description: 'Manage your saved addresses.', robots: 'noindex, nofollow' },
  { pattern: /^\/manage-addresses$/, title: 'Manage Addresses | Astro Satya Prakash', description: 'Add and update your address details.', robots: 'noindex, nofollow' }
];

const defaultSeo = {
  title: 'Astro Satya Prakash - Vedic Astrology & Consultation',
  description: 'Expert Vedic astrology guidance by Acharya Satya Prakash Tripathi. Online consultation for kundli reading, marriage compatibility, career, and vastu.',
  robots: 'index, follow'
};

const upsertMeta = (name, content, isProperty = false) => {
  const attribute = isProperty ? 'property' : 'name';
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const upsertLink = (rel, href) => {
  let link = document.head.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

function SeoManager() {
  const location = useLocation();

  React.useEffect(() => {
    const path = location.pathname || '/';
    const current = routeSeo.find((item) => item.pattern.test(path)) || defaultSeo;
    const title = current.title || defaultSeo.title;
    const description = current.description || defaultSeo.description;
    const robots = current.robots || defaultSeo.robots;
    const canonicalPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;

    document.title = title;
    upsertMeta('description', description);
    upsertMeta('robots', robots);
    upsertMeta('og:type', 'website', true);
    upsertMeta('og:site_name', SITE_NAME, true);
    upsertMeta('og:locale', 'en_IN', true);
    upsertMeta('og:url', canonicalUrl, true);
    upsertMeta('og:title', title, true);
    upsertMeta('og:description', description, true);
    upsertMeta('og:image', DEFAULT_IMAGE, true);
    upsertMeta('og:image:secure_url', DEFAULT_IMAGE, true);
    upsertMeta('og:image:type', 'image/webp', true);
    upsertMeta('og:image:alt', 'Astro Satya Prakash logo', true);
    upsertMeta('og:image:width', '1200', true);
    upsertMeta('og:image:height', '630', true);
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:url', canonicalUrl);
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);
    upsertMeta('twitter:image', DEFAULT_IMAGE);
    upsertMeta('twitter:image:alt', 'Astro Satya Prakash logo');
    upsertLink('canonical', canonicalUrl);
  }, [location.pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="App w-full">
      <SeoManager />
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
