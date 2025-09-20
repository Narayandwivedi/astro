import React, { useRef, useCallback, useEffect, useState } from 'react';
import { hindiTransliterator } from './HindiTransliterator';
import { 
  FormatButtons, 
  HistoryButtons, 
  InsertToolsButtons, 
  HindiTypingButton 
} from './ToolbarButtons';
import { 
  HeadingDropdown, 
  FontDropdown, 
  ListsDropdown 
} from './DropdownMenus';
import AlignmentTools from './AlignmentTools';
import ColorPickerTools from './ColorPickerTools';
import ImageUploadTool from './ImageUploadTool';

const RichTextEditor = ({ value, onChange, placeholder = "Start writing...", disabled = false }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.astrosatyaprakash.com';
  const editorRef = useRef(null);
  
  // State management
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentBgColor, setCurrentBgColor] = useState('#FFFF00');
  const [colorPickerMode, setColorPickerMode] = useState('palette');
  const [bgColorPickerMode, setBgColorPickerMode] = useState('palette');
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [showListDropdown, setShowListDropdown] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [currentFont, setCurrentFont] = useState('font-english');
  const [isHindiTyping, setIsHindiTyping] = useState(false);
  
  // Track active formatting states
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    superscript: false,
    subscript: false
  });
  
  // Undo/Redo state management
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isUpdatingFromHistory, setIsUpdatingFromHistory] = useState(false);
  const historyTimerRef = useRef(null);

  // Initialize editor with content
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.color-picker-container')) {
        setShowColorPicker(false);
        setShowBgColorPicker(false);
      }
      if (!event.target.closest('.heading-dropdown-container')) {
        setShowHeadingDropdown(false);
      }
      if (!event.target.closest('.list-dropdown-container')) {
        setShowListDropdown(false);
      }
      if (!event.target.closest('.font-dropdown-container')) {
        setShowFontDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Save to history with debouncing
  const saveToHistory = useCallback((content) => {
    if (isUpdatingFromHistory) return;
    
    if (historyTimerRef.current) {
      clearTimeout(historyTimerRef.current);
    }
    
    historyTimerRef.current = setTimeout(() => {
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        if (newHistory.length > 0 && newHistory[newHistory.length - 1] === content) {
          return prev;
        }
        newHistory.push(content);
        if (newHistory.length > 50) {
          newHistory.shift();
          setHistoryIndex(prev => prev - 1);
          return newHistory;
        }
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
    }, 500);
  }, [historyIndex, isUpdatingFromHistory]);

  // Check active formatting states
  const checkActiveFormats = useCallback(() => {
    if (!editorRef.current || disabled) return;
    
    try {
      const newActiveFormats = {
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikethrough: document.queryCommandState('strikethrough'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
        justifyFull: document.queryCommandState('justifyFull'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
        superscript: document.queryCommandState('superscript'),
        subscript: document.queryCommandState('subscript')
      };
      
      setActiveFormats(newActiveFormats);
    } catch (error) {
      console.warn('Error checking format states:', error);
    }
  }, [disabled]);

  // Handle content change
  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      saveToHistory(content);
      checkActiveFormats();
    }
  }, [onChange, saveToHistory, checkActiveFormats]);

  // Initialize history with initial value
  useEffect(() => {
    if (value && history.length === 0) {
      setHistory([value]);
      setHistoryIndex(0);
    }
  }, [value, history.length]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setIsUpdatingFromHistory(true);
      const prevContent = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      
      if (editorRef.current) {
        editorRef.current.innerHTML = prevContent;
        onChange(prevContent);
        editorRef.current.focus();
      }
      
      setTimeout(() => setIsUpdatingFromHistory(false), 100);
    }
  }, [history, historyIndex, onChange]);

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setIsUpdatingFromHistory(true);
      const nextContent = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      
      if (editorRef.current) {
        editorRef.current.innerHTML = nextContent;
        onChange(nextContent);
        editorRef.current.focus();
      }
      
      setTimeout(() => setIsUpdatingFromHistory(false), 100);
    }
  }, [history, historyIndex, onChange]);

  // Execute formatting command
  const executeCommand = useCallback((command, value = null) => {
    if (disabled) return;
    
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    
    setTimeout(checkActiveFormats, 10);
    
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      if (!isUpdatingFromHistory) {
        setHistory(prev => {
          const newHistory = prev.slice(0, historyIndex + 1);
          if (newHistory.length > 0 && newHistory[newHistory.length - 1] === content) {
            return prev;
          }
          newHistory.push(content);
          if (newHistory.length > 50) {
            newHistory.shift();
            setHistoryIndex(prev => prev - 1);
            return newHistory;
          }
          setHistoryIndex(newHistory.length - 1);
          return newHistory;
        });
      }
    }
  }, [disabled, onChange, historyIndex, isUpdatingFromHistory, checkActiveFormats]);

  // Handle selection changes to update active format states
  useEffect(() => {
    const handleSelectionChange = () => {
      if (isEditorFocused) {
        checkActiveFormats();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [isEditorFocused, checkActiveFormats]);

  // Keyboard shortcuts and Hindi transliteration
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isEditorFocused) return;
      
      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      
      // Ctrl+Y or Ctrl+Shift+Z for redo
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
        e.preventDefault();
        handleRedo();
      }
      
      // Other useful shortcuts
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        executeCommand('bold');
      }
      
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        executeCommand('italic');
      }
      
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        executeCommand('underline');
      }

      // Handle Hindi transliteration on spacebar
      if (isHindiTyping && e.key === ' ') {
        e.preventDefault();
        
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const textNode = range.startContainer;
          
          if (textNode.nodeType === Node.TEXT_NODE) {
            const text = textNode.textContent;
            const words = text.split(' ');
            const lastWord = words[words.length - 1];
            
            // Use the Hindi transliterator
            const transliteratedWord = hindiTransliterator.transliterate(lastWord);
            
            if (transliteratedWord !== lastWord) {
              words[words.length - 1] = transliteratedWord;
              textNode.textContent = words.join(' ');
              
              // Position cursor after the transliterated word
              const newRange = document.createRange();
              newRange.setStart(textNode, textNode.textContent.length);
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }
          }
        }
        
        // Insert space
        executeCommand('insertText', ' ');
        
        // Update content
        if (editorRef.current) {
          const content = editorRef.current.innerHTML;
          onChange(content);
          saveToHistory(content);
        }
      }

      // Ctrl+H for Hindi typing toggle
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        setIsHindiTyping(!isHindiTyping);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (historyTimerRef.current) {
        clearTimeout(historyTimerRef.current);
      }
    };
  }, [isEditorFocused, handleUndo, handleRedo, executeCommand, isHindiTyping, onChange, saveToHistory]);

  // Font functions
  const changeFontFamily = useCallback((fontClass) => {
    setCurrentFont(fontClass);
    if (editorRef.current) {
      editorRef.current.classList.remove('font-english', 'font-hindi-noto', 'font-hindi-mangal', 'font-mixed');
      editorRef.current.classList.add(fontClass);
    }
    if (fontClass.includes('hindi') || fontClass === 'font-mixed') {
      setIsHindiTyping(true);
    } else {
      setIsHindiTyping(false);
    }
    setShowFontDropdown(false);
  }, []);

  // Toggle Hindi typing mode
  const toggleHindiTyping = useCallback(() => {
    setIsHindiTyping(!isHindiTyping);
  }, [isHindiTyping]);

  // Insert heading
  const insertHeading = useCallback((level) => {
    if (disabled) return;
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      if (selectedText) {
        executeCommand('formatBlock', `h${level}`);
      } else {
        const headingHtml = `<h${level}>Heading ${level}</h${level}>`;
        executeCommand('insertHTML', headingHtml);
        
        setTimeout(() => {
          const headings = editorRef.current.querySelectorAll(`h${level}`);
          const lastHeading = headings[headings.length - 1];
          if (lastHeading && lastHeading.textContent === `Heading ${level}`) {
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(lastHeading);
            selection.removeAllRanges();
            selection.addRange(range);
            editorRef.current.focus();
          }
        }, 10);
      }
    }
    
    setShowHeadingDropdown(false);
  }, [disabled, executeCommand]);

  // Insert link
  const insertLink = useCallback(() => {
    if (disabled) return;
    
    const selection = window.getSelection();
    const selectedText = selection.toString();
    
    const url = prompt('Enter URL:', 'https://');
    if (url && url !== 'https://') {
      if (selectedText) {
        executeCommand('createLink', url);
      } else {
        const linkText = prompt('Enter link text:', url);
        if (linkText) {
          const link = `<a href="${url}" target="_blank">${linkText}</a>`;
          executeCommand('insertHTML', link);
        }
      }
    }
  }, [disabled, executeCommand]);

  // Color functions
  const changeTextColor = useCallback((color) => {
    setCurrentColor(color);
    executeCommand('foreColor', color);
  }, [executeCommand]);

  const changeBackgroundColor = useCallback((color) => {
    setCurrentBgColor(color);
    executeCommand('hiliteColor', color);
  }, [executeCommand]);

  // List functions
  const insertPlainList = useCallback(() => {
    executeCommand('insertUnorderedList');
    
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let node = selection.anchorNode;
        while (node && node.nodeName !== 'UL') {
          node = node.parentNode;
          if (node === editorRef.current) break;
        }
        if (node && node.nodeName === 'UL') {
          node.classList.add('plain-list');
        }
      }
    }, 10);
    
    setShowListDropdown(false);
  }, [executeCommand]);

  const insertBulletList = useCallback(() => {
    executeCommand('insertUnorderedList');
    setShowListDropdown(false);
  }, [executeCommand]);

  const insertNumberedList = useCallback(() => {
    executeCommand('insertOrderedList');
    setShowListDropdown(false);
  }, [executeCommand]);

  // Advanced formatting functions
  const insertTable = useCallback(() => {
    const rows = prompt('Enter number of rows:', '3');
    const cols = prompt('Enter number of columns:', '3');
    if (rows && cols) {
      let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 20px 0;">';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="border: 1px solid #ccc; padding: 8px; min-width: 100px;">&nbsp;</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table>';
      executeCommand('insertHTML', tableHTML);
    }
  }, [executeCommand]);

  const insertYouTubeVideo = useCallback(() => {
    const url = prompt('Enter YouTube URL or embed code:');
    if (url) {
      let embedCode;
      const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
      if (videoIdMatch) {
        const videoId = videoIdMatch[1];
        embedCode = `<div style="width: 320px; height: 180px; margin: 20px auto; max-width: 100%; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.15); background: #000;">
          <iframe src="https://www.youtube.com/embed/${videoId}" 
                  style="width: 100%; height: 100%; border: 0; display: block;" 
                  allowfullscreen></iframe>
        </div>`;
      } else if (url.includes('iframe')) {
        embedCode = `<div style="margin: 20px 0;">${url}</div>`;
      } else {
        alert('Please enter a valid YouTube URL or embed code');
        return;
      }
      executeCommand('insertHTML', embedCode);
    }
  }, [executeCommand]);

  const insertBlockQuote = useCallback(() => {
    const quoteHTML = '<blockquote style="border-left: 4px solid #e5e7eb; margin: 20px 0; padding: 10px 20px; background-color: #f9fafb; font-style: italic;">Quote text here...</blockquote>';
    executeCommand('insertHTML', quoteHTML);
  }, [executeCommand]);

  const removeFormatting = useCallback(() => {
    executeCommand('removeFormat');
    executeCommand('unlink');
  }, [executeCommand]);

  return (
    <div className={`border border-gray-300 rounded-md ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-3 flex flex-wrap gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          
          {/* Heading Dropdown */}
          <HeadingDropdown 
            showHeadingDropdown={showHeadingDropdown}
            setShowHeadingDropdown={setShowHeadingDropdown}
            insertHeading={insertHeading}
            executeCommand={executeCommand}
            disabled={disabled}
          />

          {/* Font Selection Dropdown */}
          <FontDropdown 
            showFontDropdown={showFontDropdown}
            setShowFontDropdown={setShowFontDropdown}
            currentFont={currentFont}
            changeFontFamily={changeFontFamily}
            disabled={disabled}
          />

          {/* Hindi Typing Toggle */}
          <HindiTypingButton 
            isHindiTyping={isHindiTyping}
            toggleHindiTyping={toggleHindiTyping}
            disabled={disabled}
          />

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Format Buttons */}
          <FormatButtons 
            activeFormats={activeFormats}
            executeCommand={executeCommand}
            disabled={disabled}
          />

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Color Picker Tools */}
          <ColorPickerTools 
            showColorPicker={showColorPicker}
            setShowColorPicker={setShowColorPicker}
            showBgColorPicker={showBgColorPicker}
            setShowBgColorPicker={setShowBgColorPicker}
            currentColor={currentColor}
            setCurrentColor={setCurrentColor}
            currentBgColor={currentBgColor}
            setCurrentBgColor={setCurrentBgColor}
            changeTextColor={changeTextColor}
            changeBackgroundColor={changeBackgroundColor}
            colorPickerMode={colorPickerMode}
            setColorPickerMode={setColorPickerMode}
            bgColorPickerMode={bgColorPickerMode}
            setBgColorPickerMode={setBgColorPickerMode}
            disabled={disabled}
          />

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Alignment Tools */}
          <AlignmentTools 
            activeFormats={activeFormats}
            executeCommand={executeCommand}
            disabled={disabled}
          />

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Lists Dropdown */}
          <ListsDropdown 
            showListDropdown={showListDropdown}
            setShowListDropdown={setShowListDropdown}
            insertPlainList={insertPlainList}
            insertBulletList={insertBulletList}
            insertNumberedList={insertNumberedList}
            disabled={disabled}
          />

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* Insert Tools */}
          <InsertToolsButtons 
            insertLink={insertLink}
            executeCommand={executeCommand}
            insertTable={insertTable}
            insertYouTubeVideo={insertYouTubeVideo}
            insertBlockQuote={insertBlockQuote}
            removeFormatting={removeFormatting}
            disabled={disabled}
          />

          {/* Image Upload Tool */}
          <ImageUploadTool 
            api={api}
            executeCommand={executeCommand}
            disabled={disabled}
          />

          <div className="w-px h-8 bg-gray-300 mx-1"></div>

          {/* History */}
          <HistoryButtons 
            handleUndo={handleUndo}
            handleRedo={handleRedo}
            historyIndex={historyIndex}
            historyLength={history.length}
            disabled={disabled}
          />
        </div>
      </div>
      
      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!disabled}
          className={`rich-text-editor-content p-4 min-h-[400px] max-h-[600px] overflow-y-auto focus:outline-none ${disabled ? 'bg-gray-100' : 'bg-white'} ${currentFont}`}
          onInput={handleInput}
          onFocus={() => {
            setIsEditorFocused(true);
            checkActiveFormats();
          }}
          onBlur={() => setIsEditorFocused(false)}
          style={{
            fontSize: '16px',
            lineHeight: '1.6'
          }}
          suppressContentEditableWarning={true}
        />
        
        {/* Placeholder */}
        {!value && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;