import React, { useRef, useState } from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import CameraCapture from '../camera/CameraCapture';

const defaultSuggestions = [
  'How do I make pasta?',
  'What can I make with chicken and rice?'
];

const ChatInput = ({
  onSend,
  onVoiceClick,
  onImageClick,
  onCameraCapture,
  suggestions = defaultSuggestions,
  isSending = false
}) => {
  const [message, setMessage] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const inputRef = useRef(null);

  const handleCameraCapture = (file) => {
    if (onCameraCapture) {
      onCameraCapture(file);
    } else if (onImageClick) {
      // Fallback to image upload if onCameraCapture is not provided
      onImageClick(file);
    }
    setShowCamera(false);
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSend && onSend(trimmed);
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mt-6 w-full max-w-3xl mx-auto px-4">
      <div className="bg-card rounded-2xl shadow-warm p-3 sm:p-4 border border-border w-full">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              className="w-full h-12 rounded-xl border border-input bg-background px-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="Type your message or click the mic to speak..."
              value={message}
              onChange={(e) => setMessage(e?.target?.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onVoiceClick}
              aria-label="Voice input"
            >
              <Icon name="Mic" size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onImageClick}
              aria-label="Upload image"
              title="Upload image"
            >
              <Icon name="ImagePlus" size={18} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowCamera(true)}
              aria-label="Take a photo"
              title="Take a photo"
            >
              <Icon name="Camera" size={18} />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={handleSend}
              disabled={isSending || message.trim().length === 0}
              loading={isSending}
              aria-label="Send message"
            >
              <Icon name="Send" size={18} />
            </Button>
          </div>
        </div>

        {suggestions?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                className="px-3 py-1.5 text-xs rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-foreground transition-colors"
                onClick={() => {
                  setMessage(s);
                  inputRef?.current?.focus?.();
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default ChatInput;


