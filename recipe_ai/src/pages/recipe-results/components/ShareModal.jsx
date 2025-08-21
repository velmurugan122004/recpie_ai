import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ShareModal = ({ isOpen, onClose, recipes }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = window.location?.href;
  const shareText = `Check out these ${recipes?.length} amazing recipe suggestions I found on Recipe AI!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const shareOptions = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: 'MessageCircle',
      color: 'text-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    },
    {
      id: 'twitter',
      label: 'Twitter',
      icon: 'Twitter',
      color: 'text-blue-500',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: 'Facebook',
      color: 'text-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      id: 'email',
      label: 'Email',
      icon: 'Mail',
      color: 'text-gray-600',
      url: `mailto:?subject=${encodeURIComponent('Amazing Recipe Suggestions')}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
    }
  ];

  const handleShareClick = (url) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-warm-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Share Recipe Results
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-muted-foreground mb-6">
            Share these amazing recipe suggestions with your friends and family!
          </p>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {shareOptions?.map((option) => (
              <Button
                key={option?.id}
                variant="outline"
                onClick={() => handleShareClick(option?.url)}
                className="flex items-center justify-center space-x-2 p-4 h-auto"
              >
                <Icon name={option?.icon} size={20} className={option?.color} />
                <span>{option?.label}</span>
              </Button>
            ))}
          </div>

          {/* Copy Link */}
          <div className="border border-border rounded-lg p-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Or copy link
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-muted rounded px-3 py-2 text-sm text-muted-foreground truncate">
                {shareUrl}
              </div>
              <Button
                variant={copied ? "success" : "outline"}
                size="sm"
                onClick={handleCopyLink}
                iconName={copied ? "Check" : "Copy"}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;