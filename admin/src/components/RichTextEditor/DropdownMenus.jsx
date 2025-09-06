import React from 'react';
import { Type, Languages, List } from 'lucide-react';

// Heading Dropdown Component
export const HeadingDropdown = ({ 
  showHeadingDropdown, 
  setShowHeadingDropdown, 
  insertHeading, 
  executeCommand, 
  disabled 
}) => (
  <div className="relative heading-dropdown-container">
    <button
      type="button"
      onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
      disabled={disabled}
    >
      <Type size={16} className="mr-2" />
      Paragraph
      <svg className={`ml-auto w-4 h-4 transition-transform ${showHeadingDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
    
    {showHeadingDropdown && (
      <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-20">
        <div className="py-2">
          <button
            type="button"
            onClick={() => {
              executeCommand('formatBlock', 'div');
              setShowHeadingDropdown(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            disabled={disabled}
          >
            <span className="text-base">Paragraph</span>
          </button>
          {[1, 2, 3, 4, 5, 6].map(level => (
            <button
              key={level}
              type="button"
              onClick={() => insertHeading(level)}
              className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${
                level === 1 ? 'text-2xl font-bold' :
                level === 2 ? 'text-xl font-bold' :
                level === 3 ? 'text-lg font-semibold' :
                level === 4 ? 'text-base font-semibold' :
                level === 5 ? 'text-sm font-semibold' :
                'text-xs font-semibold'
              }`}
              disabled={disabled}
            >
              Heading {level}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Font Selection Dropdown Component
export const FontDropdown = ({ 
  showFontDropdown, 
  setShowFontDropdown, 
  currentFont, 
  changeFontFamily, 
  disabled 
}) => (
  <div className="relative font-dropdown-container">
    <button
      type="button"
      onClick={() => setShowFontDropdown(!showFontDropdown)}
      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
      disabled={disabled}
    >
      <Languages size={16} className="mr-2" />
      {
        currentFont === 'font-english' ? 'English' :
        currentFont === 'font-hindi-noto' ? 'नोटो हिन्दी' :
        currentFont === 'font-hindi-mangal' ? 'मंगल हिन्दी' :
        currentFont === 'font-mixed' ? 'मिश्रित' : 'Font'
      }
      <svg className={`ml-auto w-4 h-4 transition-transform ${showFontDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
    
    {showFontDropdown && (
      <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-300 rounded-md shadow-lg z-20">
        <div className="py-2">
          <button
            type="button"
            onClick={() => changeFontFamily('font-english')}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 font-english ${
              currentFont === 'font-english' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
            }`}
            disabled={disabled}
          >
            <span className="font-medium">English Font</span>
            <div className="text-xs text-gray-500 mt-1">For English content</div>
          </button>
          
          <button
            type="button"
            onClick={() => changeFontFamily('font-hindi-noto')}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 font-hindi-noto ${
              currentFont === 'font-hindi-noto' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
            }`}
            disabled={disabled}
          >
            <span className="font-medium">नोटो हिन्दी</span>
            <div className="text-xs text-gray-500 mt-1">हिन्दी सामग्री के लिए (Noto Sans)</div>
          </button>
          
          <button
            type="button"
            onClick={() => changeFontFamily('font-hindi-mangal')}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 font-hindi-mangal ${
              currentFont === 'font-hindi-mangal' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
            }`}
            disabled={disabled}
          >
            <span className="font-medium">मंगल हिन्दी</span>
            <div className="text-xs text-gray-500 mt-1">हिन्दी सामग्री के लिए (Mangal)</div>
          </button>
          
          <button
            type="button"
            onClick={() => changeFontFamily('font-mixed')}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 font-mixed ${
              currentFont === 'font-mixed' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
            }`}
            disabled={disabled}
          >
            <span className="font-medium">मिश्रित / Mixed</span>
            <div className="text-xs text-gray-500 mt-1">For Hindi + English content</div>
          </button>
        </div>
      </div>
    )}
  </div>
);

// Lists Dropdown Component
export const ListsDropdown = ({ 
  showListDropdown, 
  setShowListDropdown, 
  insertPlainList, 
  insertBulletList, 
  insertNumberedList, 
  disabled 
}) => (
  <div className="relative list-dropdown-container">
    <button
      type="button"
      onClick={() => setShowListDropdown(!showListDropdown)}
      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[100px]"
      disabled={disabled}
    >
      <List size={16} className="mr-2" />
      Lists
      <svg className={`ml-auto w-4 h-4 transition-transform ${showListDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
    
    {showListDropdown && (
      <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-20">
        <div className="py-2">
          <button
            type="button"
            onClick={insertPlainList}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            disabled={disabled}
          >
            <div className="mr-3">
              <div className="w-2 h-2 bg-transparent border border-gray-400 rounded-full"></div>
            </div>
            Plain List
          </button>
          <button
            type="button"
            onClick={insertBulletList}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            disabled={disabled}
          >
            <div className="mr-3">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>
            Bullet List
          </button>
          <button
            type="button"
            onClick={insertNumberedList}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            disabled={disabled}
          >
            <div className="mr-3 text-xs font-semibold text-gray-600">
              1.
            </div>
            Numbered List
          </button>
        </div>
      </div>
    )}
  </div>
);