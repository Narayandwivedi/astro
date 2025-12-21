import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import BlogForm from './BlogForm';

const EditBlogModal = ({ showModal, blog, onClose, onSuccess }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.astrosatyaprakash.com';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  const [fullBlogData, setFullBlogData] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    category: 'general',
    tags: '',
    status: 'draft',
    featuredImage: '',
    featuredImageAlt: '',
    metaTitle: '',
    metaDescription: '',
  });

  // Fetch full blog data when modal opens
  useEffect(() => {
    const fetchFullBlog = async () => {
      if (blog && blog._id && showModal) {
        setIsLoadingBlog(true);
        try {
          const response = await axios.get(
            `${BACKEND_URL}/api/blogs/${blog._id}`,
            { withCredentials: true }
          );

          if (response.data.success) {
            setFullBlogData(response.data.blog);
          } else {
            toast.error('Failed to load blog data');
          }
        } catch (error) {
          console.error('Error fetching full blog:', error);
          toast.error('Failed to load blog data');
        } finally {
          setIsLoadingBlog(false);
        }
      }
    };

    fetchFullBlog();
  }, [blog, showModal, BACKEND_URL]);

  // Initialize form data when full blog data is loaded
  useEffect(() => {
    if (fullBlogData) {
      setFormData({
        title: fullBlogData.title || '',
        slug: fullBlogData.slug || '',
        content: fullBlogData.content || '',
        excerpt: fullBlogData.excerpt || '',
        author: fullBlogData.author || 'Astro Satya Admin',
        category: fullBlogData.category || 'general',
        tags: Array.isArray(fullBlogData.tags) ? fullBlogData.tags.join(', ') : (fullBlogData.tags || ''),
        status: fullBlogData.status || 'draft',
        featuredImage: fullBlogData.featuredImage || '',
        featuredImageAlt: fullBlogData.featuredImageAlt || '',
        metaTitle: fullBlogData.metaTitle || '',
        metaDescription: fullBlogData.metaDescription || '',
      });
    }
  }, [fullBlogData]);

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      author: '',
      category: 'general',
      tags: '',
      status: 'draft',
      featuredImage: '',
      featuredImageAlt: '',
      metaTitle: '',
      metaDescription: '',
    });
    setFullBlogData(null);
  };

  // Helper function to generate excerpt from content (max 180 words)
  const generateExcerpt = (content, maxWords = 180) => {
    // Strip HTML tags
    const plainText = content.replace(/<[^>]*>/g, '');
    // Remove extra whitespace
    const cleanText = plainText.replace(/\s+/g, ' ').trim();
    // Split into words
    const words = cleanText.split(' ');

    // Take first maxWords words
    if (words.length <= maxWords) {
      return cleanText;
    }

    // Join first maxWords words and add ellipsis
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const handleSubmit = async () => {
    try {
      // Ensure full blog data is loaded
      if (!fullBlogData || !fullBlogData._id) {
        toast.error('Blog data is still loading. Please wait.');
        return;
      }

      // Validation
      if (!formData.title.trim()) {
        toast.error('Title is required');
        return;
      }

      if (!formData.content.trim() || formData.content.replace(/<[^>]*>/g, '').length < 50) {
        toast.error('Content must be at least 50 characters long');
        return;
      }

      // Auto-generate excerpt if not provided
      let excerptToSend = formData.excerpt.trim();
      if (!excerptToSend) {
        excerptToSend = generateExcerpt(formData.content);
      }

      setIsSubmitting(true);

      const response = await axios.put(
        `${BACKEND_URL}/api/blogs/${fullBlogData._id}`,
        {
          ...formData,
          excerpt: excerptToSend,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.success) {
        toast.success('Blog updated successfully!');
        onSuccess();
      } else {
        throw new Error(response.data.message || 'Failed to update blog');
      }
    } catch (error) {
      console.error('Error updating blog:', error);

      // Extract the exact error message from backend
      let errorMessage = 'Failed to update blog';

      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        errorMessage = errorData.error || errorData.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Error in setting up request
        errorMessage = error.message || 'Failed to update blog';
      }

      toast.error(`Error updating blog: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      resetForm();
      onClose();
    }
  };

  if (!showModal || !blog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Edit Blog Post</h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {isLoadingBlog ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
              <p className="text-gray-600">Loading blog data...</p>
            </div>
          ) : (
            <BlogForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              mode="edit"
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditBlogModal;