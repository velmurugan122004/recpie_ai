import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import { analyzeImage } from '../../../utils/openai';

const FileUploadModal = ({ 
  isOpen, 
  onClose, 
  onFileUpload, 
  acceptedTypes = "image/*",
  title = "Upload Image",
  description = "Upload a photo of your ingredients, dish, or recipe screenshot"
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFileSelection(e?.dataTransfer?.files?.[0]);
    }
  };

  const handleFileSelection = (file) => {
    if (!file) return;

    setError(null);

    // Validate file type against acceptedTypes
    const isAccepted = (() => {
      if (!acceptedTypes || acceptedTypes === 'image/*') {
        return file?.type?.startsWith('image/');
      }
      const parts = acceptedTypes.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      const fileType = (file?.type || '').toLowerCase();
      const fileName = (file?.name || '').toLowerCase();
      const byMime = parts.some(p => !p.startsWith('.') && (p.endsWith('/*') ? fileType.startsWith(p.replace('/*','/')) : fileType === p));
      const byExt = parts.some(p => p.startsWith('.') && fileName.endsWith(p));
      return byMime || byExt;
    })();

    if (!isAccepted) {
      const supportedText = acceptedTypes === 'image/*' 
        ? 'JPG, PNG, GIF, WebP'
        : acceptedTypes;
      setError(`Please select a file in one of these formats: ${supportedText}`);
      return;
    }

    // Validate file size (max 10MB)
    if (file?.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e?.target?.result);
    };
    reader?.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFileSelection(e?.target?.files?.[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);
    
    try {
      // Convert image to base64 for OpenAI Vision API
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e?.target?.result?.split(',')?.[1]; // Remove data:image/...;base64, prefix
          
          // Analyze image with OpenAI Vision API
          const analysisResult = await analyzeImage(base64Data, selectedFile?.type);
          
          if (onFileUpload) {
            onFileUpload(selectedFile, previewUrl, analysisResult);
          }
          
          setIsProcessing(false);
          handleClose();
        } catch (analysisError) {
          console.error('Error analyzing image:', analysisError);
          setError(`Failed to analyze image. ${analysisError?.message || 'Please try again or use a different image.'}`);
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read image file. Please try again.');
        setIsProcessing(false);
      };
      
      reader?.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error processing upload:', error);
      setError('Failed to process upload. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsProcessing(false);
    setDragActive(false);
    setError(null);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-warm-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            iconName="X"
            className="w-8 h-8"
          />
        </div>

        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : selectedFile 
                ? 'border-success bg-success/5' 
                : error
                ? 'border-error bg-error/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes}
              onChange={handleFileInputChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="space-y-4">
                <div className="relative w-full max-w-xs mx-auto">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setError(null);
                      if (fileInputRef?.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    iconName="X"
                    className="absolute -top-2 -right-2 w-6 h-6"
                    disabled={isProcessing}
                  />
                </div>
                <div className="text-sm font-body text-success">
                  <Icon name="CheckCircle" size={16} className="inline mr-1" />
                  File selected: {selectedFile?.name}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                  dragActive 
                    ? 'bg-primary/20' 
                    : error 
                    ? 'bg-error/20' :'bg-muted'
                }`}>
                  <Icon 
                    name={dragActive ? "Upload" : error ? "AlertCircle" : "ImagePlus"} 
                    size={24} 
                    className={
                      dragActive 
                        ? "text-primary" 
                        : error 
                        ? "text-error" :"text-muted-foreground"
                    } 
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="font-body font-medium text-foreground">
                    {dragActive ? "Drop your image here" : "Drag & drop your image here"}
                  </p>
                  <p className="text-sm font-body text-muted-foreground">
                    {description}
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={openFileDialog}
                  iconName="FolderOpen"
                  iconPosition="left"
                  disabled={isProcessing}
                >
                  Browse Files
                </Button>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error" />
                <p className="text-sm font-body text-error">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="animate-spin">
                  <Icon name="Loader2" size={16} className="text-primary" />
                </div>
                <p className="text-sm font-body text-primary">
                  Analyzing image with AI... This may take a moment.
                </p>
              </div>
            </div>
          )}

          {/* File Requirements */}
          <div className="text-xs font-body text-muted-foreground bg-muted/50 rounded-lg p-3">
            <strong>Requirements:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Supported formats: {acceptedTypes === 'image/*' ? 'JPG, PNG, GIF, WebP' : acceptedTypes}</li>
              <li>Maximum file size: 10MB</li>
              <li>For best results, use clear, well-lit photos</li>
              <li>Images will be analyzed using AI to extract recipe information</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleUpload}
              disabled={!selectedFile || isProcessing || error}
              loading={isProcessing}
              iconName="Upload"
              iconPosition="left"
              className="flex-1"
            >
              {isProcessing ? "Analyzing..." : "Upload & Analyze"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;