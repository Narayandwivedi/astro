import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'

const ProductManagement = () => {
  const { BACKEND_URL, getImageURL } = useContext(AppContext)
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [isDeletingImage, setIsDeletingImage] = useState(false)
  const itemsPerPage = 10

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'rudraksha', label: 'Rudraksha' },
    { value: 'gemstone', label: 'Gemstone' },
    { value: 'yantra', label: 'Yantra' },
    { value: 'mala', label: 'Mala' },
    { value: 'spiritual-items', label: 'Spiritual Items' },
    { value: 'books', label: 'Books' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'puja-items', label: 'Puja Items' }
  ]

  const [formData, setFormData] = useState({
    name: '',
    nameHi: '',
    description: '',
    descriptionHi: '',
    price: '0',
    originalPrice: '0',
    category: 'rudraksha',
    icon: '💎',
    stock: '0',
    inStock: true,
    isActive: true,
    isFeatured: false,
    specifications: {
      material: '',
      weight: '',
      size: '',
      color: '',
      origin: '',
      certification: '',
      purity: ''
    },
    spiritualBenefits: [],
    rulingPlanet: '',
    chakra: '',
    mantra: '',
    usageInstructions: {
      en: '',
      hi: ''
    },
    careInstructions: {
      en: '',
      hi: ''
    },
    tags: [],
    adminNotes: '',
    sortOrder: 0,
    shippingClass: 'standard',
    vendor: {
      name: '',
      contact: '',
      location: ''
    },
    images: []
  })

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      // Try admin endpoint first, fallback to regular endpoint
      let response = await fetch(`${BACKEND_URL}/api/products/admin`)

      if (!response.ok) {
        // Fallback to regular endpoint with admin parameters
        response = await fetch(`${BACKEND_URL}/api/products?enabled=all&inStock=all`)
      }

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      console.log('Fetched products:', data.data?.length || 0, 'products')
      setProducts(data.data || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
      alert('Failed to load products. Please check if the backend is running.')
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleArrayInputChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData(prev => ({
      ...prev,
      [field]: array
    }))
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP)')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploadingImage(true)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)

    try {
      // Upload to backend
      const uploadFormData = new FormData()
      uploadFormData.append('image', file)

      const response = await fetch(`${BACKEND_URL}/api/upload/product/image`, {
        method: 'POST',
        body: uploadFormData
      })

      const result = await response.json()

      if (result.success) {
        // Add image to product images array
        const newImage = {
          url: result.data.url,
          filename: result.data.filename,
          originalName: result.data.originalName,
          size: result.data.size,
          dimensions: result.data.dimensions,
          format: result.data.format,
          isPrimary: formData.images.length === 0, // First image is primary
          alt: `${formData.name || 'Product'} Image`
        }

        setFormData(prev => ({
          ...prev,
          images: [...prev.images, newImage]
        }))

        alert(`Image uploaded and processed successfully!\nFormat: ${result.data.format?.toUpperCase() || 'WebP'}\nDimensions: ${result.data.dimensions || '800x800'}\nSize: ${Math.round(result.data.size / 1024)}KB`)
      } else {
        alert('Upload failed: ' + result.message)
        setImagePreview(null)
      }
    } catch (error) {
      alert('Upload error: ' + error.message)
      setImagePreview(null)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = async (index) => {
    const image = formData.images[index]
    
    if (window.confirm('Are you sure you want to remove this image?')) {
      try {
        // Delete from backend
        if (image.filename) {
          await fetch(`${BACKEND_URL}/api/upload/product/image/${image.filename}`, {
            method: 'DELETE'
          })
        }

        // Remove from state
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
        }))
      } catch (error) {
        console.error('Error removing image:', error)
        // Still remove from state even if backend delete fails
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
        }))
      }
    }
  }

  const handleSetPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Clean and prepare the data for backend
      const cleanFormData = {
        name: formData.name.trim() || 'Untitled Product',
        nameHi: formData.nameHi.trim() || 'बिना शीर्षक उत्पाद',
        description: formData.description.trim() || 'No description available',
        descriptionHi: formData.descriptionHi.trim() || 'कोई विवरण उपलब्ध नहीं',
        price: parseFloat(formData.price) || 0,
        originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price) || 0,
        category: formData.category || 'rudraksha',
        images: Array.isArray(formData.images) 
          ? formData.images.filter(img => img && img.url).map(img => img.url)
          : [],
        inStock: Boolean(formData.inStock),
        stock: parseInt(formData.stock) || 0,
        isActive: Boolean(formData.isActive),
        featured: Boolean(formData.isFeatured),
        // Convert arrays properly
        benefits: Array.isArray(formData.spiritualBenefits) ? formData.spiritualBenefits : [],
        benefitsHi: Array.isArray(formData.spiritualBenefits) ? formData.spiritualBenefits : [],
        // Add other fields that exist in the model
        weight: formData.specifications?.weight || '',
        material: formData.specifications?.material || '',
        origin: formData.specifications?.origin || '',
        certification: formData.specifications?.certification || ''
      }
      
      console.log('Submitting clean form data:', cleanFormData)
      
      if (editingProduct) {
        // Update existing product
        console.log('Updating product with ID:', editingProduct._id)
        console.log('Update URL:', `${BACKEND_URL}/api/products/admin/${editingProduct._id}`)
        
        const response = await fetch(`${BACKEND_URL}/api/products/admin/${editingProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cleanFormData)
        })
        
        console.log('Update response status:', response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Update error response text:', errorText)
          
          let errorData
          try {
            errorData = JSON.parse(errorText)
          } catch (e) {
            errorData = { message: errorText }
          }
          
          console.error('Update error response:', errorData)
          throw new Error(errorData.message || errorData.error || 'Failed to update product')
        }
        
        const data = await response.json()
        console.log('Update success response:', data)
        
        setProducts(prev => prev.map(product => 
          product._id === editingProduct._id 
            ? data.data
            : product
        ))
        alert('Product updated successfully!')
      } else {
        // Add new product
        const response = await fetch(`${BACKEND_URL}/api/products/admin/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cleanFormData)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Create error response:', errorData)
          throw new Error(errorData.message || 'Failed to create product')
        }
        
        const data = await response.json()
        setProducts(prev => [...prev, data.data])
        alert('Product added successfully!')
      }
      
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save product:', error)
      alert(`Failed to save product: ${error.message}. Please check the console for details.`)
    }
  }

  const handleEdit = (product) => {
    console.log('Editing product:', product)
    console.log('Product images:', product.images)
    
    setEditingProduct(product)
    
    // Ensure images array is properly formatted
    let formattedImages = []
    if (product.images && Array.isArray(product.images)) {
      formattedImages = product.images.map((image, index) => {
        // Handle both string URLs and object format
        if (typeof image === 'string') {
          return {
            url: image,
            filename: image.split('/').pop() || `image_${index}`,
            originalName: image.split('/').pop() || `image_${index}`,
            isPrimary: index === 0,
            alt: `${product.name || 'Product'} Image ${index + 1}`
          }
        } else if (typeof image === 'object' && image.url) {
          return {
            url: image.url,
            filename: image.filename || image.url.split('/').pop() || `image_${index}`,
            originalName: image.originalName || image.filename || image.url.split('/').pop() || `image_${index}`,
            isPrimary: image.isPrimary !== undefined ? image.isPrimary : index === 0,
            alt: image.alt || `${product.name || 'Product'} Image ${index + 1}`,
            size: image.size
          }
        }
        return null
      }).filter(Boolean)
    }
    
    console.log('Formatted images for edit:', formattedImages)
    
    setFormData({
      name: product.name || '',
      nameHi: product.nameHi || '',
      description: product.description || '',
      descriptionHi: product.descriptionHi || '',
      price: product.price?.toString() || '0',
      originalPrice: product.originalPrice?.toString() || '0',
      category: product.category || 'rudraksha',
      icon: product.icon || '💎',
      stock: product.stock?.toString() || '0',
      inStock: product.inStock !== undefined ? product.inStock : true,
      isActive: product.isActive !== undefined ? product.isActive : true,
      isFeatured: product.featured !== undefined ? product.featured : false,
      specifications: product.specifications || {
        material: product.material || '',
        weight: product.weight || '',
        size: '', 
        color: '', 
        origin: product.origin || '', 
        certification: product.certification || '', 
        purity: ''
      },
      spiritualBenefits: product.benefits || [],
      rulingPlanet: product.rulingPlanet || '',
      chakra: product.chakra || '',
      mantra: product.mantra || '',
      usageInstructions: product.usageInstructions || { en: '', hi: '' },
      careInstructions: product.careInstructions || { en: '', hi: '' },
      tags: product.tags || [],
      adminNotes: product.adminNotes || '',
      sortOrder: product.sortOrder || 0,
      shippingClass: product.shippingClass || 'standard',
      vendor: product.vendor || { name: '', contact: '', location: '' },
      images: formattedImages
    })
    setShowModal(true)
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/products/admin/${productId}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete product')
        }
        
        setProducts(prev => prev.filter(product => product._id !== productId))
        alert('Product deleted successfully!')
      } catch (error) {
        console.error('Failed to delete product:', error)
        alert('Failed to delete product. Please try again.')
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setImagePreview(null)
    setUploadingImage(false)
    setFormData({
      name: '', nameHi: '', description: '', descriptionHi: '',
      price: '0', originalPrice: '0', category: 'rudraksha', icon: '💎',
      stock: '0', inStock: true, isActive: true, isFeatured: false,
      specifications: { material: '', weight: '', size: '', color: '', origin: '', certification: '', purity: '' },
      spiritualBenefits: [], rulingPlanet: '', chakra: '', mantra: '',
      usageInstructions: { en: '', hi: '' }, careInstructions: { en: '', hi: '' },
      tags: [], adminNotes: '', sortOrder: 0, shippingClass: 'standard',
      vendor: { name: '', contact: '', location: '' }, images: []
    })
  }

  const getStockStatusColor = (product) => {
    if (!product.inStock || product.stock === 0) return 'bg-red-100 text-red-800'
    if (product.stock <= 5) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStockStatusText = (product) => {
    if (!product.inStock || product.stock === 0) return 'Out of Stock'
    if (product.stock <= 5) return 'Low Stock'
    return 'In Stock'
  }

  const handleToggleStatus = async (productId) => {
    try {
      const product = products.find(p => p._id === productId)
      const response = await fetch(`${BACKEND_URL}/api/products/admin/${productId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled: !product.isActive })
      })
      
      if (!response.ok) {
        throw new Error('Failed to toggle product status')
      }
      
      setProducts(products.map(p => 
        p._id === productId 
          ? { ...p, isActive: !p.isActive }
          : p
      ))
    } catch (error) {
      console.error('Failed to toggle product status:', error)
      alert('Failed to update product status. Please try again.')
    }
  }

  // Filter and search products
  const filteredProducts = products.filter(product => {
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.nameHi && product.nameHi.includes(searchTerm))
    return matchesCategory && matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your astrology products and shop items</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            + Add New Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <div>Total: {filteredProducts.length} products (showing filtered)</div>
              <div>Loaded: {products.length} products from API</div>
              {filterCategory !== 'all' && (
                <div>Category: {filterCategory}</div>
              )}
              {searchTerm && (
                <div>Search: "{searchTerm}"</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={getImageURL(product.images.find(img => img.isPrimary) || product.images[0])}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <span className="text-2xl">{product.icon || '💎'}</span>
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-600">{product.nameHi}</div>
                        {product.isFeatured && (
                          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mt-1">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium capitalize">
                      {product.category.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">₹{product.price.toLocaleString()}</div>
                    {product.originalPrice > product.price && (
                      <div className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{product.stock || 0}</div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product)}`}>
                      {getStockStatusText(product)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(product._id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {product.isActive ? '✅ Active' : '❌ Disabled'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{product.salesCount || 0}</div>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600">{product.rating || '4.5'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
              >
                Previous
              </button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                title="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name (English) *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter English name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name (Hindi) *</label>
                  <input
                    type="text"
                    name="nameHi"
                    value={formData.nameHi}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="हिंदी नाम दर्ज करें"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (English) *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter English description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Hindi) *</label>
                  <textarea
                    name="descriptionHi"
                    value={formData.descriptionHi}
                    onChange={handleInputChange}
                    rows="3"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="हिंदी विवरण दर्ज करें"
                  />
                </div>
              </div>

              {/* Pricing and Category */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price *</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="🔮"
                  />
                </div>
              </div>

              {/* Stock Management */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Product Status */}
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-amber-600 shadow-sm focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-amber-600 shadow-sm focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enabled</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-amber-600 shadow-sm focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
              </div>

              {/* Spiritual Properties */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ruling Planet</label>
                  <input
                    type="text"
                    name="rulingPlanet"
                    value={formData.rulingPlanet}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., Sun, Moon, Mars"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chakra</label>
                  <input
                    type="text"
                    name="chakra"
                    value={formData.chakra}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., Heart, Throat, Crown"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mantra</label>
                  <input
                    type="text"
                    name="mantra"
                    value={formData.mantra}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Associated mantra"
                  />
                </div>
              </div>

              {/* Product Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                
                {/* Upload New Image */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-4xl text-gray-400 mb-4">📷</div>
                    <div className="text-sm text-gray-600 mb-4">
                      Upload product images (JPEG, PNG, GIF, WebP - Max 5MB each)
                      <br />
                      <span className="text-xs text-green-600 font-medium">
                        ✨ Images will be automatically optimized to 800×800 WebP format
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        uploadingImage 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-amber-600 hover:bg-amber-700'
                      }`}
                    >
                      {uploadingImage ? 'Uploading...' : 'Choose Image'}
                    </label>
                  </div>
                </div>

                {/* Existing Images */}
                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative border rounded-lg overflow-hidden">
                        <img
                          src={getImageURL(image.url)}
                          alt={image.alt || `Product image ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        {image.isPrimary && (
                          <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                            Primary
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex space-x-1">
                          {!image.isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(index)}
                              className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded cursor-pointer"
                              title="Set as primary"
                            >
                              ⭐
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded cursor-pointer"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                        <div className="p-2 bg-gray-50">
                          <div className="text-xs text-gray-600 truncate">
                            {image.originalName || image.filename}
                          </div>
                          <div className="text-xs text-gray-500">
                            {image.size ? `${Math.round(image.size / 1024)}KB` : ''}
                            {image.dimensions && ` • ${image.dimensions}`}
                            {image.format && ` • ${image.format.toUpperCase()}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="spiritual, healing, meditation"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold cursor-pointer"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductManagement