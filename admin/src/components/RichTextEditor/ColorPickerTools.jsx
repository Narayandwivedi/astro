import React, { useState } from 'react';
import { Palette, Highlighter } from 'lucide-react';
import { AdvancedColorPicker, colorPalette } from './ColorPicker';

// Text Color Picker Component
const TextColorPicker = ({ 
  showColorPicker, 
  setShowColorPicker, 
  currentColor, 
  setCurrentColor,
  changeTextColor,
  colorPickerMode,
  setColorPickerMode,
  disabled 
}) => (
  <div className="relative color-picker-container">
    <button
      type="button"
      onClick={() => setShowColorPicker(!showColorPicker)}
      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      disabled={disabled}
      title="Text Color"
    >
      <Palette size={16} />
    </button>
    
    {showColorPicker && (
      <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20">
        {colorPickerMode === 'palette' ? (
          <div className="w-64 p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs font-medium text-gray-700">Text Color</div>
              <button
                onClick={() => setColorPickerMode('advanced')}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Advanced
              </button>
            </div>
            <div className="grid grid-cols-6 gap-1 mb-3">
              {colorPalette.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => changeTextColor(color)}
                  className="w-8 h-8 rounded border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:scale-110"
                  style={{ backgroundColor: color }}
                  title={color}
                  disabled={disabled}
                />
              ))}
            </div>
            
            <div className="border-t pt-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Quick Pick</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => changeTextColor(e.target.value)}
                  className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                  disabled={disabled}
                />
                <input
                  type="text"
                  value={currentColor}
                  onChange={(e) => {
                    const hex = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
                      setCurrentColor(hex);
                      if (hex.length === 7) {
                        changeTextColor(hex);
                      }
                    }
                  }}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="#000000"
                  disabled={disabled}
                />
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setShowColorPicker(false)}
              className="mt-2 w-full px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <AdvancedColorPicker
            color={currentColor}
            onChange={changeTextColor}
            onClose={() => {
              setColorPickerMode('palette');
              setShowColorPicker(false);
            }}
            title="Advanced Text Color"
          />
        )}
      </div>
    )}
  </div>
);

// Background Color Picker Component
const BackgroundColorPicker = ({ 
  showBgColorPicker, 
  setShowBgColorPicker, 
  currentBgColor, 
  setCurrentBgColor,
  changeBackgroundColor,
  bgColorPickerMode,
  setBgColorPickerMode,
  disabled 
}) => (
  <div className="relative color-picker-container">
    <button
      type="button"
      onClick={() => setShowBgColorPicker(!showBgColorPicker)}
      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      disabled={disabled}
      title="Background/Highlight Color"
    >
      <Highlighter size={16} />
    </button>
    
    {showBgColorPicker && (
      <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20">
        {bgColorPickerMode === 'palette' ? (
          <div className="w-64 p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs font-medium text-gray-700">Background Color</div>
              <button
                onClick={() => setBgColorPickerMode('advanced')}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Advanced
              </button>
            </div>
            <div className="grid grid-cols-6 gap-1 mb-3">
              {colorPalette.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => changeBackgroundColor(color)}
                  className="w-8 h-8 rounded border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:scale-110"
                  style={{ backgroundColor: color }}
                  title={color}
                  disabled={disabled}
                />
              ))}
            </div>
            
            <div className="border-t pt-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Quick Pick</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentBgColor}
                  onChange={(e) => changeBackgroundColor(e.target.value)}
                  className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                  disabled={disabled}
                />
                <input
                  type="text"
                  value={currentBgColor}
                  onChange={(e) => {
                    const hex = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(hex)) {
                      setCurrentBgColor(hex);
                      if (hex.length === 7) {
                        changeBackgroundColor(hex);
                      }
                    }
                  }}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="#FFFF00"
                  disabled={disabled}
                />
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setShowBgColorPicker(false)}
              className="mt-2 w-full px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <AdvancedColorPicker
            color={currentBgColor}
            onChange={changeBackgroundColor}
            onClose={() => {
              setBgColorPickerMode('palette');
              setShowBgColorPicker(false);
            }}
            title="Advanced Background Color"
          />
        )}
      </div>
    )}
  </div>
);

// Combined Color Picker Tools Component
const ColorPickerTools = ({ 
  showColorPicker, 
  setShowColorPicker,
  showBgColorPicker, 
  setShowBgColorPicker,
  currentColor, 
  setCurrentColor,
  currentBgColor, 
  setCurrentBgColor,
  changeTextColor,
  changeBackgroundColor,
  colorPickerMode,
  setColorPickerMode,
  bgColorPickerMode,
  setBgColorPickerMode,
  disabled 
}) => {
  // Close other color picker when one opens
  const handleTextColorClick = () => {
    setShowColorPicker(!showColorPicker);
    setShowBgColorPicker(false);
  };

  const handleBgColorClick = () => {
    setShowBgColorPicker(!showBgColorPicker);
    setShowColorPicker(false);
  };

  return (
    <div className="flex items-center gap-1">
      <TextColorPicker
        showColorPicker={showColorPicker}
        setShowColorPicker={handleTextColorClick}
        currentColor={currentColor}
        setCurrentColor={setCurrentColor}
        changeTextColor={changeTextColor}
        colorPickerMode={colorPickerMode}
        setColorPickerMode={setColorPickerMode}
        disabled={disabled}
      />
      
      <BackgroundColorPicker
        showBgColorPicker={showBgColorPicker}
        setShowBgColorPicker={handleBgColorClick}
        currentBgColor={currentBgColor}
        setCurrentBgColor={setCurrentBgColor}
        changeBackgroundColor={changeBackgroundColor}
        bgColorPickerMode={bgColorPickerMode}
        setBgColorPickerMode={setBgColorPickerMode}
        disabled={disabled}
      />
    </div>
  );
};

export default ColorPickerTools;