import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const BlogsPage = () => {
  // Demo blog data
  const demoBlogs = [
    {
      _id: '1',
      title: 'राहु-केतु का जीवन पर प्रभाव - Understanding Rahu-Ketu Effects',
      slug: 'rahu-ketu-effects-on-life',
      excerpt: 'राहु और केतु ग्रहों के जीवन पर प्रभाव को समझें। जानें कि कैसे ये छाया ग्रह आपके करियर, रिश्ते और स्वास्थ्य को प्रभावित करते हैं। Learn how shadow planets Rahu and Ketu influence your life, career, relationships, and health.',
      category: 'astrology',
      publishedAt: '2024-01-15T10:30:00Z',
      views: 1245,
      featuredImage: null,
      content: 'राहु और केतु के प्रभाव पर विस्तृत जानकारी...'
    },
    {
      _id: '2',
      title: 'मकर संक्रांति 2024 - Astrological Significance and Remedies',
      slug: 'makar-sankranti-2024-significance',
      excerpt: 'मकर संक्रांति का ज्योतिषीय महत्व और उपाय जानें। इस पवित्र दिन सूर्य देव मकर राशि में प्रवेश करते हैं। Discover the astrological importance of Makar Sankranti and powerful remedies for prosperity.',
      category: 'spirituality',
      publishedAt: '2024-01-10T08:15:00Z',
      views: 892,
      featuredImage: null,
      content: 'मकर संक्रांति के ज्योतिषीय महत्व पर विस्तार...'
    },
    {
      _id: '3',
      title: 'Weekly Horoscope - साप्ताहिक राशिफल (January 2024)',
      slug: 'weekly-horoscope-january-2024',
      excerpt: 'जनवरी 2024 का साप्ताहिक राशिफल। जानें इस सप्ताह आपकी राशि के लिए क्या है खास। Get detailed weekly predictions for all zodiac signs with career, love, and health insights.',
      category: 'horoscope',
      publishedAt: '2024-01-08T06:00:00Z',
      views: 2156,
      featuredImage: null,
      content: 'इस सप्ताह के सभी राशियों का विस्तृत राशिफल...'
    },
    {
      _id: '4',
      title: 'Gemstone Remedies - रत्न चिकित्सा के फायदे',
      slug: 'gemstone-remedies-benefits',
      excerpt: 'रत्न चिकित्सा के अद्भुत फायदे जानें। सही रत्न पहनने से कैसे बदल सकती है आपकी किस्मत। Explore the incredible benefits of gemstone therapy and how the right gems can transform your destiny.',
      category: 'remedies',
      publishedAt: '2024-01-05T14:20:00Z',
      views: 756,
      featuredImage: null,
      content: 'रत्न चिकित्सा और इसके लाभों का विस्तार...'
    },
    {
      _id: '5',
      title: 'Mercury Retrograde Effects - बुध वक्री का प्रभाव',
      slug: 'mercury-retrograde-effects-2024',
      excerpt: 'बुध वक्री के दौरान क्या सावधानियां बरतें। जानें इस समय कौन से काम करें और कौन से न करें। Learn about Mercury retrograde effects and essential precautions to take during this period.',
      category: 'astrology',
      publishedAt: '2024-01-03T11:45:00Z',
      views: 634,
      featuredImage: null,
      content: 'बुध वक्री के प्रभाव और सावधानियों का विवरण...'
    },
    {
      _id: '6',
      title: 'Meditation and Astrology - ध्यान और ज्योतिष',
      slug: 'meditation-astrology-connection',
      excerpt: 'ध्यान और ज्योतिष के बीच गहरा संबंध है। जानें कैसे आपकी राशि के अनुसार ध्यान करने से मिलते हैं बेहतर परिणाम। Discover the deep connection between meditation and astrology for better spiritual growth.',
      category: 'meditation',
      publishedAt: '2024-01-01T09:30:00Z',
      views: 445,
      featuredImage: null,
      content: 'ध्यान और ज्योतिष के संबंध का विस्तृत विवरण...'
    }
  ];

  const [blogs, setBlogs] = useState(demoBlogs);
  const [loading, setLoading] = useState(false);
  const [categories] = useState(['all', 'astrology', 'horoscope', 'spirituality', 'meditation', 'remedies', 'general']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState(demoBlogs);

  useEffect(() => {
    filterBlogs();
  }, [selectedCategory, searchTerm]);

  const filterBlogs = () => {
    let filtered = demoBlogs;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterBlogs();
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'No date available';
    }
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date received:', dateString);
      return 'Invalid date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  const getCategoryColor = (category) => {
    switch(category) {
      case 'astrology': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'horoscope': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'spirituality': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'meditation': return 'bg-green-100 text-green-800 border-green-200';
      case 'remedies': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      {/* Schema markup for Blog page */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Blog - Astro Satya",
            "description": "Latest astrology articles, horoscope insights, spiritual guidance, and remedies from expert astrologer Pandit Satya Prakash Tripathi.",
            "url": "https://astrosatya.com/blog",
            "mainEntity": {
              "@type": "Blog",
              "name": "Astro Satya Blog",
              "description": "Astrology insights, horoscope predictions, and spiritual guidance",
              "publisher": {
                "@type": "Organization",
                "name": "Astro Satya",
                "url": "https://astrosatya.com"
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://astrosatya.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": "https://astrosatya.com/blog"
                }
              ]
            }
          })
        }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        {/* Search and Filter Section */}
        <div className="bg-white shadow-sm border-b pt-32">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
                >
                  Search
                </button>
              </form>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                      selectedCategory === category
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 text-6xl mb-4">🔮</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBlogs.map((blog) => (
                <Link 
                  key={blog._id} 
                  to={`/blog/${blog.slug}`}
                  className="block"
                >
                  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                    {/* Blog Image */}
                    <div className="h-56 lg:h-64 bg-gradient-to-br from-indigo-100 to-purple-100" style={{ aspectRatio: '16/9' }}>
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🔮</div>
                          <p className="text-indigo-700 font-medium text-sm">Astrology Insights</p>
                        </div>
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-6">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize border ${getCategoryColor(blog.category)}`}>
                          {blog.category}
                        </span>
                      </div>

                      {/* Blog Title */}
                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
                        {blog.title}
                      </h2>

                      {/* Blog Excerpt */}
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>

                      {/* Blog Meta */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {blog.views || 0}
                          </span>
                        </div>
                        <span className="text-orange-600 font-medium">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer can be added here if you have one */}
      </div>
    </>
  );
};

export default BlogsPage;