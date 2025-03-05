"use client"
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Loader2, RefreshCw } from 'lucide-react';
import { useSelector } from 'react-redux';
import { withPrivateRouteProtection } from '@/utils/authProtection';
import { toast } from 'sonner';

const LoadingState = ({ duration }) => {
  const [showExtendedMessage, setShowExtendedMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowExtendedMessage(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-fadeIn">
      <div className="relative">
        <Loader2 className="h-12 w-12 text-cyan-400 animate-spin" />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
      </div>
      
      <p className="text-marker text-center animate-pulse">
        Generating audio...
      </p>
      
      {showExtendedMessage && (
        <p className="text-body text-sm text-center max-w-md animate-fadeIn">
          This might take a little longer than usual. 
          We're working on creating high-quality audio for you.
          Do not Refresh
        </p>
      )}
      
      <div className="h-1 w-48 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-loading" />
      </div>
    </div>
  );
};

const ErrorState = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-fadeIn">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-red-400 flex items-center justify-center">
          <span className="text-red-400 text-2xl font-display">!</span>
        </div>
      </div>
      
      <p className="text-marker text-center text-red-400">
        Audio generation failed
      </p>
      
      <p className="text-body text-sm text-center max-w-md">
        We encountered an error while generating your audio.
        Please try again.
      </p>
      
      <Button
        onClick={onRetry}
        className="font-sans bg-gray-800 text-cyan-400 hover:bg-gray-700 hover:text-cyan-300 border border-gray-700 animate-bounce"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Retry Generation
      </Button>
    </div>
  );
};

const TTSPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);
  const [paragraphTimes, setParagraphTimes] = useState([]);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(false);
  const audioRef = useRef(null);

  const userId = useSelector(state => state.user)["userDetail"][0];
  const articles = useSelector(state => state.summary)["summary"];

  const formatArticlesText = (articles) => {
    return articles.map(article => 
      `Headlines. ${article.headline}\n\n${article.summary}`
    ).join('\n\n');
  };

  const generateSpeech = async () => {
    try {
      setGenerationError(false);
      setIsGenerating(true);
      
      const formattedText = formatArticlesText(articles);
      const paragraphList = formattedText.split('\n\n').filter(p => p.trim().length > 0);
      setParagraphs(paragraphList);
      // http://localhost:4000/api/generate-speech     
      //  https://news-backend-motc.onrender.com
      const response = await fetch('https://news-backend-motc.onrender.com/api/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: formattedText,
          userId: userId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error);
        throw new Error(error.error || 'Failed to generate speech');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setCurrentTime(0);
      setCurrentParagraphIndex(0);
      setIsPlaying(false);
      setIsAudioReady(true);
      toast.success('Audio ready to play');
    } catch (error) {
      console.error('Error generating speech:', error);
      setGenerationError(true);
      toast.error('Failed to generate speech. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if(articles.length !== 0) {
      generateSpeech();
      return () => {
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
      };
    }
  }, [articles]);

  // Compute paragraph times when duration changes
  useEffect(() => {
    if (duration > 0 && paragraphs.length > 0) {
      const averageParagraphDuration = duration / paragraphs.length;
      const times = paragraphs.map((_, index) => index * averageParagraphDuration);
      setParagraphTimes(times);
    }
  }, [duration, paragraphs]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentAudioTime = audioRef.current.currentTime;
      setCurrentTime(currentAudioTime);
      
      // More precise paragraph tracking
      const newParagraphIndex = paragraphTimes.findLastIndex(
        time => currentAudioTime >= time
      );
      
      if (newParagraphIndex !== -1) {
        setCurrentParagraphIndex(
          Math.min(newParagraphIndex, paragraphs.length - 1)
        );
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlayPause = () => {
    if (!isAudioReady) {
      toast.error('Audio is not ready yet');
      return;
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        if (currentTime === duration) {
          audioRef.current.currentTime = 0;
          setCurrentParagraphIndex(0);
        }
        audioRef.current.play().catch(error => {
          toast.error('Failed to play audio');
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSliderChange = (value) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      
      // Update paragraph index when manually seeking
      const newParagraphIndex = paragraphTimes.findLastIndex(
        time => newTime >= time
      );
      
      if (newParagraphIndex !== -1) {
        setCurrentParagraphIndex(
          Math.min(newParagraphIndex, paragraphs.length - 1)
        );
      }
    }
  };

  const skipForward = () => {
    if (audioRef.current && isAudioReady) {
      const newTime = Math.min(audioRef.current.currentTime + 5, duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      
      // Update paragraph index when skipping
      const newParagraphIndex = paragraphTimes.findLastIndex(
        time => newTime >= time
      );
      
      if (newParagraphIndex !== -1) {
        setCurrentParagraphIndex(
          Math.min(newParagraphIndex, paragraphs.length - 1)
        );
      }
    }
  };

  const skipBackward = () => {
    if (audioRef.current && isAudioReady) {
      const newTime = Math.max(audioRef.current.currentTime - 5, 0);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      
      // Update paragraph index when skipping
      const newParagraphIndex = paragraphTimes.findLastIndex(
        time => newTime >= time
      );
      
      if (newParagraphIndex !== -1) {
        setCurrentParagraphIndex(
          Math.min(newParagraphIndex, paragraphs.length - 1)
        );
      }
    }
  };

  // Memoized current paragraph for performance
  const currentParagraph = useMemo(() => {
    return paragraphs[currentParagraphIndex] || 'No text available';
  }, [paragraphs, currentParagraphIndex]);

  if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white px-6">
        <div className="p-6 w-full max-w-2xl bg-gray-900 rounded-lg shadow-lg">
          <h2 className="heading-medium text-cyan-400">
            First upload photo or pdf to get news summarized
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-6 py-6">
      <Card className="w-full max-w-2xl bg-gray-900 shadow-lg">
        <CardContent className="p-6">
          {isGenerating ? (
            <LoadingState duration={2} />
          ) : generationError ? (
            <ErrorState onRetry={generateSpeech} />
          ) : (
            <>
              <div className="mb-6 h-32 overflow-y-auto p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-white">
                  {currentParagraph}
                </p>
                <div className="mt-2 text-sm text-gray-400">
                  Paragraph {currentParagraphIndex + 1} of {paragraphs.length}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <Button 
                    className="font-sans bg-gray-800 text-cyan-400 hover:bg-gray-700 hover:text-cyan-300 border border-gray-700"
                    size="icon" 
                    onClick={skipBackward}
                    disabled={!isAudioReady}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button 
                    className="font-sans bg-cyan-600 text-white hover:bg-cyan-500"
                    onClick={togglePlayPause}
                    size="icon"
                    disabled={!isAudioReady}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    className="font-sans bg-gray-800 text-cyan-400 hover:bg-gray-700 hover:text-cyan-300 border border-gray-700"
                    size="icon"
                    onClick={skipForward}
                    disabled={!isAudioReady}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Slider
                    value={[currentTime / duration * 100 || 0]}
                    onValueChange={handleSliderChange}
                    max={100}
                    step={0.1}
                    disabled={!isAudioReady}
                    className="[&_[role=slider]]:bg-cyan-400 [&_[role=slider]]:border-cyan-400 [&_[role=slider]]:hover:bg-cyan-300"
                  />
                  <div className="flex justify-between text-sm font-mono text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>

              <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => {
                  setIsPlaying(false);
                  setCurrentParagraphIndex(paragraphs.length - 1);
                  toast.success('Playback completed');
                }}
                preload="auto"
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default withPrivateRouteProtection(TTSPlayer);