import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ShareDialog = ({ recipe, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`Check out this amazing recipe: ${recipe?.title}`);

  if (!isOpen || !recipe) return null;

  const shareUrl = `${window.location?.origin}/recipe-detail?id=${recipe?.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleSocialShare = (platform) => {
    const text = `Check out this recipe: ${recipe?.title}`;
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(text)}`
    };
    
    window.open(urls?.[platform], '_blank', 'width=600,height=400');
  };

  const handleEmailShare = () => {
    const subject = `Recipe: ${recipe?.title}`;
    const body = `${message}\n\nView recipe: ${shareUrl}`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl max-w-md w-full shadow-warm-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-heading font-semibold text-foreground">Share Recipe</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Recipe Preview */}
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="ChefHat" size={20} color="var(--color-primary)" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground line-clamp-1">{recipe?.title}</h4>
              <p className="text-sm text-muted-foreground">{recipe?.cuisine} • {recipe?.prepTime} min</p>
            </div>
          </div>

          {/* Copy Link */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Share Link</label>
            <div className="flex space-x-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 bg-muted"
              />
              <Button
                variant={copied ? "success" : "outline"}
                onClick={handleCopyLink}
                iconName={copied ? "Check" : "Copy"}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Share on Social Media</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialShare('facebook')}
                iconName="Facebook"
                iconPosition="left"
                className="justify-start"
              >
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare('twitter')}
                iconName="Twitter"
                iconPosition="left"
                className="justify-start"
              >
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare('whatsapp')}
                iconName="MessageCircle"
                iconPosition="left"
                className="justify-start"
              >
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare('pinterest')}
                iconName="Image"
                iconPosition="left"
                className="justify-start"
              >
                Pinterest
              </Button>
            </div>
          </div>

          {/* Email Share */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Share via Email</label>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e?.target?.value)}
              />
              <textarea
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="Add a personal message..."
                value={message}
                onChange={(e) => setMessage(e?.target?.value)}
              />
              <Button
                variant="default"
                onClick={handleEmailShare}
                disabled={!email}
                iconName="Mail"
                iconPosition="left"
                fullWidth
              >
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;