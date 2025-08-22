import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories] = useState(['all', 'astrology', 'horoscope', 'spirituality', 'meditation', 'remedies', 'general']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`${BACKEND_URL}/api/blogs/published?${queryParams.toString()}`);
      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBlogs();
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
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
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Astrology Insights
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover the wisdom of the stars through our expert articles on astrology, horoscopes, and spiritual guidance
            </p>
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
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
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 text-6xl mb-4">🔮</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {blogs.map((blog) => (
                <Link 
                  key={blog._id} 
                  to={`/blog/${blog.slug}`}
                  className="block"
                >
                  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                    {/* Blog Image */}
                    <div className="h-56 lg:h-64 bg-gradient-to-br from-indigo-100 to-purple-100" style={{ aspectRatio: '16/9' }}>
                      {blog.featuredImage ? (
                        <img
                          src={getImageUrl(blog.featuredImage)}
                          alt={blog.featuredImageAlt || blog.title}
                          className="w-full h-full object-cover"
                          width="1200"
                          height="675"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🔮</div>
                            <p className="text-indigo-700 font-medium text-sm">Astrology Insights</p>
                          </div>
                        </div>
                      )}
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