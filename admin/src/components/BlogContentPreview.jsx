import React, { useState } from 'react';

const BlogContentPreview = ({ content, title }) => {
  const [showPreview, setShowPreview] = useState(false);

  if (!content || content.trim().length === 0) {
    return null;
  }

  return (
    <div className="mt-4 border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={() => setShowPreview(!showPreview)}
        className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200 font-medium text-gray-700"
      >
        {showPreview ? '▼' : '▶'} Preview Content
      </button>
      
      {showPreview && (
        <div className="p-4 bg-white">
          <div className="prose max-w-none">
            {title && (
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
            )}
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: content }}
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#374151'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogContentPreview;