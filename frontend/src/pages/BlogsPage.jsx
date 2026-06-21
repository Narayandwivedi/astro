import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { AppContext } from '../context/AppContext';

const BlogsPage = () => {
  const { BACKEND_URL, getImageURL } = useContext(AppContext);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories] = useState(['all', 'astrology', 'horoscope', 'spirituality', 'meditation', 'remedies', 'vastu', 'general']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [error, setError] = useState(null);

  // Fetch blogs from backend
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BACKEND_URL}/api/blogs?status=published&limit=50`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }

      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs || []);
      } else {
        throw new Error(data.message || 'Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError(error.message);
      setBlogs([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [selectedCategory, searchTerm, blogs]);

  const filterBlogs = () => {
    let filtered = blogs;

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
      case 'vastu': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
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

        {/* Page Header & Filters */}
        <div className="bg-white border-b pt-24 pb-8 sm:pt-32 sm:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                Astrology <span className="text-orange-600">Insights</span>
              </h1>
              <p className="text-lg text-gray-600">
                Explore our latest articles, guides, and spiritual wisdom to navigate your life's journey.
              </p>
            </div>
            
            {/* Search and Categories Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-gray-50 p-2 sm:p-3 rounded-2xl border border-gray-100">
              <div className="w-full lg:w-auto flex flex-wrap gap-1.5 sm:gap-2 justify-center lg:justify-start">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-semibold transition-all capitalize ${
                      selectedCategory === category
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSearch} className="w-full lg:w-96 flex relative">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <section id="articles" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
              <div className="text-red-400 text-5xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Blogs</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchBlogs}
                className="bg-orange-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-orange-700 transition-colors shadow-sm"
              >
                Try Again
              </button>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
              <div className="text-gray-400 text-5xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {blogs.length === 0 ? 'No articles yet' : 'No articles found'}
              </h3>
              <p className="text-gray-600">
                {blogs.length === 0
                  ? 'Check back later for new content.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {filteredBlogs.map((blog) => (
                <Link 
                  key={blog._id} 
                  to={`/blog/${blog.slug}`}
                  className="block group h-full"
                >
                  <article className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                    {/* Image Area */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                      {blog.featuredImage ? (
                        <img
                          src={getImageURL(blog.featuredImage)}
                          alt={blog.featuredImageAlt || blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full flex items-center justify-center bg-orange-50" style={{ display: blog.featuredImage ? 'none' : 'flex' }}>
                        <span className="text-2xl sm:text-4xl">✨</span>
                      </div>
                      
                      {/* Floating Category Badge */}
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                        <span className="bg-white/95 backdrop-blur text-gray-900 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide shadow-sm">
                          {blog.category}
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-3 sm:p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500 mb-2 font-medium">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <time dateTime={blog.publishedAt || blog.createdAt}>
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </time>
                        </span>
                      </div>

                      <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">
                        {blog.title}
                      </h2>

                      <p className="text-gray-600 text-[11px] sm:text-sm mb-3 sm:mb-4 line-clamp-2 flex-1 leading-relaxed">
                        {blog.excerpt}
                      </p>

                      <div className="pt-2 sm:pt-3 border-t border-gray-100 mt-auto flex items-center justify-between">
                        <span className="font-semibold text-orange-600 text-[11px] sm:text-sm flex items-center gap-1 group-hover:gap-1.5 transition-all">
                          Read 
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                          </svg>
                        </span>
                        
                        {blog.views > 0 && (
                          <span className="flex items-center text-gray-400 text-[10px] sm:text-xs font-medium">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {blog.views}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-purple-900 via-indigo-900 to-amber-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-25">
            <div className="w-full h-full cosmic-stars"></div>
          </div>
          <div className="container mx-auto px-3 sm:px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 md:mb-4 lg:mb-6">
                Need Personalized Astrological Guidance?
              </h3>
              <p className="text-sm md:text-base lg:text-xl text-purple-200 mb-4 md:mb-6 lg:mb-8 leading-relaxed">
                Get expert consultation from <strong>Acharya Satya Prakash Tripathi</strong>. Discover personalized solutions for your life challenges.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center">
                <a
                  href="/services"
                  className="bg-white hover:bg-purple-50 text-purple-800 font-bold px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm md:text-base rounded-lg md:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 md:hover:-translate-y-1"
                >
                  🕰 Book Consultation
                </a>
                <a
                  href="/contact"
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:via-orange-600 hover:to-amber-600 text-white font-bold px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm md:text-base rounded-lg md:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 md:hover:-translate-y-1"
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