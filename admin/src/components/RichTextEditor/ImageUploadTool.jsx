import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Image } from 'lucide-react';

const ImageUploadTool = ({ BACKEND_URL, executeCommand, disabled }) => {
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Helper function to get full image URL
  const getImageURL = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${BACKEND_URL}/${cleanPath}`;
  };

  // Image upload from computer
  const uploadImageFromComputer = async (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', 'blog');

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/upload/blog/image`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to upload image');
      }

      const { imagePath } = response.data;
      const fullImageUrl = imagePath.startsWith('http') ? imagePath : getImageURL(imagePath);

      insertImageHTML(fullImageUrl, 'Uploaded image');
      toast.success('Image uploaded successfully');

    } catch (error) {
      console.error('Image upload error:', error);

      let errorMessage = 'Failed to upload image';
      if (error.response) {
        const errorData = error.response.data;
        errorMessage = errorData.error || errorData.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = error.message || 'Failed to upload image';
      }

      toast.error(`Error uploading image: ${errorMessage}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Insert image from URL
  const insertImageFromURL = (imageUrl) => {
    if (imageUrl && imageUrl !== 'https://') {
      insertImageHTML(imageUrl, 'Image');
    }
  };

  // Common function to insert image HTML
  const insertImageHTML = (src, alt) => {
    const img = `<div style="text-align: center; margin: 20px 0;">
      <img src="${src}" alt="${alt}" 
           style="width: 80%; max-width: 500px; height: auto; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: block;" />
    </div>`;
    executeCommand('insertHTML', img);
  };

  // Handle file input
  const handleFileInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        await uploadImageFromComputer(file);
      }
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  // Main insert image function
  const handleInsertImage = () => {
    if (disabled || isUploadingImage) return;
    
    const choice = confirm(
      'Do you want to upload an image from your computer?\n\n' +
      'Click "OK" to upload from computer\n' +
      'Click "Cancel" to enter image URL'
    );
    
    if (choice) {
      handleFileInput();
    } else {
      const imageUrl = prompt('Enter image URL:', 'https://');
      insertImageFromURL(imageUrl);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleInsertImage}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        disabled={disabled || isUploadingImage}
        title={isUploadingImage ? 'Uploading...' : 'Insert Image'}
      >
        <Image size={16} />
        {isUploadingImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </button>
    </div>
  );
};

export default ImageUploadTool;
