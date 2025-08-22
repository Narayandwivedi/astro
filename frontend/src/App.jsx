import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Homepage from './pages/Homepage';
import './App.css'

function App() {
  return (
    <Router>
      <div className="App w-full">
        <Navigation />
        <div className="w-full">
          <Routes>
            <Route path="/" element={<Homepage />} />
            {/* Other routes will be added later */}
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App