"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Link from "next/link"
import { withPrivateRouteProtection } from '@/utils/authProtection'
import { 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Pause, 
  Play, 
  Volume2 
} from 'lucide-react'
import { toast } from 'sonner'

const VoiceSummary = () => {
  const summary = useSelector(state => state.summary)["summary"]
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [speechSynthesis, setSpeechSynthesis] = useState(null)
  const [speechUtterance, setSpeechUtterance] = useState(null)
  const [isChangingPage, setIsChangingPage] = useState(false)
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)
  const itemsPerPage = 1
  
  // Pagination calculations
  const totalPages = Math.ceil(summary.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = summary.slice(startIndex, endIndex)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Initialize speech synthesis on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize speech synthesis
      const synth = window.speechSynthesis
      setSpeechSynthesis(synth)
      
      // Pre-load voices
      synth.getVoices()
      
      // Set up event listener for voices loaded
      synth.onvoiceschanged = () => {
        console.log("Voices loaded:", synth.getVoices().length)
        setSpeechSynthesis(window.speechSynthesis)
      }
    }
    
    // Clean up on unmount
    return () => {
      if (speechUtterance && speechSynthesis) {
        // Remove error handlers before canceling
        if (speechUtterance) {
          speechUtterance.onerror = null
        }
        speechSynthesis.cancel()
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Estimate speech duration based on text length
  const estimateSpeechDuration = (text) => {
    // Average reading speed is about 150-160 words per minute
    // So we estimate 2.5-3 words per second
    const wordsPerSecond = 2.7
    const wordCount = text.split(/\s+/).length
    return wordCount / wordsPerSecond
  }

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setIsChangingPage(true)
    
    // Always cancel any current speech when changing pages
    if (speechSynthesis) {
      // Remove error handlers before canceling
      if (speechUtterance) {
        speechUtterance.onerror = null
      }
      
      try {
        speechSynthesis.cancel()
      } catch (err) {
        console.warn("Error canceling speech:", err)
      }
      
      setIsPlaying(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    
    setCurrentPage(pageNumber)
    window.scrollTo(0, 0)
    
    // Reset the flag after a short delay
    setTimeout(() => {
      setIsChangingPage(false)
    }, 300)
  }

  // Add this useEffect to handle auto-playing on page change
  useEffect(() => {
    // Small delay to ensure state has updated
    const timer = setTimeout(() => {
      if (!isChangingPage && (isPlaying || currentItems.length > 0)) {
        speakCurrentPage()
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [currentPage, isChangingPage])

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!speechSynthesis) {
      console.warn("Speech synthesis not available in this browser")
      // Don't show toast since speech seems to work
      return
    }
    
    if (isPlaying) {
      // Pause speech
      try {
        // Remove error handlers before canceling/pausing
        if (speechUtterance) {
          speechUtterance.onerror = null
        }
        
        speechSynthesis.pause()
      } catch (err) {
        console.warn("Unable to pause:", err)
        // Try canceling instead
        try {
          speechSynthesis.cancel()
        } catch (cancelErr) {
          console.warn("Unable to cancel either:", cancelErr)
        }
      }
      setIsPlaying(false)
      
      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    } else {
      // Start new speech for current page
      speakCurrentPage()
    }
  }

  // Speak the current page content
  const speakCurrentPage = () => {
    // Add a small delay to ensure speechSynthesis is ready
    setTimeout(() => {
      if (!speechSynthesis) {
        console.warn("Speech synthesis not available")
        return // Don't show toast here since speech seems to work
      }
      
      // Cancel any existing speech
      try {
        // Remove error handlers before canceling
        if (speechUtterance) {
          speechUtterance.onerror = null
        }
        speechSynthesis.cancel()
      } catch (err) {
        console.warn("Error canceling previous speech:", err)
      }
      
      if (currentItems.length === 0) return
      
      // Get text for the current page
      const item = currentItems[0]
      const textToSpeak = `Headlines. ${item.headline}. Summary. ${item.summary}`
      
      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      
      // Try to find Martha voice, fall back to first English female voice
      let voices = speechSynthesis.getVoices()
      
      // If voices array is empty, we need to wait for onvoiceschanged
      if (voices.length === 0) {
        setIsLoading(true)
        // Wait for voices to load (max 2 seconds)
        let voiceAttempts = 0
        const voiceCheckInterval = setInterval(() => {
          voices = speechSynthesis.getVoices()
          voiceAttempts++
          if (voices.length > 0 || voiceAttempts > 20) {
            clearInterval(voiceCheckInterval)
            continueWithVoices(voices)
          }
        }, 100)
      } else {
        continueWithVoices(voices)
      }
      
      function continueWithVoices(voices) {
        const marthaVoice = voices.find(voice => voice.name === "Microsoft Martha - English (United States)" || 
                                                 voice.name === "Martha" || 
                                                 voice.name.includes("Martha"))
        
        const englishFemaleVoice = voices.find(voice => 
          (voice.lang && voice.lang.includes('en') && voice.name.includes('Female')) ||
          voice.name.includes('Samantha') ||
          voice.name.includes('Victoria')
        )
        
        utterance.voice = marthaVoice || englishFemaleVoice || (voices.length > 0 ? voices[0] : null)
        utterance.rate = 1.0
        utterance.pitch = 1.0
        
        // Event handlers
        utterance.onstart = () => {
          setIsPlaying(true)
          setIsLoading(false)
        }
        
        utterance.onend = () => {
          setIsPlaying(false)
          setSpeechUtterance(null)
          
          // Stop timer
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          
          // Auto-advance to next page if not on the last page
          // Only if we're not manually changing pages
          if (!isChangingPage) {
            const nextPage = currentPage + 1
            if (nextPage <= totalPages) {
              handlePageChange(nextPage)
            }
          }
        }
        
        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event)
          
          // Only show toast for actual errors, not cancellations or interruptions
          // or when we're changing pages
          if (!isChangingPage && 
              event.error !== 'canceled' && 
              event.error !== 'interrupted' && 
              event.error !== 'aborted') {
            toast.error("Error in speech synthesis")
          }
          
          setIsPlaying(false)
          setIsLoading(false)
          
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
        }
        
        // Store the utterance and start speaking
        setSpeechUtterance(utterance)
        setIsLoading(true)
        
        try {
          speechSynthesis.speak(utterance)
        } catch (err) {
          console.error("Failed to start speech:", err)
          setIsLoading(false)
          
          // Only show toast if we're not changing pages
          if (!isChangingPage) {
            toast.error("Failed to start speech synthesis")
          }
        }
      }
    }, 100)
  }

  // Initialize voices when needed
  useEffect(() => {
    if (speechSynthesis && !speechSynthesis.getVoices().length) {
      speechSynthesis.onvoiceschanged = () => {
        // This will trigger when voices are loaded
        setSpeechSynthesis(window.speechSynthesis)
      }
    }
  }, [speechSynthesis])

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

      {/* Audio Player Control - Simple version */}
      <div className="w-full max-w-3xl bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden mt-8">
        <div className="bg-gray-800/40 p-6">
          <div className="flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              disabled={isLoading}
              className="p-4 rounded-full bg-cyan-600 text-white transition-all duration-300 hover:bg-cyan-500 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={28} />
              ) : isPlaying ? (
                <Pause size={32} />
              ) : (
                <Play size={32} />
              )}
            </button>
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