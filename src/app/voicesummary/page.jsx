"use client"
import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Link from "next/link"
import { withPrivateRouteProtection } from '@/utils/authProtection'
import { 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Pause, 
  Play, 
  SkipBack, 
  SkipForward, 
  Volume2 
} from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'

const VoiceSummary = () => {
  const userId = useSelector(state => state.user)["userDetail"][0];
  const summary = useSelector(state => state.summary)["summary"]
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [timestamp,setTimestamp]=useState([])
  const audioRef = useRef(null)
  const itemsPerPage = 1
  
  // Pagination calculations
  const totalPages = Math.ceil(summary.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = summary.slice(startIndex, endIndex)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
    
    // Only set currentTime if timestamp exists and is a valid number
    if (audioRef.current && timestamp && timestamp[pageNumber-1] !== undefined) {
      const time = timestamp[pageNumber-1];
      if (isFinite(time)) {  // Check if the value is a valid finite number
        setCurrentTime(time);
        audioRef.current.currentTime = time;
      }
    }
  }

  function findNextLowerIndex(arr, value) {
    // Safety check - if arr is empty or undefined, return 0
    if (!arr || arr.length === 0) return 0;
    
    let left = 0;
    let right = arr.length - 1;
    let resultIndex = 0; // Default to first page if no lower value found
    
    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      
      if (arr[mid] <= value) {
        resultIndex = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    return resultIndex;
  }
  
  // Combine ALL summaries into a single text for TTS
  const getFullSummaryText = () => {
    if (!summary || summary.length === 0) return [];
    return summary.map(item => `Headlines. ${item.headline}\n\nSummary. ${item.summary}`);
  };
// Format time for display (mm:ss)

  const formatTime = (timeInSeconds) => {

    const minutes = Math.floor(timeInSeconds / 60)

    const seconds = Math.floor(timeInSeconds % 60)

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

  }
  const handleGenerateSpeech = async () => {
    const text = getFullSummaryText()
    if (!text) {
      toast.error("No content available for text-to-speech")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post('http://localhost:4000/api/generate-speech', { 
        text,
        userId: userId // Replace with actual user ID if needed
      },  {
        responseType: 'arraybuffer',
        // Important: Enable axios to expose custom headers
        headers: {
          'Content-Type': 'application/json'
        }
      })

    // Extract timestamps from response headers
  const timestampsHeader = response.headers['x-audio-timestamps'];
  if (timestampsHeader) {
    try {
      // Parse timestamps - they're in format {timeInSeconds: pageNumber}
      const timestamps = JSON.parse(timestampsHeader);
      setTimestamp(timestamps);
      console.log("Timestamps received:", timestamps);
    } catch (e) {
      console.error("Error parsing timestamps:", e);
    }
  }
      
      // Create a blob and URL for the audio
      const blob = new Blob([response.data], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      
      setAudioUrl(url)
      setIsPlaying(true)
      
      // Play the audio automatically after loading
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play()
        }
      }, 100)
      
      toast.success("Audio generated successfully")
    } catch (error) {
      console.error("TTS error:", error)
      let errorMessage = "Failed to generate speech"
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Authentication error"
        } else if (error.response.status === 429) {
          errorMessage = "Rate limit exceeded. Please try again later."
        }
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePlayPause = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const skipForward = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime += 10
    if (timestamp && timestamp.length > 0) {
      let pageIndex = findNextLowerIndex(timestamp,  audioRef.current.currentTime);
      if (pageIndex >= 0 && pageIndex < totalPages) {
        setCurrentPage(pageIndex + 1);
      }
    }
  }

  const skipBackward = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime -= 10
    if (timestamp && timestamp.length > 0) {
      let pageIndex = findNextLowerIndex(timestamp,  audioRef.current.currentTime);
      console.log(pageIndex)
      console.log(audioRef.current.currentTime-10)
      if (pageIndex >= 0 && pageIndex < totalPages) {
        setCurrentPage(pageIndex + 1);
      }
    }
  }

  const handleProgressChange = (e) => {
    const value = e.target.value;
    if (!audioRef.current) return;
    
    const newTime = (value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    
    // Only update page if timestamps exist
    if (timestamp && timestamp.length > 0) {
      let pageIndex = findNextLowerIndex(timestamp, newTime);
      if (pageIndex >= 0 && pageIndex < totalPages) {
        setCurrentPage(pageIndex + 1);
      }
    }
  }

// Handle audio events

useEffect(() => {

  const audio = audioRef.current

  if (!audio) return

  

  const handleEnded = () => setIsPlaying(false)

  const handleError = () => {

    setIsPlaying(false)

    toast.error("Error playing audio")

  }


  const handleTimeUpdate = () => {
    setCurrentTime(audio.currentTime)

    // Only update page if timestamps exist
    if (timestamp && timestamp.length > 0) {
      let pageIndex = findNextLowerIndex(timestamp, audio.currentTime);
      if (pageIndex >= 0 && pageIndex < totalPages) {
        setCurrentPage(pageIndex + 1);
      }
    }
  }


  const handleDurationChange = () => setDuration(audio.duration)

  const handlePlay = () => setIsPlaying(true)

  const handlePause = () => setIsPlaying(false)

  audio.addEventListener('timeupdate', handleTimeUpdate)


  audio.addEventListener('ended', handleEnded)

  audio.addEventListener('error', handleError)


  audio.addEventListener('durationchange', handleDurationChange)

  audio.addEventListener('play', handlePlay)

  audio.addEventListener('pause', handlePause)

  

  return () => {

    audio.removeEventListener('ended', handleEnded)

    audio.removeEventListener('error', handleError)

    audio.removeEventListener('timeupdate', handleTimeUpdate)

    audio.removeEventListener('durationchange', handleDurationChange)

    audio.removeEventListener('play', handlePlay)

    audio.removeEventListener('pause', handlePause)

  }

}, [audioRef.current?.currentTime])

  // Clean up audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  if (summary.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-8 text-center space-y-6 shadow-2xl">
          <Volume2 className="mx-auto text-cyan-400" size={64} strokeWidth={1.5} />
          <h2 className="text-2xl font-semibold text-cyan-300 tracking-wide">
            No Content Available
          </h2>
          <p className="text-gray-400">
            Please upload a photo or PDF to generate a summary first
          </p>
          <Link href="/summary">
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-800/60 backdrop-blur-lg rounded-lg border border-gray-700/50 text-cyan-300 transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 mx-auto">
              <ArrowLeft size={20} />
              Back to Summary
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
        <div className="bg-gray-800/40 p-6 border-b border-gray-700/30">
          <h2 className="text-3xl font-bold text-center text-cyan-300 tracking-wide flex items-center justify-center gap-4">
            <Volume2 className="text-cyan-400" size={36} strokeWidth={1.5} />
            Voice Summary
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {currentItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-gray-900/50 rounded-xl p-5 border border-gray-700/30 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <h3 className="text-xl font-semibold text-cyan-300 mb-3 tracking-wide">
                {item.headline}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {item.summary}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="bg-gray-800/40 p-4 flex justify-center items-center space-x-4 border-t border-gray-700/30">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="group p-2 rounded-full transition-all duration-300 disabled:opacity-30 hover:bg-gray-700/50"
          >
            <ArrowLeft 
              className={`text-cyan-400 group-disabled:text-gray-500 transition-colors`} 
              size={24} 
            />
          </button>

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`w-10 h-10 rounded-full transition-all duration-300 ${
                currentPage === number 
                  ? 'bg-cyan-600 text-white scale-110' 
                  : 'bg-transparent text-cyan-400 hover:bg-gray-700/50'
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="group p-2 rounded-full transition-all duration-300 disabled:opacity-30 hover:bg-gray-700/50"
          >
            <ArrowRight 
              className={`text-cyan-400 group-disabled:text-gray-500 transition-colors`} 
              size={24} 
            />
          </button>
        </div>
      </div>

      {/* Audio Player - Fixed at the bottom */}
      <div className="w-full max-w-3xl bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden mt-8">
        <div className="bg-gray-800/40 p-6">
        <audio ref={audioRef} src={audioUrl} className="hidden" />
          <div className="flex flex-col items-center space-y-6">
            {!audioUrl && (
              <button
                onClick={handleGenerateSpeech}
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-4 bg-cyan-600 rounded-lg text-white font-medium transition-all duration-300 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Generating Audio...
                  </>
                ) : (
                  <>
                    <Volume2 size={20} />
                    Convert All Summaries to Speech
                  </>
                )}
              </button>
            )}
            
            {audioUrl && (
              <>
                
                {/* Audio Progress Bar */}
                <div className="w-full px-2">
                  <div className="flex justify-between text-xs text-cyan-300 mb-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="relative w-full">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={(currentTime / (duration || 1)) * 100 || 0}                      
                      onChange={handleProgressChange}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #06b6d4 ${(currentTime / (duration || 1)) * 100}%, #374151 ${(currentTime / (duration || 1)) * 100}%)`,                        // These are required to make the slider styling work across browsers
                        WebkitAppearance: 'none',
                        appearance: 'none',
                      }}
                    />
                  </div>
                </div>
                
                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4 w-full">
                  <button
                    onClick={skipBackward}
                    className="p-3 rounded-full bg-gray-700/50 text-cyan-300 transition-all duration-300 hover:bg-gray-700 hover:text-cyan-400"
                  >
                    <SkipBack size={24} />
                  </button>
                  
                  <button
                    onClick={togglePlayPause}
                    className="p-4 rounded-full bg-cyan-600 text-white transition-all duration-300 hover:bg-cyan-500"
                  >
                    {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                  </button>
                  
                  <button
                    onClick={skipForward}
                    className="p-3 rounded-full bg-gray-700/50 text-cyan-300 transition-all duration-300 hover:bg-gray-700 hover:text-cyan-400"
                  >
                    <SkipForward size={24} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 mb-8">
        <Link href="/summary">
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-800/60 backdrop-blur-lg rounded-lg border border-gray-700/50 text-cyan-300 transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20">
            <ArrowLeft size={20} />
            Back to Summary
          </button>
        </Link>
      </div>
    </div>
  )
}

export default withPrivateRouteProtection(VoiceSummary)