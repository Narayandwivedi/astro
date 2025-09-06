import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ApiProvider } from './context/ApiContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import ServiceManagement from './pages/ServiceManagement'
import ProductManagement from './pages/ProductManagement'
import ManageBlogs from './pages/BlogManagement/ManageBlogs'
import ManageOrders from './pages/OrderManagement/ManageOrders'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/': return 'Dashboard'
      case '/orders': return 'Order Management'
      case '/services': return 'Service Management'
      case '/products': return 'Product Management'
      case '/blogs': return 'Blog Management'
      case '/bookings': return 'Bookings'
      case '/customers': return 'Customer Management'
      case '/analytics': return 'Analytics'
      case '/settings': return 'Settings'
      default: return 'Dashboard'
    }
  }

  return (
    <ApiProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          
          <div className="lg:ml-64 flex flex-col min-h-screen">
          <Routes>
            <Route path="/*" element={
              <>
                <Header 
                  sidebarOpen={sidebarOpen} 
                  setSidebarOpen={setSidebarOpen}
                  title={getPageTitle(window.location.pathname)}
                />
                <main className="flex-1 p-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/orders" element={<ManageOrders />} />
                    <Route path="/services" element={<ServiceManagement />} />
                    <Route path="/products" element={<ProductManagement />} />
                    <Route path="/blogs" element={<ManageBlogs />} />
                    <Route path="/bookings" element={
                      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">📅</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Management</h2>
                        <p className="text-gray-600">Coming Soon - Manage service appointments and schedules</p>
                      </div>
                    } />
                    <Route path="/customers" element={
                      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">👥</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer Management</h2>
                        <p className="text-gray-600">Coming Soon - Manage customer information and history</p>
                      </div>
                    } />
                    <Route path="/analytics" element={
                      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">📈</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Analytics & Reports</h2>
                        <p className="text-gray-600">Coming Soon - View detailed analytics and performance reports</p>
                      </div>
                    } />
                    <Route path="/settings" element={
                      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">⚙️</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">System Settings</h2>
                        <p className="text-gray-600">Coming Soon - Configure system settings and preferences</p>
                      </div>
                    } />
                  </Routes>
                </main>
              </>
            } />
          </Routes>
          </div>
        </div>
      </Router>
    </ApiProvider>
  )
}

export default App
