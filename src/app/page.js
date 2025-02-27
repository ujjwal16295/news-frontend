"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mb-12">
        <h1 className="heading-large mb-6">
          Transform News into <span className="text-cyan-400">Audio Summaries</span>
        </h1>
        <p className="text-body mb-8">
          Convert your newspaper PDFs and photos into concise summaries with natural-sounding voice narration.
          Save time and stay informed with our AI-powered news digest service.
        </p>
      </div>

      {/* Feature Boxes - Equal Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* PDF Upload Box */}
        <Link href="/pdfreader" className="group h-full">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 h-full">
            <div className="flex flex-col h-full">
              <h2 className="heading-medium mb-4 group-hover:text-cyan-400 font-display flex items-center">
                <span className="text-3xl mr-3">📄</span> Upload Newspaper PDF
              </h2>
              <p className="text-body mb-6">
                Upload complete newspaper PDFs and get AI-generated summaries with voice narration.
                Perfect for daily newspapers or multi-page publications.
              </p>
              <div className="mt-auto flex items-center text-cyan-400 font-medium">
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </div>
        </Link>

        {/* Photo Upload Box */}
        <Link href="/photoreader" className="group h-full">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 h-full">
            <div className="flex flex-col h-full">
              <h2 className="heading-medium mb-4 group-hover:text-cyan-400 font-display flex items-center">
                <span className="text-3xl mr-3">🖼️</span> Upload News Photo
              </h2>
              <p className="text-body mb-6">
                Snap a photo of a specific news article and upload it for instant summarization and audio playback.
                Perfect for individual stories or on-the-go reading.
              </p>
              <div className="mt-auto flex items-center text-cyan-400 font-medium">
                Try it now <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* How It Works Section */}
      <div className="mt-16 max-w-4xl w-full">
        <h2 className="heading-medium text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <div className="text-cyan-400 text-2xl font-bold mb-2">1</div>
            <h3 className="text-lg font-bold mb-2">Upload</h3>
            <p>Upload your newspaper PDF or snap a photo of an article</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <div className="text-cyan-400 text-2xl font-bold mb-2">2</div>
            <h3 className="text-lg font-bold mb-2">Process</h3>
            <p>Our AI analyzes and summarizes the key information</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <div className="text-cyan-400 text-2xl font-bold mb-2">3</div>
            <h3 className="text-lg font-bold mb-2">Listen</h3>
            <p>Get text summaries and natural voice narration instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
}