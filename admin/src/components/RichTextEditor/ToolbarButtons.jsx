import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  Code,
  Superscript,
  Subscript,
  Undo,
  Redo,
  Link,
  Minus,
  Table,
  Youtube,
  Quote,
  RemoveFormatting,
  Globe
} from 'lucide-react';

// Format buttons configuration
export const formatButtons = [
  {
    icon: Bold,
    title: 'Bold',
    command: 'bold',
    shortcut: 'Ctrl+B'
  },
  {
    icon: Italic,
    title: 'Italic',
    command: 'italic',
    shortcut: 'Ctrl+I'
  },
  {
    icon: Underline,
    title: 'Underline',
    command: 'underline',
    shortcut: 'Ctrl+U'
  },
  {
    icon: Strikethrough,
    title: 'Strikethrough',
    command: 'strikeThrough'
  },
  {
    icon: Code,
    title: 'Code',
    command: 'formatBlock',
    value: 'pre'
  },
  {
    icon: Superscript,
    title: 'Superscript',
    command: 'superscript'
  },
  {
    icon: Subscript,
    title: 'Subscript',
    command: 'subscript'
  }
];

// Format Buttons Component
export const FormatButtons = ({ activeFormats, executeCommand, disabled }) => (
  <>
    {formatButtons.map((button, index) => {
      const IconComponent = button.icon;
      const isActive = activeFormats[button.command];
      return (
        <button
          key={index}
          type="button"
          onClick={() => executeCommand(button.command, button.value)}
          title={button.shortcut ? `${button.title} (${button.shortcut})` : button.title}
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
  </>
);

// History Buttons Component
export const HistoryButtons = ({ handleUndo, handleRedo, historyIndex, historyLength, disabled }) => {
  const historyButtons = [
    {
      icon: Undo,
      title: 'Undo',
      command: handleUndo,
      shortcut: 'Ctrl+Z',
      disabled: historyIndex <= 0
    },
    {
      icon: Redo,
      title: 'Redo',
      command: handleRedo,
      shortcut: 'Ctrl+Y',
      disabled: historyIndex >= historyLength - 1
    }
  ];

  return (
    <>
      {historyButtons.map((button, index) => {
        const IconComponent = button.icon;
        return (
          <button
            key={index}
            type="button"
            onClick={button.command}
            title={button.shortcut ? `${button.title} (${button.shortcut})` : button.title}
            className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              button.disabled
                ? 'opacity-50 cursor-not-allowed text-gray-400'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white border-transparent hover:border-gray-300'
            }`}
            disabled={disabled || button.disabled}
          >
            <IconComponent size={16} />
          </button>
        );
      })}
    </>
  );
};

// Insert Tools Buttons Component
export const InsertToolsButtons = ({ 
  insertLink, 
  executeCommand, 
  insertTable, 
  insertYouTubeVideo, 
  insertBlockQuote, 
  removeFormatting, 
  disabled 
}) => (
  <>
    <button
      type="button"
      onClick={insertLink}
      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      disabled={disabled}
      title="Insert Link"
    >
      <Link size={16} />
    </button>

    <button
      type="button"
      onClick={() => executeCommand('insertHorizontalRule')}
      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      disabled={disabled}
      title="Insert Horizontal Rule"
    >
      <Minus size={16} />
    </button>

    <button
      type="button"
      onClick={insertTable}
      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      disabled={disabled}
      title="Insert Table"
    >
      <Table size={16} />
    </button>

    <button
      type="button"
      onClick={insertYouTubeVideo}
      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      disabled={disabled}
      title="Insert YouTube Video"
    >
      <Youtube size={16} />
    </button>

    <button
      type="button"
      onClick={insertBlockQuote}
      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      disabled={disabled}
      title="Insert Quote"
    >
      <Quote size={16} />
    </button>

    <div className="w-px h-8 bg-gray-300 mx-1"></div>

    <button
      type="button"
      onClick={removeFormatting}
      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      disabled={disabled}
      title="Remove Formatting"
    >
      <RemoveFormatting size={16} />
    </button>
  </>
);

// Hindi Typing Toggle Button Component
export const HindiTypingButton = ({ isHindiTyping, toggleHindiTyping, disabled }) => (
  <button
    type="button"
    onClick={toggleHindiTyping}
    className={`p-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
      isHindiTyping 
        ? 'bg-green-600 text-white border-green-600 shadow-md' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-white border-transparent hover:border-gray-300'
    }`}
    disabled={disabled}
    title={`Hindi Typing: ${isHindiTyping ? 'ON' : 'OFF'} (Ctrl+H)`}
  >
    <Globe size={16} />
  </button>
);