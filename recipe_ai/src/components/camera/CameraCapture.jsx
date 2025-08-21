import React, { useRef, useState, useEffect } from 'react';
import Button from '../ui/Button';
import Icon from '../AppIcon';

const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState(null);

  // Start the camera when component mounts
  useEffect(() => {
    let mediaStream = null;

    const startCamera = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Could not access the camera. Please check your permissions.');
      }
    };

    startCamera();

    // Cleanup function to stop the camera when component unmounts
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (!videoRef.current) return;

    setIsCapturing(true);
    
    // Create a canvas to capture the current frame
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Draw the current video frame to the canvas
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob and create a file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        onCapture(file);
      }
      setIsCapturing(false);
    }, 'image/jpeg', 0.9);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-2xl p-6 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertCircle" className="text-red-500" size={32} />
          </div>
          <h3 className="text-lg font-bold mb-2">Camera Access Error</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-2xl aspect-[4/3] bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Camera controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={stopCamera}
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
            aria-label="Cancel"
          >
            <Icon name="X" size={24} />
          </Button>
          
          <Button
            variant="default"
            size="icon"
            onClick={captureImage}
            disabled={isCapturing}
            className={`w-16 h-16 rounded-full ${isCapturing ? 'bg-primary/50' : 'bg-white'}`}
            aria-label="Take photo"
          >
            {isCapturing ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-red-500" />
            )}
          </Button>
          
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </div>
      
      <p className="mt-4 text-sm text-white/70 text-center">
        Position your ingredients in the frame and tap the button to capture
      </p>
    </div>
  );
};

export default CameraCapture;
