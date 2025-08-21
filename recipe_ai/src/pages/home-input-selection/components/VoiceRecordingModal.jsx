import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { transcribeAudio } from '../../../utils/openai';

// Initialize webkitSpeechRecognition for cross-browser compatibility
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceRecordingModal = ({ isOpen, onClose, onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordedText, setRecordedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const recognitionRef = useRef(null);
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const timerRef = useRef(null);
  const animationRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start audio level monitoring if audio context is available
      if (analyserRef?.current) {
        const animateAudioLevel = () => {
          const bufferLength = analyserRef?.current?.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserRef?.current?.getByteFrequencyData(dataArray);
          
          const average = dataArray?.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel((average / 255) * 100);
          
          if (isRecording) {
            animationRef.current = requestAnimationFrame(animateAudioLevel);
          }
        };
        animateAudioLevel();
      }
    } else {
      if (timerRef?.current) {
        clearInterval(timerRef?.current);
      }
      if (animationRef?.current) {
        cancelAnimationFrame(animationRef?.current);
      }
      setAudioLevel(0);
    }

    return () => {
      if (timerRef?.current) clearInterval(timerRef?.current);
      if (animationRef?.current) cancelAnimationFrame(animationRef?.current);
    };
  }, [isRecording]);

  // Initialize speech recognition
  const initializeRecognition = () => {
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in your browser.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after first result
    recognition.interimResults = false; // Only final results
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1; // Only one result

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setRecordedText(transcript);
      setFinalTranscript(transcript);
      
      // Auto-submit after a short delay
      setTimeout(() => {
        if (transcript.trim()) {
          handleSubmit(transcript.trim());
        }
      }, 500);
    };

    recognition.onspeechend = () => {
      stopRecording();
    };

    recognition.onend = () => {
      if (finalTranscript.trim()) {
        handleSubmit(finalTranscript.trim());
      } else if (recordedText.trim()) {
        handleSubmit(recordedText.trim());
      } else {
        onClose();
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setError(`Speech recognition error: ${event.error}`);
      stopRecording();
    };

    return recognition;
  };

  const startRecording = async () => {
    try {
      setError(null);
      setIsRecording(true);
      setRecordedText('');
      setInterimTranscript('Listening...');
      setFinalTranscript('');
      chunksRef.current = [];
      
      // Initialize speech recognition
      recognitionRef.current = initializeRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.start();
        
        // Auto-stop after 30 seconds of silence
        const timeoutId = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 30000);
        
        return () => clearTimeout(timeoutId);
      }
      
      // Request microphone access
      const stream = await navigator?.mediaDevices?.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });

      // Set up audio context for level monitoring
      audioContextRef.current = new (window?.AudioContext || window?.webkitAudioContext)();
      const source = audioContextRef?.current?.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef?.current?.createAnalyser();
      analyserRef.current.fftSize = 256;
      source?.connect(analyserRef?.current);

      // Set up MediaRecorder
      const options = {
        mimeType: MediaRecorder?.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      };
      
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event?.data?.size > 0) {
          chunksRef?.current?.push(event?.data);
        }
      };

      mediaRecorderRef.current?.start(1000); // Collect data every second
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to access microphone. Please check permissions and try again.');
      setIsRecording(false);
    }
  };

  useEffect(() => {
    // Auto-start recording when component mounts
    const startAutoRecording = async () => {
      try {
        await startRecording();
      } catch (error) {
        console.error('Error starting recording:', error);
        setError('Failed to access microphone. Please check permissions.');
        setIsRecording(false);
      }
    };

    if (isOpen) {
      startAutoRecording();
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isOpen]);

  const stopRecording = () => {
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Stop media recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsRecording(false);
  };

  const handleSubmit = async (text = '') => {
    if (text) {
      // If we have direct text from speech recognition, use it immediately
      onRecordingComplete(text);
      onClose();
      return;
    }
    
    // Fallback to audio transcription if no text from speech recognition
    if (chunksRef.current.length === 0) return;
    
    try {
      setIsProcessing(true);
      
      // Combine audio chunks
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      
      // Transcribe the audio
      const transcription = await transcribeAudio(audioBlob);
      
      // Send the transcription to the parent component
      onRecordingComplete(transcription);
      onClose();
    } catch (error) {
      console.error('Error processing recording:', error);
      setError('Failed to process recording. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseRecording = () => {
    if (recordedText && onRecordingComplete) {
      onRecordingComplete(recordedText);
    }
    handleClose();
  };

  const handleClose = () => {
    // Stop recording if in progress
    if (isRecording) {
      stopRecording();
    }
    
    setIsRecording(false);
    setRecordingTime(0);
    setRecordedText('');
    setIsProcessing(false);
    setAudioLevel(0);
    setError(null);
    onClose();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-warm-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Voice Recording
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            iconName="X"
            className="w-8 h-8"
          />
        </div>

        <div className="text-center space-y-6">
          {/* Recording Visualization */}
          <div className="relative">
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording ? 'bg-error/20 animate-pulse' : 'bg-primary/20'
            }`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording ? 'bg-error/40' : 'bg-primary/40'
              }`}>
                <Icon 
                  name={isRecording ? "Square" : "Mic"} 
                  size={32} 
                  className={isRecording ? "text-error" : "text-primary"} 
                />
              </div>
            </div>
            
            {/* Audio Level Indicator */}
            {isRecording && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-error transition-all duration-100 ease-out"
                  style={{ width: `${audioLevel}%` }}
                />
              </div>
            )}
          </div>

          {/* Recording Status */}
          <div className="space-y-2">
            {isRecording && (
              <div className="text-2xl font-mono font-bold text-error">
                {formatTime(recordingTime)}
              </div>
            )}
            
            <p className="text-sm font-body text-muted-foreground">
              {isRecording 
                ? "Listening... Speak clearly about your ingredients or recipe preferences"
                : isProcessing 
                ? "Processing your recording with AI..."
                : recordedText 
                ? "Recording processed successfully!" 
                : error 
                ? error
                : "Tap the microphone to start recording"
              }
            </p>
          </div>

          {/* Transcription Display */}
          <div className="mt-6 min-h-20 p-4 bg-muted/20 rounded-lg mb-4">
            {recordedText ? (
              <p className="text-foreground">
                {recordedText}
                {interimTranscript && (
                  <span className="text-muted-foreground">{interimTranscript}</span>
                )}
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">
                {isRecording 
                  ? 'Speak now...' 
                  : 'Press the button to start speaking'}
              </p>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-left">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error" />
                <p className="text-sm font-body text-error">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {!isRecording && !recordedText && !isProcessing && !error && (
              <Button
                variant="default"
                onClick={startRecording}
                iconName="Mic"
                iconPosition="left"
                className="flex-1"
              >
                Start Recording
              </Button>
            )}
            
            {isRecording && (
              <Button
                variant="destructive"
                onClick={stopRecording}
                iconName="Square"
                iconPosition="left"
                className="flex-1"
              >
                Stop Recording
              </Button>
            )}
            
            {(recordedText || error) && !isProcessing && (
              <div className="mt-8 flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className="flex items-center gap-2 min-w-32 justify-center"
                >
                  {isRecording ? (
                    <>
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      Stop
                    </>
                  ) : (
                    <>
                      <Icon name="Mic" size={16} />
                      Start
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="text-xs font-body text-muted-foreground text-left bg-muted/50 rounded-lg p-3">
            <strong>Tips for better recognition:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Speak clearly and at a normal pace</li>
              <li>Mention your available ingredients</li>
              <li>Include dietary preferences (e.g., "non-vegetarian", "vegetarian")</li>
              <li>Mention any allergies or restrictions</li>
              <li>Mention cooking time preferences if relevant</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecordingModal;