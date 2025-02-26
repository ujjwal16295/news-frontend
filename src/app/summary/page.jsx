"use client"
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Link from "next/link"
import { withPrivateRouteProtection } from '@/utils/authProtection'

const Summary = () => {
  const summary = useSelector(state => state.summary)["summary"]
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  if (summary.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white px-6">
        <div className="p-6 w-full max-w-2xl bg-gray-900 rounded-lg shadow-lg">
          <h2 className="heading-medium text-cyan-400">
            First upload photo or pdf to get news summarized
          </h2>
        </div>
      </div>
    )
  }

  // Calculate pagination values
  const totalPages = Math.ceil(summary.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = summary.slice(startIndex, endIndex)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo(0, 0)
  }

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6 py-6">
      <div className="w-full max-w-2xl bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="heading-large mb-6 text-center">
          News Summary
        </h2>
        <ul className="space-y-4">
          {currentItems.map((item, index) => (
            <li key={index} className="border-b border-gray-700 pb-4">
              <h3 className="text-marker text-lg mb-2">
                {item.headline}
              </h3>
              <p className="text-body">
                {item.summary}
              </p>
            </li>
          ))}
        </ul>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`font-sans px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-800 text-cyan-400 hover:bg-gray-700'
            }`}
          >
            Previous
          </button>

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`font-sans px-3 py-1 rounded ${
                currentPage === number
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-cyan-400 hover:bg-gray-700'
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`font-sans px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-800 text-cyan-400 hover:bg-gray-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <Link href="/voicesummary">
        <button className="font-sans mt-6 px-6 py-3 bg-gray-900 border border-gray-700 text-gray-300 rounded-lg transition-all duration-300 hover:border-cyan-400 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20">
          Voice
        </button>
      </Link>
    </div>
  )
}

export default withPrivateRouteProtection(Summary)