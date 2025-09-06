import React, { useState } from 'react';
import BlogForm from './BlogForm';
import { useApi } from '../../context/ApiContext';

const AddBlogModal = ({ showModal, onClose, onSuccess }) => {
  const api = useApi();
  const BACKEND_URL = api.baseURL;
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

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.title.trim()) {
        alert('Title is required');
        return;
      }

      if (!formData.content.trim() || formData.content.replace(/<[^>]*>/g, '').length < 50) {
        alert('Content must be at least 50 characters long');
        return;
      }

      if (!formData.excerpt.trim()) {
        alert('Excerpt is required');
        return;
      }

      setIsSubmitting(true);

      const response = await fetch(api.endpoints.blogs, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create blog');
      }

      const data = await response.json();

      if (data.success) {
        alert('Blog created successfully!');
        resetForm();
        onSuccess();
      } else {
        throw new Error(data.message || 'Failed to create blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert(error.message || 'Failed to create blog');
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