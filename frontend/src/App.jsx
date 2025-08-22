import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import './App.css'

function App() {
  return (
    <Router>
      <div className="App w-full">
        <div className="w-full">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/blog" element={<BlogsPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            {/* Other routes will be added later */}
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App