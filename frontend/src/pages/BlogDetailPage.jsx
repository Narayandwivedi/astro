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

  const formatShortDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <div className="px-3 py-6 sm:px-6 sm:py-10">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-40 mb-6" />
              <div className="aspect-[16/9] bg-gray-200 rounded-2xl mb-6" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-100">
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
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <main className="flex-1 px-3 py-6 sm:px-6 sm:py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_360px] gap-8 items-start">

            {/* ── Left: Article Card ─────────────────────────────── */}
            <article className="bg-white rounded-2xl shadow-sm overflow-hidden text-left">
              {blog.featuredImage && (
                <div className="px-5 sm:px-8 pt-5 sm:pt-8">
                  <img
                    src={getImageUrl(blog.featuredImage)}
                    alt={blog.featuredImageAlt || blog.title}
                    className="w-full aspect-[16/9] object-cover rounded-2xl"
                    fetchpriority="high"
                    width="1200"
                    height="675"
                    decoding="async"
                  />
                </div>
              )}

              <div className="p-5 sm:p-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4">
                  <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
                  <span>/</span>
                  <Link to="/blogs" className="hover:text-orange-600 transition-colors">Blog</Link>
                  <span>/</span>
                  <span className="text-gray-800 font-medium truncate max-w-[180px] sm:max-w-xs">{blog.title}</span>
                </nav>

                {/* Category badge + share */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span className="inline-flex items-center rounded-full bg-red-50 text-red-700 px-3 py-1 text-xs font-semibold capitalize">
                    {blog.category}
                  </span>
                  <ShareButton
                    url={window.location.href}
                    title={blog.title}
                    description={blog.excerpt}
                  />
                </div>

                {/* Meta row */}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                  <time dateTime={blog.publishedAt || blog.createdAt}>{formatDate(blog.publishedAt || blog.createdAt)}</time>
                  {blog.author ? <span>By {blog.author}</span> : null}
                  <span>{blog.readTime || estimateReadTime(blog.content)} min read</span>
                  <span>{blog.views || 0} views</span>
                </div>

                {/* Title */}
                <h1 className="mt-4 text-xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
                  {blog.title}
                </h1>
              </div>

              <div className="px-5 sm:px-8 pb-8">
                {/* Content */}
                <div
                  className="prose prose-sm sm:prose-base max-w-none
                    prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-3 prose-headings:mt-6
                    prose-h2:text-lg sm:prose-h2:text-xl
                    prose-h3:text-base sm:prose-h3:text-lg
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-a:text-orange-600 prose-a:no-underline hover:prose-a:text-orange-700 hover:prose-a:underline
                    prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5
                    prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-5
                    prose-li:text-gray-700 prose-li:mb-1.5
                    prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                    prose-img:rounded-lg prose-img:shadow-md prose-img:my-4"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-8 mb-6 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 mr-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Tags:
                    </span>
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>

            {/* ── Right: Blog List Sidebar ────────────────────────── */}
            <aside className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 xl:sticky xl:top-24">
              <div className="mb-5 pb-3 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Latest Blogs</h2>
              </div>

              {relatedBlogs.length === 0 ? (
                <p className="text-sm text-gray-500">No related blogs found.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {relatedBlogs.map((item) => (
                    <Link
                      key={item._id}
                      to={`/blog/${item.slug}`}
                      className="group no-underline flex items-start gap-3 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="w-24 h-[72px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.featuredImage ? (
                          <img
                            src={getImageUrl(item.featuredImage)}
                            alt={item.featuredImageAlt || item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            width="96"
                            height="72"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">📖</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1">
                          <span className="font-semibold uppercase tracking-wide text-red-600">{item.category}</span>
                          <time dateTime={item.createdAt}>{formatShortDate(item.createdAt)}</time>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                          {item.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="mt-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl">
                <h3 className="text-sm font-semibold mb-2">Need Personal Consultation?</h3>
                <p className="text-xs text-orange-50 mb-3 leading-relaxed">Get personalized astrology guidance from our expert.</p>
                <Link to="/contact" className="block w-full text-center bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all">
                  Book Consultation
                </Link>
              </div>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogDetailPage;