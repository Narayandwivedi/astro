import React, { useState, useEffect } from 'react'

const ServiceManagement = () => {
  const [services, setServices] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    titleEn: '',
    titleHi: '',
    description: '',
    hindiDesc: '',
    icon: '',
    price: '',
    duration: '',
    category: '',
    features: [],
    hindiFeatures: [],
    isActive: true
  })

  const categories = [
    'Personal', 'Business', 'Relationship', 'Ceremonial', 'Remedial', 
    'Health', 'Professional', 'Property', 'Education', 'Travel', 'Vastu', 'Timing'
  ]

  // Fetch services from API
  const fetchServices = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/services?enabled=all')
      if (!response.ok) {
        throw new Error('Failed to fetch services')
      }
      const data = await response.json()
      setServices(data.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch services:', error)
      setLoading(false)
      // You could show a toast notification here
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const resetForm = () => {
    setFormData({
      titleEn: '',
      titleHi: '',
      description: '',
      hindiDesc: '',
      icon: '',
      price: '',
      duration: '',
      category: '',
      features: [],
      hindiFeatures: [],
      isActive: true
    })
  }

  const handleAddService = () => {
    resetForm()
    setShowAddModal(true)
  }

  const handleEditService = (service) => {
    setSelectedService(service)
    setFormData({
      titleEn: service.titleEn,
      titleHi: service.titleHi,
      description: service.description,
      hindiDesc: service.hindiDesc,
      icon: service.icon,
      price: service.price,
      duration: service.duration,
      category: service.category,
      features: service.features || [],
      hindiFeatures: service.hindiFeatures || [],
      isActive: service.isActive
    })
    setShowEditModal(true)
  }

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/services/${serviceId}`, { 
          method: 'DELETE' 
        })
        if (!response.ok) {
          throw new Error('Failed to delete service')
        }
        setServices(services.filter(s => s._id !== serviceId))
        alert('Service deleted successfully!')
      } catch (error) {
        console.error('Failed to delete service:', error)
        alert('Failed to delete service. Please try again.')
      }
    }
  }

  const handleToggleStatus = async (serviceId) => {
    try {
      const service = services.find(s => s._id === serviceId)
      const response = await fetch(`http://localhost:5000/api/services/${serviceId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled: !service.isActive })
      })
      
      if (!response.ok) {
        throw new Error('Failed to toggle service status')
      }
      
      setServices(services.map(service => 
        service._id === serviceId 
          ? { ...service, isActive: !service.isActive }
          : service
      ))
    } catch (error) {
      console.error('Failed to toggle service status:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (showEditModal && selectedService) {
        // Update existing service
        const response = await fetch(`http://localhost:5000/api/services/${selectedService._id}`, { 
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        
        if (!response.ok) {
          throw new Error('Failed to update service')
        }
        
        const data = await response.json()
        setServices(services.map(service => 
          service._id === selectedService._id 
            ? data.data
            : service
        ))
        alert('Service updated successfully!')
      } else {
        // Add new service
        const response = await fetch('http://localhost:5000/api/services', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        
        if (!response.ok) {
          throw new Error('Failed to create service')
        }
        
        const data = await response.json()
        setServices([...services, data.data])
        alert('Service added successfully!')
      }
      
      setShowAddModal(false)
      setShowEditModal(false)
      setSelectedService(null)
      resetForm()
    } catch (error) {
      console.error('Failed to save service:', error)
      alert('Failed to save service. Please try again.')
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || '' : value)
    }))
  }

  const handleFeaturesChange = (e) => {
    const features = e.target.value.split(',').map(f => f.trim()).filter(f => f)
    setFormData(prev => ({ ...prev, features }))
  }

  const handleHindiFeaturesChange = (e) => {
    const hindiFeatures = e.target.value.split(',').map(f => f.trim()).filter(f => f)
    setFormData(prev => ({ ...prev, hindiFeatures }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            Service Management
          </h1>
          <p className="text-amber-700">
            Manage all astrology services - सेवाओं का प्रबंधन
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-amber-900">All Services</h2>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
              {services.length} Total
            </span>
          </div>
          <button
            onClick={handleAddService}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
          >
            ➕ Add New Service
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600">{services.length}</div>
            <div className="text-gray-600 text-sm">Total Services</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600">
              {services.filter(s => s.isActive).length}
            </div>
            <div className="text-gray-600 text-sm">Active Services</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
            <div className="text-3xl font-bold text-red-600">
              {services.filter(s => !s.isActive).length}
            </div>
            <div className="text-gray-600 text-sm">Disabled Services</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-amber-500">
            <div className="text-3xl font-bold text-amber-600">
              {services.filter(s => s.features && s.features.length > 0).length}
            </div>
            <div className="text-gray-600 text-sm">Featured Services</div>
          </div>
        </div>

        {/* Services Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
            <p className="text-amber-800 text-lg">Loading services...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Service</th>
                    <th className="px-6 py-4 text-left font-semibold">Category</th>
                    <th className="px-6 py-4 text-left font-semibold">Price</th>
                    <th className="px-6 py-4 text-left font-semibold">Duration</th>
                    <th className="px-6 py-4 text-center font-semibold">Status</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service._id} className="border-b border-gray-200 hover:bg-amber-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{service.icon}</span>
                          <div>
                            <div className="font-semibold text-amber-900">
                              {service.titleEn}
                            </div>
                            <div className="text-sm text-amber-700">{service.titleHi}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {service.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-amber-900">₹{service.price.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 text-amber-800">{service.duration}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(service._id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                            service.isActive 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {service.isActive ? '✅ Active' : '❌ Disabled'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2 justify-center">
                          <button
                            onClick={() => handleEditService(service)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors flex items-center gap-1"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(service._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors flex items-center gap-1"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Service Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-amber-900">
                    {showEditModal ? '✏️ Edit Service' : '➕ Add New Service'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      setShowEditModal(false)
                      setSelectedService(null)
                      resetForm()
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Service Title (English) *
                        </label>
                        <input
                          type="text"
                          name="titleEn"
                          value={formData.titleEn}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                          placeholder="e.g., Kundli Reading"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Service Title (Hindi) *
                        </label>
                        <input
                          type="text"
                          name="titleHi"
                          value={formData.titleHi}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                          placeholder="e.g., कुंडली पाठन"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description (English) *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        placeholder="Detailed description of the service..."
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description (Hindi) *
                      </label>
                      <textarea
                        name="hindiDesc"
                        value={formData.hindiDesc}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        placeholder="सेवा का विस्तृत विवरण..."
                      />
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Service Details</h4>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Icon (Emoji) *
                        </label>
                        <input
                          type="text"
                          name="icon"
                          value={formData.icon}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-center text-2xl"
                          placeholder="🔮"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Price (₹) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                          placeholder="1500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Duration *
                        </label>
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                          placeholder="45-60 mins"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Features (English - comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.features.join(', ')}
                        onChange={handleFeaturesChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        placeholder="Birth Chart Analysis, Future Predictions, Career Guidance"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Features (Hindi - comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.hindiFeatures.join(', ')}
                        onChange={handleHindiFeaturesChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        placeholder="जन्म कुंडली विश्लेषण, भविष्य की भविष्यवाणी, करियर मार्गदर्शन"
                      />
                    </div>
                  </div>

                  {/* Service Options */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Service Options</h4>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        Service Active
                      </span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                    >
                      {showEditModal ? '💾 Update Service' : '➕ Add Service'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false)
                        setShowEditModal(false)
                        setSelectedService(null)
                        resetForm()
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 cursor-pointer"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ServiceManagement