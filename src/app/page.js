"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <h1 className="heading-large mb-6">
          AI-Powered <span className="text-marker">News Summarizer</span>
        </h1>
        <p className="text-body mb-8">
        Get quick and accurate news summaries from PDFs and images, along with AI-generated voice narration. Upload your newspaper or article image and stay informed in minutes!
        </p>
      </div>

      {/* Feature Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        
        {/* PDF Upload Box */}
        <Link href="/pdfreader" className="group">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 text-center transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20">
            <h2 className="heading-medium mb-2 group-hover:text-cyan-400 font-display">
              📄 Upload Newspaper PDF
            </h2>
            <p className="text-body">Get a summarized voice output.</p>
          </div>
        </Link>

        {/* Photo Upload Box */}
        <Link href="/photoreader" className="group">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 text-center transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20">
            <h2 className="heading-medium mb-2 group-hover:text-cyan-400 font-display">
              🖼️ Upload News Photo
            </h2>
            <p className="text-body">Get an instant AI-generated summary.</p>
          </div>
        </Link>

      </div>
    </div>
  );
}