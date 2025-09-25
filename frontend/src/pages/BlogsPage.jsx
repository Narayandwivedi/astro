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

  // Enhanced SEO optimization
  useEffect(() => {
    document.title = 'Expert Astrology Blog | Vedic Astrology Articles by Acharya Satya Prakash Tripathi';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Read expert Vedic astrology blog by Acharya Satya Prakash Tripathi. Latest articles on horoscope predictions, gemstone remedies, vastu shastra, spiritual guidance, meditation, and planetary effects. Get authentic astrological insights for modern life challenges.');
    }

    // Add additional schema markup for blog listing
    let structuredData = document.querySelector('script[type="application/ld+json"][data-page="blogs"]');
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.type = 'application/ld+json';
      structuredData.setAttribute('data-page', 'blogs');
      document.head.appendChild(structuredData);
    }

    structuredData.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Expert Astrology Blog by Acharya Satya Prakash",
      "description": "Comprehensive Vedic astrology blog featuring expert insights on horoscopes, planetary effects, gemstone remedies, vastu shastra, spiritual guidance, and meditation practices",
      "url": "https://astrosatyaprakash.com/blogs",
      "author": {
        "@type": "Person",
        "name": "Acharya Satya Prakash Tripathi",
        "jobTitle": "Expert Vedic Astrologer",
        "description": "Renowned Vedic astrologer with 10+ years of experience in providing accurate predictions and spiritual guidance",
        "url": "https://astrosatyaprakash.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Astro Satya Prakash",
        "url": "https://astrosatyaprakash.com",
        "founder": {
          "@type": "Person",
          "name": "Acharya Satya Prakash Tripathi"
        }
      },
      "about": [
        {
          "@type": "Thing",
          "name": "Vedic Astrology",
          "description": "Ancient Indian astrology system based on planetary positions"
        },
        {
          "@type": "Thing",
          "name": "Horoscope Predictions",
          "description": "Daily, weekly, and monthly astrological forecasts"
        },
        {
          "@type": "Thing",
          "name": "Gemstone Remedies",
          "description": "Healing and beneficial effects of precious gemstones"
        },
        {
          "@type": "Thing",
          "name": "Vastu Shastra",
          "description": "Ancient architectural principles for harmonious living"
        },
        {
          "@type": "Thing",
          "name": "Spiritual Guidance",
          "description": "Spiritual practices and meditation for personal growth"
        }
      ],
      "keywords": "vedic astrology, horoscope, gemstone remedies, vastu shastra, spiritual guidance, meditation, planetary effects, kundli reading, marriage astrology, business astrology",
      "inLanguage": ["en", "hi"],
      "blogPost": filteredBlogs.slice(0, 5).map(blog => ({
        "@type": "BlogPosting",
        "headline": blog.title,
        "description": blog.excerpt,
        "url": `https://astrosatyaprakash.com/blog/${blog.slug}`,
        "datePublished": blog.publishedAt,
        "author": {
          "@type": "Person",
          "name": "Acharya Satya Prakash Tripathi"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Astro Satya Prakash"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://astrosatyaprakash.com/blog/${blog.slug}`
        }
      }))
    });

    return () => {
      const script = document.querySelector('script[data-page="blogs"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [filteredBlogs]);

  return (
    <>
      {/* Schema markup for Blog page */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Astrology Blog - Astro Satya Prakash | Vedic Astrology Articles",
            "description": "Expert astrology insights, horoscope predictions, spiritual guidance and remedies by Acharya Satya Prakash Tripathi. Latest articles on Vedic astrology, gemstones, vastu shastra and more.",
            "url": "https://astrosatyaprakash.com/blog",
            "mainEntity": {
              "@type": "Blog",
              "name": "Astro Satya Prakash Blog",
              "description": "Comprehensive astrology insights, horoscope predictions, spiritual guidance and Vedic remedies by expert astrologer Acharya Satya Prakash Tripathi",
              "publisher": {
                "@type": "Organization",
                "name": "Astro Satya Prakash",
                "url": "https://astrosatyaprakash.com"
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://astrosatyaprakash.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": "https://astrosatyaprakash.com/blog"
                }
              ]
            }
          })
        }}
      />
      
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        {/* Enhanced Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700 pt-32 pb-16 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full cosmic-stars"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-purple-900/30"></div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-full px-6 py-2 mb-6 shadow-lg">
                <span className="text-purple-200 text-sm font-semibold">📜 Expert Astrology Insights</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                <span className="text-white">Astrology</span><br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-amber-300">Blog</span>
              </h1>
              <p className="text-xl md:text-2xl text-purple-200 mb-6 font-medium">
                ज्योतिष ब्लॉग - By <strong>Acharya Satya Prakash Tripathi</strong>
              </p>
              <p className="text-lg text-purple-300 max-w-4xl mx-auto leading-relaxed mb-8">
                Discover ancient Vedic wisdom for modern life challenges. Get expert insights on <strong>horoscope predictions, gemstone remedies, vastu guidance, spiritual practices, planetary effects, and meditation techniques</strong> from India's trusted astrologer with 10+ years of experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#articles"
                  className="bg-white hover:bg-purple-50 text-purple-800 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  📜 Read Latest Articles
                </a>
                <a
                  href="/services"
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:via-orange-600 hover:to-amber-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  🕰 Book Consultation
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <div className="bg-white shadow-sm border-b">
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
        <section id="articles" className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-purple-100 backdrop-blur-sm border border-purple-200 rounded-full px-6 py-2 mb-6">
              <span className="text-purple-600 text-sm font-semibold">✨ Latest Articles</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent mb-6">
              Expert Astrology Articles
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Stay updated with the latest insights on <strong>Vedic astrology, horoscope predictions, spiritual guidance, gemstone remedies, vastu shastra, and planetary effects</strong> from renowned astrologer <strong>Acharya Satya Prakash Tripathi</strong>. Get authentic knowledge to navigate life's challenges with ancient wisdom.
            </p>
          </div>
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
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-gradient-to-br from-purple-900 via-indigo-900 to-amber-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-25">
            <div className="w-full h-full cosmic-stars"></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Need Personalized Astrological Guidance?
              </h3>
              <p className="text-xl text-purple-200 mb-8 leading-relaxed">
                Get expert consultation from <strong>Acharya Satya Prakash Tripathi</strong>. Discover personalized solutions for your life challenges through authentic Vedic astrology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/services"
                  className="bg-white hover:bg-purple-50 text-purple-800 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  🕰 Book Consultation Now
                </a>
                <a
                  href="/contact"
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:via-orange-600 hover:to-amber-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  📞 Contact Expert
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default BlogsPage;