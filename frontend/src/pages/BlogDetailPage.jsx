import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

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
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-gray-400 text-6xl mb-4">🔮</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {error || 'Article not found'}
          </h1>
          <p className="text-gray-600 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog" className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <nav className="mb-8">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
                <span>/</span>
                <Link to="/blog" className="hover:text-yellow-400 transition-colors">Blog</Link>
                <span>/</span>
                <span className="text-white font-medium truncate max-w-xs lg:max-w-md">{blog.title}</span>
              </div>
            </nav>

            <div className="text-center lg:text-left">
              <div className="mb-6">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold capitalize shadow-sm ${getCategoryColor(blog.category)}`}>
                  {blog.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {blog.title}
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto lg:mx-0">
                {blog.excerpt}
              </p>
              
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {blog.author.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-white">By {blog.author}</div>
                    <div className="text-sm text-gray-300">Astrology Expert</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 lg:gap-6 text-center lg:text-left">
                  <div>
                    <div className="text-sm font-medium text-white">{formatDate(blog.publishedAt || blog.createdAt)}</div>
                    <div className="text-xs text-gray-300">Published</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{blog.readTime || estimateReadTime(blog.content)} min</div>
                    <div className="text-xs text-gray-300">Read time</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{blog.views || 0}</div>
                    <div className="text-xs text-gray-300">Views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="relative">
          <div className="w-full h-64 md:h-96 lg:h-[32rem] bg-gray-200 overflow-hidden">
            <img
              src={getImageUrl(blog.featuredImage)}
              alt={blog.featuredImageAlt || blog.title}
              className="w-full h-full object-cover"
              width="1200"
              height="675"
            />
          </div>
        </div>
      )}

      {/* Blog Content */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col xl:flex-row gap-12 lg:gap-16">
              <article className="xl:w-2/3">
                <div 
                  className="prose prose-lg lg:prose-xl max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-a:text-orange-600 hover:prose-a:text-orange-700"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                  style={{ lineHeight: '1.8' }}
                ></div>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-16 p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Topics Covered</h3>
                    <div className="flex flex-wrap gap-3">
                      {blog.tags.map((tag, index) => (
                        <span key={index} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-full border border-gray-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>

              <aside className="xl:w-1/3">
                <div className="sticky top-8 space-y-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Author</h3>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                        {blog.author.charAt(0)}
                      </div>
                      <h4 className="font-semibold text-gray-900">{blog.author}</h4>
                      <p className="text-sm text-gray-500">Astrology Expert</p>
                      <p className="text-xs text-gray-400 mt-2">25+ Years Experience</p>
                    </div>
                  </div>

                  {relatedBlogs.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Related Articles</h3>
                      <div className="space-y-4">
                        {relatedBlogs.map((relatedBlog) => (
                          <div key={relatedBlog._id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                            <Link to={`/blog/${relatedBlog.slug}`} className="block hover:text-orange-600 transition-colors">
                              <h4 className="font-medium text-sm leading-tight mb-2">{relatedBlog.title}</h4>
                              <p className="text-xs text-gray-500">{formatDate(relatedBlog.publishedAt || relatedBlog.createdAt)}</p>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Call to Action */}
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-3">Need Personal Consultation?</h3>
                    <p className="text-sm mb-4 text-orange-100">Get personalized astrology guidance from our expert astrologer.</p>
                    <Link 
                      to="/contact" 
                      className="inline-block bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Book Consultation
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