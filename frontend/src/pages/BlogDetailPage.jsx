import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import ShareButton from '../components/ShareButton';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/api/blogs/published/${slug}`);
        const data = await response.json();

        if (data.success) {
          setBlog(data.blog);
          // Fetch related blogs
          fetchRelatedBlogs(data.blog.category);
        } else {
          setError(data.message || 'Blog not found');
        }
      } catch (err) {
        setError('Failed to fetch blog');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedBlogs = async (category) => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/blogs/published?category=${category}&limit=3`);
        const data = await response.json();
        if (data.success) {
          setRelatedBlogs(data.blogs.filter(b => b.slug !== slug));
        }
      } catch (err) {
        console.error('Error fetching related blogs:', err);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug, BACKEND_URL]);

  useEffect(() => {
    if (blog) {
      const title = blog.metaTitle || blog.title;
      const description = blog.metaDescription || blog.excerpt;
      const imageUrl = blog.featuredImage ? getImageUrl(blog.featuredImage) : null;
      
      document.title = `${title} | Astro Satya Blog`;
      
      const setMetaTag = (name, content, property = false) => {
        const attribute = property ? 'property' : 'name';
        let meta = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute(attribute, name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      setMetaTag('description', description);
      setMetaTag('keywords', blog.tags ? blog.tags.join(', ') : 'astrology, horoscope, spirituality, Astro Satya');
      
      setMetaTag('og:title', title, true);
      setMetaTag('og:description', description, true);
      setMetaTag('og:type', 'article', true);
      setMetaTag('og:url', window.location.href, true);
      if (imageUrl) {
        setMetaTag('og:image', imageUrl, true);
        setMetaTag('og:image:width', '1200', true);
        setMetaTag('og:image:height', '675', true);
        setMetaTag('og:image:alt', blog.featuredImageAlt || blog.title, true);
      }
      
      setMetaTag('twitter:card', 'summary_large_image', true);
      setMetaTag('twitter:title', title, true);
      setMetaTag('twitter:description', description, true);
      if (imageUrl) {
        setMetaTag('twitter:image', imageUrl, true);
      }

      const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "image": imageUrl ? {
          "@type": "ImageObject",
          "url": imageUrl,
          "width": 1200,
          "height": 675
        } : undefined,
        "author": {
          "@type": "Person",
          "name": blog.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "Astro Satya",
          "logo": {
            "@type": "ImageObject",
            "url": `${window.location.origin}/logo.png`
          }
        },
        "datePublished": blog.publishedAt || blog.createdAt,
        "dateModified": blog.updatedAt || blog.createdAt,
        "articleSection": blog.category,
        "keywords": blog.tags ? blog.tags.join(', ') : 'astrology, horoscope, spirituality',
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": window.location.href
        }
      };

      let jsonLd = document.querySelector('#blog-structured-data');
      if (!jsonLd) {
        jsonLd = document.createElement('script');
        jsonLd.id = 'blog-structured-data';
        jsonLd.type = 'application/ld+json';
        document.head.appendChild(jsonLd);
      }
      jsonLd.textContent = JSON.stringify(structuredData);
    }

    return () => {
      document.title = 'Astro Satya - Expert Astrology Services | Pandit Satya Prakash Tripathi';
      
      const jsonLd = document.querySelector('#blog-structured-data');
      if (jsonLd) {
        jsonLd.remove();
      }
    };
  }, [blog]);

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

  const estimateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BACKEND_URL}${imagePath}`;
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'astrology': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'horoscope': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'spirituality': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'meditation': return 'bg-green-100 text-green-800 border border-green-200';
      case 'remedies': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'vastu': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex flex-col justify-center items-center py-20 px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 text-5xl sm:text-6xl mb-4">🔮</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              {error || 'Article not found'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center bg-orange-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-orange-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb - Hidden on mobile, visible on tablet+ */}
            <nav className="mb-6 sm:mb-8 hidden sm:block">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
                <span>/</span>
                <Link to="/blog" className="hover:text-yellow-400 transition-colors">Blog</Link>
                <span>/</span>
                <span className="text-white font-medium truncate max-w-xs lg:max-w-md">{blog.title}</span>
              </div>
            </nav>

            {/* Back button for mobile */}
            <Link to="/blog" className="inline-flex items-center text-sm text-gray-300 hover:text-white mb-6 sm:hidden transition-colors">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>

            <div className="text-left">
              <div className="mb-4 sm:mb-6 flex items-center justify-between flex-wrap gap-3">
                <span className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold capitalize shadow-sm ${getCategoryColor(blog.category)}`}>
                  {blog.category}
                </span>
                <ShareButton
                  url={window.location.href}
                  title={blog.title}
                  description={blog.excerpt}
                />
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 leading-tight">
                {blog.title}
              </h1>

              {/* Author & Stats - Improved mobile layout */}
              <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                    {blog.author.charAt(0)}
                  </div>
                  <div className="text-left min-w-0">
                    <div className="font-semibold text-white text-sm sm:text-base">By {blog.author}</div>
                    <div className="text-xs sm:text-sm text-gray-300">Astrology Expert</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 text-center border-t border-white/10 pt-4">
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-white mb-1">{formatDate(blog.publishedAt || blog.createdAt)}</div>
                    <div className="text-[10px] sm:text-xs text-gray-300">Published</div>
                  </div>
                  <div className="border-l border-r border-white/10">
                    <div className="text-xs sm:text-sm font-medium text-white mb-1">{blog.readTime || estimateReadTime(blog.content)} min</div>
                    <div className="text-[10px] sm:text-xs text-gray-300">Read time</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-medium text-white mb-1">{blog.views || 0}</div>
                    <div className="text-[10px] sm:text-xs text-gray-300">Views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="relative -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="relative rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl">
                <div className="w-full h-56 sm:h-72 md:h-96 lg:h-[32rem] bg-gray-200">
                  <img
                    src={getImageUrl(blog.featuredImage)}
                    alt={blog.featuredImageAlt || blog.title}
                    className="w-full h-full object-cover"
                    width="1200"
                    height="675"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Content */}
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col xl:flex-row gap-8 sm:gap-12 lg:gap-16">
              <article className="xl:w-2/3">
                <div
                  className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8 first:prose-headings:mt-0
                  prose-h2:text-xl sm:prose-h2:text-2xl lg:prose-h2:text-3xl
                  prose-h3:text-lg sm:prose-h3:text-xl lg:prose-h3:text-2xl
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-a:text-orange-600 prose-a:no-underline hover:prose-a:text-orange-700 hover:prose-a:underline
                  prose-ul:my-4 prose-ul:list-disc prose-ul:pl-5
                  prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-5
                  prose-li:text-gray-700 prose-li:mb-2
                  prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                  prose-img:rounded-xl prose-img:shadow-md prose-img:my-6"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                  style={{ lineHeight: '1.75' }}
                ></div>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-10 sm:mt-12 lg:mt-16 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      Topics Covered
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {blog.tags.map((tag, index) => (
                        <span key={index} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-gray-700 text-xs sm:text-sm rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>

              <aside className="xl:w-1/3">
                <div className="xl:sticky xl:top-8 space-y-6 sm:space-y-8">
                  {/* Author Card - Hidden on mobile since it's in hero */}
                  <div className="hidden sm:block bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Author
                    </h3>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                        {blog.author.charAt(0)}
                      </div>
                      <h4 className="font-semibold text-gray-900">{blog.author}</h4>
                      <p className="text-sm text-gray-500">Astrology Expert</p>
                      <p className="text-xs text-gray-400 mt-2">25+ Years Experience</p>
                    </div>
                  </div>

                  {relatedBlogs.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        Related Articles
                      </h3>
                      <div className="space-y-4">
                        {relatedBlogs.map((relatedBlog) => (
                          <div key={relatedBlog._id} className="group border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                            <Link to={`/blog/${relatedBlog.slug}`} className="block">
                              <h4 className="font-medium text-sm sm:text-base leading-tight mb-2 text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                                {relatedBlog.title}
                              </h4>
                              <p className="text-xs text-gray-500">{formatDate(relatedBlog.publishedAt || relatedBlog.createdAt)}</p>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Call to Action - Improved mobile design */}
                  <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white p-5 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-start mb-3">
                      <svg className="w-6 h-6 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-2">Need Personal Consultation?</h3>
                        <p className="text-xs sm:text-sm text-orange-50 leading-relaxed">
                          Get personalized astrology guidance from our expert astrologer.
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/contact"
                      className="block w-full text-center bg-white text-orange-600 px-4 py-2.5 sm:py-3 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:shadow-md transition-all transform hover:-translate-y-0.5"
                    >
                      Book Consultation Now
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;