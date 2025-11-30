import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import BlogForm from './BlogForm';

const AddBlogModal = ({ showModal, onClose, onSuccess }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.astrosatyaprakash.com';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: 'Astro Satya Admin',
    category: 'general',
    tags: '',
    status: 'draft',
    featuredImage: '',
    featuredImageAlt: '',
    metaTitle: '',
    metaDescription: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: 'Astro Satya Admin',
      category: 'general',
      tags: '',
      status: 'draft',
      featuredImage: '',
      featuredImageAlt: '',
      metaTitle: '',
      metaDescription: '',
    });
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

      const response = await axios.post(
        `${BACKEND_URL}/api/blogs`,
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
        toast.success('Blog created successfully!');
        resetForm();
        onSuccess();
      } else {
        throw new Error(response.data.message || 'Failed to create blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);

      // Extract the exact error message from backend
      let errorMessage = 'Failed to create blog';

      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        errorMessage = errorData.error || errorData.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Error in setting up request
        errorMessage = error.message || 'Failed to create blog';
      }

      toast.error(`Error creating blog: ${errorMessage}`);
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

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Add New Blog Post</h2>
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
          <BlogForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            mode="add"
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default AddBlogModal;