import React from 'react';
import { 
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';

// Alignment buttons configuration
const alignmentButtons = [
  {
    icon: AlignLeft,
    title: 'Align Left',
    command: 'justifyLeft'
  },
  {
    icon: AlignCenter,
    title: 'Align Center',
    command: 'justifyCenter'
  },
  {
    icon: AlignRight,
    title: 'Align Right',
    command: 'justifyRight'
  },
  {
    icon: AlignJustify,
    title: 'Justify',
    command: 'justifyFull'
  }
];

// Alignment Tools Component
const AlignmentTools = ({ activeFormats, executeCommand, disabled }) => {
  return (
    <div className="flex items-center gap-1">
      {alignmentButtons.map((button, index) => {
        const IconComponent = button.icon;
        const isActive = activeFormats[button.command];
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => executeCommand(button.command)}
            title={button.title}
            className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              isActive 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white border-transparent hover:border-gray-300'
            }`}
            disabled={disabled}
          >
            <IconComponent size={16} />
          </button>
        );
      })}
    </div>
  );
};

export default AlignmentTools;