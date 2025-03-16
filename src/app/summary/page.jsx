"use client"
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Link from "next/link"
import { withPrivateRouteProtection } from '@/utils/authProtection'
import { ArrowLeft, ArrowRight, FileText, Volume2, Home } from 'lucide-react'

const Summary = () => {
  const summary = useSelector(state => state.summary)["summary"]
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  if (summary.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-8 text-center space-y-6 shadow-2xl">
          <FileText className="mx-auto text-cyan-400" size={64} strokeWidth={1.5} />
          <h2 className="text-2xl font-semibold text-cyan-300 tracking-wide">
            Upload a Photo or PDF to Get Started
          </h2>
          <p className="text-gray-400">
            Your personalized news summary will appear here after processing
          </p>
          <div className="mt-6">
            <Link href="/">
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-800/60 backdrop-blur-lg rounded-lg border border-gray-700/50 text-cyan-300 transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 mx-auto">
                <Home size={20} />
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(summary.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = summary.slice(startIndex, endIndex)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo(0, 0)
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
        <div className="bg-gray-800/40 p-6 border-b border-gray-700/30">
          <h2 className="text-3xl font-bold text-center text-cyan-300 tracking-wide flex items-center justify-center gap-4">
            <FileText className="text-cyan-400" size={36} strokeWidth={1.5} />
            News Summary
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

      <div className="mt-8 flex space-x-4">
        <Link href="/voicesummary">
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-800/60 backdrop-blur-lg rounded-lg border border-gray-700/50 text-cyan-300 transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20">
            <Volume2 size={20} />
            Voice Summary
          </button>
        </Link>
      </div>
    </div>
  )
}

export default withPrivateRouteProtection(Summary)