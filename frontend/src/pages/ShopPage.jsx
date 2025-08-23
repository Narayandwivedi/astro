import React, { useState } from 'react';
import Navigation from '../components/Navigation';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = [
    {
      id: 1,
      name: "1 Mukhi Rudraksha",
      hindi: "एक मुखी रुद्राक्ष",
      description: "Original 1 Mukhi Rudraksha for Lord Shiva blessings, spiritual growth, and peace of mind. Certified authentic.",
      hindiDesc: "भगवान शिव की कृपा और आध्यात्मिक विकास के लिए प्रामाणिक एक मुखी रुद्राक्ष।",
      price: "₹12,000",
      originalPrice: "₹15,000",
      image: "🔮",
      category: "rudraksha",
      inStock: true,
      rating: 4.8,
      reviews: 156
    },
    {
      id: 2,
      name: "5 Mukhi Rudraksha",
      hindi: "पांच मुखी रुद्राक्ष",
      description: "Powerful 5 Mukhi Rudraksha for health, wealth, and overall well-being. Most popular and effective Rudraksha.",
      hindiDesc: "स्वास्थ्य, धन और समृद्धि के लिए अत्यंत प्रभावशाली पांच मुखी रुद्राक्ष।",
      price: "₹500",
      originalPrice: "₹800",
      image: "🌿",
      category: "rudraksha",
      inStock: true,
      rating: 4.9,
      reviews: 892
    },
    {
      id: 3,
      name: "Blue Sapphire (Neelam)",
      hindi: "नीलम रत्न",
      description: "Original Blue Sapphire gemstone for Saturn planet. Helps with career, business success, and removes obstacles.",
      hindiDesc: "शनि ग्रह के लिए प्रामाणिक नीलम रत्न। करियर, व्यापार और बाधाओं के निवारण के लिए।",
      price: "₹8,500",
      originalPrice: "₹12,000",
      image: "💎",
      category: "gemstone",
      inStock: true,
      rating: 4.7,
      reviews: 234
    },
    {
      id: 4,
      name: "Yellow Sapphire (Pukhraj)",
      hindi: "पुखराज रत्न",
      description: "Natural Yellow Sapphire for Jupiter. Brings wisdom, wealth, prosperity, and good fortune in life.",
      hindiDesc: "बृहस्पति ग्रह के लिए प्राकृतिक पुखराज। बुद्धि, धन, समृद्धि और सौभाग्य प्रदान करता है।",
      price: "₹6,500",
      originalPrice: "₹9,000",
      image: "💛",
      category: "gemstone",
      inStock: true,
      rating: 4.6,
      reviews: 178
    },
    {
      id: 5,
      name: "Ruby (Manik)",
      hindi: "माणिक्य रत्न",
      description: "Genuine Ruby gemstone for Sun planet. Enhances leadership qualities, confidence, and removes health issues.",
      hindiDesc: "सूर्य ग्रह के लिए प्रामाणिक माणिक्य रत्न। नेतृत्व, आत्मविश्वास और स्वास्थ्य लाभ के लिए।",
      price: "₹7,800",
      originalPrice: "₹11,000",
      image: "♦️",
      category: "gemstone",
      inStock: false,
      rating: 4.8,
      reviews: 145
    },
    {
      id: 6,
      name: "Gomed (Hessonite)",
      hindi: "गोमेद रत्न",
      description: "Natural Hessonite garnet for Rahu planet. Protects from negative energies and brings success.",
      hindiDesc: "राहु ग्रह के लिए प्राकृतिक गोमेद रत्न। नकारात्मक ऊर्जा से सुरक्षा और सफलता के लिए।",
      price: "₹3,200",
      originalPrice: "₹4,500",
      image: "🟤",
      category: "gemstone",
      inStock: true,
      rating: 4.5,
      reviews: 267
    },
    {
      id: 7,
      name: "Sphatik Mala",
      hindi: "स्फटिक माला",
      description: "Pure Crystal (Sphatik) prayer beads for meditation, concentration, and spiritual practices.",
      hindiDesc: "ध्यान, एकाग्रता और आध्यात्मिक साधना के लिए शुद्ध स्फटिक माला।",
      price: "₹800",
      originalPrice: "₹1,200",
      image: "📿",
      category: "spiritual",
      inStock: true,
      rating: 4.7,
      reviews: 445
    },
    {
      id: 8,
      name: "Tulsi Mala",
      hindi: "तुलसी माला",
      description: "Sacred Tulsi beads mala for Lord Krishna worship, brings peace, prosperity, and spiritual growth.",
      hindiDesc: "भगवान कृष्ण की पूजा के लिए पवित्र तुलसी माला। शांति, समृद्धि और आध्यात्मिक उन्नति के लिए।",
      price: "₹350",
      originalPrice: "₹500",
      image: "🌱",
      category: "spiritual",
      inStock: true,
      rating: 4.9,
      reviews: 678
    },
    {
      id: 9,
      name: "Shree Yantra",
      hindi: "श्री यंत्र",
      description: "Powerful Shree Yantra for wealth, prosperity, and Goddess Lakshmi blessings. Made with pure copper.",
      hindiDesc: "धन, समृद्धि और माता लक्ष्मी की कृपा के लिए शक्तिशाली श्री यंत्र। शुद्ध तांबे से निर्मित।",
      price: "₹2,500",
      originalPrice: "₹3,500",
      image: "🔶",
      category: "yantra",
      inStock: true,
      rating: 4.8,
      reviews: 189
    },
    {
      id: 10,
      name: "Kuber Yantra",
      hindi: "कुबेर यंत्र",
      description: "Lord Kuber Yantra for immense wealth, business success, and financial stability.",
      hindiDesc: "धन के देवता कुबेर यंत्र। अपार संपत्ति, व्यापारिक सफलता और वित्तीय स्थिरता के लिए।",
      price: "₹1,800",
      originalPrice: "₹2,500",
      image: "💰",
      category: "yantra",
      inStock: true,
      rating: 4.6,
      reviews: 234
    },
    {
      id: 11,
      name: "Parad Shivling",
      hindi: "पारद शिवलिंग",
      description: "Sacred Mercury Shivling for Lord Shiva worship. Highly auspicious for health and spiritual benefits.",
      hindiDesc: "भगवान शिव की पूजा के लिए पवित्र पारद शिवलिंग। स्वास्थ्य और आध्यात्मिक लाभ के लिए अत्यंत शुभ।",
      price: "₹5,500",
      originalPrice: "₹8,000",
      image: "🔱",
      category: "spiritual",
      inStock: true,
      rating: 4.9,
      reviews: 123
    },
    {
      id: 12,
      name: "Feng Shui Crystal Tree",
      hindi: "फेंग शुई क्रिस्टल ट्री",
      description: "Beautiful crystal tree for positive energy, wealth attraction, and home/office decoration.",
      hindiDesc: "सकारात्मक ऊर्जा, धन आकर्षण और घर/ऑफिस की सजावट के लिए सुंदर क्रिस्टल ट्री।",
      price: "₹1,200",
      originalPrice: "₹1,800",
      image: "🌳",
      category: "crystal",
      inStock: true,
      rating: 4.4,
      reviews: 356
    }
  ];

  const categories = [
    { name: "All Products", value: "all" },
    { name: "Rudraksha", value: "rudraksha" },
    { name: "Gemstones", value: "gemstone" },
    { name: "Spiritual Items", value: "spiritual" },
    { name: "Yantras", value: "yantra" },
    { name: "Crystals", value: "crystal" }
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const handleBuyNow = (product) => {
    // Create WhatsApp message
    const message = `Hi! I want to buy ${product.name} (${product.hindi}) for ${product.price}. Please provide more details.`;
    const whatsappUrl = `https://wa.me/91883945431?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="w-full">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              Spiritual Shop
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              आध्यात्मिक दुकान - Authentic Spiritual Products
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our collection of authentic Rudraksha, precious gemstones, yantras, and spiritual items. 
              All products are energized and blessed by Pandit Satya Prakash Tripathi for maximum benefits.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                
                {/* Product Image */}
                <div className="h-48 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center relative">
                  <span className="text-6xl">{product.image}</span>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        SALE
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-orange-600 font-medium mb-3">{product.hindi}</p>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <p className="text-gray-700 text-xs mb-4 font-medium">
                    {product.hindiDesc}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {"★".repeat(Math.floor(product.rating))}
                      {"☆".repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-orange-600">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                    <div className={`text-xs font-bold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                    </div>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={() => handleBuyNow(product)}
                    disabled={!product.inStock}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      product.inStock
                        ? 'bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {product.inStock ? '🛒 Buy Now - अभी खरीदें' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Buy from Astro Satya?
            </h2>
            <p className="text-lg text-gray-600">
              हमसे क्यों खरीदें - Your Trusted Spiritual Partner
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-green-600">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">100% Authentic</h3>
              <p className="text-gray-600">All products are genuine and certified for authenticity</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-orange-600">🔮</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Energized & Blessed</h3>
              <p className="text-gray-600">Products blessed with powerful mantras and rituals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-blue-600">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free delivery across India with secure packaging</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-purple-600">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Guidance</h3>
              <p className="text-gray-600">Personal consultation for product selection and usage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-yellow-600">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need Help Choosing Products?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Get personalized recommendations from Pandit Satya Prakash Tripathi 
            based on your birth chart and specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/91883945431?text=Hi! I need help choosing the right spiritual products for me."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-600 font-semibold px-8 py-4 rounded-lg hover:bg-orange-50 transition-colors shadow-lg"
            >
              💬 WhatsApp Consultation
            </a>
            <a
              href="tel:+91883945431"
              className="bg-orange-700 text-white font-semibold px-8 py-4 rounded-lg hover:bg-orange-800 transition-colors shadow-lg"
            >
              📞 Call: +91 883945431
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ShopPage;