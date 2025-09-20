import React, { useCallback, useState } from 'react';
import RichTextEditor from '../../components/RichTextEditor';
import BlogContentPreview from '../../components/BlogContentPreview';

const BLOG_CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'astrology', label: 'Astrology' },
  { value: 'spirituality', label: 'Spirituality' },
  { value: 'wellness', label: 'Wellness' },
];

const BLOG_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const BlogForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  mode = 'add',
  isSubmitting = false,
}) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.astrosatyaprakash.com';

  const getImageURL = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${BACKEND_URL}/${cleanPath}`;
  };
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, [setFormData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      formDataUpload.append('category', 'blog');

      const response = await fetch(`${BACKEND_URL}/api/upload/image`, {
        method: 'POST',
        body: formDataUpload,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();

      if (data.success) {
        const imageUrl = data.imagePath;
        setImagePreview(getImageURL(imageUrl));
        handleInputChange('featuredImage', imageUrl);
        alert('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle image deletion
  const handleDeleteImage = async () => {
    if (!window.confirm('Are you sure you want to remove this featured image?')) {
      return;
    }

    setIsDeletingImage(true);
    
    try {
      // Clear the form data and preview
      setImagePreview(null);
      handleInputChange('featuredImage', '');
      alert('Image removed successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      // Still remove from form even if server deletion fails
      setImagePreview(null);
      handleInputChange('featuredImage', '');
      alert('Image removed from form');
    } finally {
      setIsDeletingImage(false);
    }
  };

  // Get image source for display
  const getImageSource = () => {
    if (imagePreview) return imagePreview;
    if (formData.featuredImage) {
      // Check if it's already a full URL or needs backend URL prefix
      if (formData.featuredImage.startsWith('http')) {
        return formData.featuredImage;
      } else {
        return getImageURL(formData.featuredImage);
      }
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border">
        <h2 className="text-lg font-semibold text-gray-900">
          {mode === 'add' ? 'Create New Blog Post' : 'Edit Blog Post'}
        </h2>
      </div>

      {/* Main Layout: 80% Left, 20% Right */}
      <div className="flex gap-6">
        {/* Left Side - 80% - Title and Content */}
        <div className="w-4/5 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter blog title"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content * (Min 50 characters)
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => handleInputChange('content', content)}
              placeholder="Write your blog content here..."
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 mt-1">
              Content length: {formData.content.replace(/<[^>]*>/g, '').length} characters (minimum 50 required)
            </div>
            
            {/* Content Preview */}
            <BlogContentPreview content={formData.content} title={formData.title} />
          </div>
        </div>

        {/* Right Side - 20% - Metadata */}
        <div className="w-1/5 space-y-6">
          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt * (Max 200 characters)
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              rows={4}
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              placeholder="Brief description of the blog post"
              required
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.excerpt.length}/200
            </div>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              placeholder="Author name"
              disabled={isSubmitting}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              disabled={isSubmitting}
            >
              {BLOG_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <textarea
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              placeholder="astrology, spirituality, wellness"
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 mt-1">
              Comma separated
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              disabled={isSubmitting}
            >
              {BLOG_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Featured Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Featured Image
        </label>
        <div className="space-y-4">
          {/* Image Upload/Preview Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {getImageSource() ? (
              <div className="relative inline-block">
                <img
                  src={getImageSource()}
                  alt="Featured image preview"
                  className="max-w-full h-56 object-cover rounded-lg border border-gray-200"
                  style={{ aspectRatio: '16/9' }}
                />
                {mode === 'edit' && formData.featuredImage && !imagePreview && (
                  <div className="absolute top-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded">
                    Current Image
                  </div>
                )}
                <div className="mt-3 flex gap-2 justify-center">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors">
                    {isUploadingImage ? 'Uploading...' : 'Change Image'}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isSubmitting || isUploadingImage}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    disabled={isSubmitting || isDeletingImage}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isDeletingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                        Deleting...
                      </>
                    ) : (
                      'Remove Image'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8">
                <div className="text-6xl mb-4">📷</div>
                <div className="mt-4">
                  <label className="cursor-pointer inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
                    {isUploadingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      'Upload Featured Image'
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isSubmitting || isUploadingImage}
                    />
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  PNG, JPG, WebP up to 5MB (Recommended: 1200x675px for SEO)
                </p>
              </div>
            )}
          </div>

          {/* Manual URL Input (Optional) */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Or enter image URL manually (optional)
            </label>
            <input
              type="url"
              value={formData.featuredImage}
              onChange={(e) => {
                handleInputChange('featuredImage', e.target.value);
                setImagePreview(null); // Clear preview to use the URL
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-500">
              This will override any uploaded image
            </p>
          </div>

          {/* Image Alt Tag */}
          {(formData.featuredImage || getImageSource()) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Alt Text (for SEO and accessibility)
              </label>
              <input
                type="text"
                value={formData.featuredImageAlt || ''}
                onChange={(e) => handleInputChange('featuredImageAlt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Describe what's in the image (e.g., Astrologer reading birth chart)"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500">
                This text will be displayed if the image fails to load and helps with SEO and accessibility
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SEO Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title (Max 60 characters)
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => handleInputChange('metaTitle', e.target.value)}
              maxLength={60}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="SEO title (will use blog title if empty)"
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.metaTitle.length}/60 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description (Max 160 characters)
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              rows={3}
              maxLength={160}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="SEO description (will use excerpt if empty)"
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.metaDescription.length}/160 characters
            </div>
          </div>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`flex-1 text-white py-3 rounded-lg transition disabled:opacity-50 ${
            mode === 'add'
              ? 'bg-orange-600 hover:bg-orange-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? 'Processing...' 
            : mode === 'add' 
              ? 'Create Blog' 
              : 'Update Blog'
          }
        </button>
      </div>
    </form>
  );
};

export default BlogForm;