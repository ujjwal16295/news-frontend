"use client";
import Link from "next/link";
import { ArrowRight, Check, Volume2, Clock, BookOpen, Zap, Smartphone, Brain } from "lucide-react";

export default function WhyUse() {
  const benefits = [
    {
      title: "Save Time with Concise Summaries",
      description: "Convert lengthy articles into quick, digestible summaries you can consume in seconds.",
      icon: <Clock className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "Listen On The Go",
      description: "Our text-to-speech feature turns summaries into audio so you can listen during commutes or workouts.",
      icon: <Volume2 className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "Combat Information Overload",
      description: "Extract only essential information from overwhelming news articles and stay informed without the fluff.",
      icon: <Brain className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "Improve Comprehension",
      description: "Simplified summaries make complex news topics easier to understand and remember.",
      icon: <BookOpen className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "Stay Updated Effortlessly",
      description: "Keep up with current events without the fatigue of reading multiple full-length articles daily.",
      icon: <Zap className="w-8 h-8 text-cyan-400" />
    },
    {
      title: "Multi-Format Support",
      description: "Upload PDFs or snap photos of news articles for instant summaries - no typing required.",
      icon: <Smartphone className="w-8 h-8 text-cyan-400" />
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 sm:px-6 py-12">
      {/* Hero Section with Gradient Background */}
      <div className="relative w-full max-w-5xl mb-16 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/40 to-purple-900/40 z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-800/20 via-transparent to-transparent z-0"></div>
        
        <div className="relative z-10 text-center py-16 px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Why Choose Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">News Summarizer</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200 mb-8">
            Transform how you consume information with our AI-powered platform that makes staying informed faster, easier, and more engaging.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/pdfreader" className="group bg-cyan-600 hover:bg-cyan-500 px-8 py-3 rounded-lg transition-all duration-300 inline-flex items-center">
              <span className="font-medium">Try PDF Upload</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/photoreader" className="group bg-gray-800 hover:bg-gray-700 border border-cyan-700 px-8 py-3 rounded-lg transition-all duration-300 inline-flex items-center">
              <span className="font-medium">Try Photo Upload</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Benefits Grid with Improved Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {benefits.map((benefit, index) => (
          <div key={index} className="group bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 transition-all duration-300 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20">
            <div className="mb-6 p-3 bg-gray-800 rounded-lg inline-block">
              {benefit.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">{benefit.title}</h3>
            <p className="text-gray-300">{benefit.description}</p>
          </div>
        ))}
      </div>

      {/* Testimonial/Stats Section */}
      {/* <div className="w-full max-w-6xl mt-20 mb-16">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-10 text-center">Why Our Users Love Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-cyan-400 mb-2">75%</p>
                <p className="text-gray-300">Time saved on daily news consumption</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-cyan-400 mb-2">93%</p>
                <p className="text-gray-300">Users report better information retention</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-cyan-400 mb-2">24/7</p>
                <p className="text-gray-300">Access to news summaries anytime, anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Use Cases Section with Icons */}
      <div className="w-full max-w-6xl mb-16 mt-8">
        <h2 className="text-3xl font-bold text-center mb-10">Perfect For</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Busy Professionals */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 transition-all duration-300 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20">
            <div className="flex items-start">
              <div className="bg-cyan-900/50 p-4 rounded-lg mr-5">
                <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Busy Professionals</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-cyan-400 mt-0.5" />
                    <span>Stay informed during tight schedules</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-cyan-400 mt-0.5" />
                    <span>Listen to summaries during commutes</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-cyan-400 mt-0.5" />
                    <span>Get industry news without the fluff</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Students & Researchers */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 transition-all duration-300 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20">
            <div className="flex items-start">
              <div className="bg-cyan-900/50 p-4 rounded-lg mr-5">
                <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Students</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-cyan-400 mt-0.5" />
                    <span>Quickly digest complex articles</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-cyan-400 mt-0.5" />
                    <span>Extract key points from research papers</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-cyan-400 mt-0.5" />
                    <span>Save study time with audio summaries</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section with Numbers */}
      <div className="w-full max-w-6xl mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-purple-500 hidden md:block"></div>
          
          <div className="space-y-16 relative">
            {/* Step 1 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:text-right mb-8 md:mb-0">
                <h3 className="text-2xl font-bold mb-3">Upload Your Content</h3>
                <p className="text-gray-300 max-w-md ml-auto">Upload your newspaper PDF or snap a photo of an article with your smartphone or tablet.</p>
              </div>
              <div className="flex justify-center md:justify-start">
                <div className="relative">
                  <div className="absolute -inset-4 bg-cyan-600/20 rounded-full blur-lg"></div>
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold relative z-10">1</div>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="flex justify-center md:justify-end order-last md:order-first">
                <div className="relative">
                  <div className="absolute -inset-4 bg-purple-600/20 rounded-full blur-lg"></div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-700 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold relative z-10">2</div>
                </div>
              </div>
              <div className="mb-8 md:mb-0">
                <h3 className="text-2xl font-bold mb-3">AI Processing</h3>
                <p className="text-gray-300 max-w-md">Our advanced AI analyzes the content, identifies key information, and generates a concise, accurate summary.</p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:text-right mb-8 md:mb-0">
                <h3 className="text-2xl font-bold mb-3">Listen & Read</h3>
                <p className="text-gray-300 max-w-md ml-auto">Get text summaries and natural voice narration instantly. Save, share, or listen on any device.</p>
              </div>
              <div className="flex justify-center md:justify-start">
                <div className="relative">
                  <div className="absolute -inset-4 bg-cyan-600/20 rounded-full blur-lg"></div>
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold relative z-10">3</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section with Glow */}
      <div className="w-full max-w-4xl my-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/40 to-purple-900/40 rounded-2xl blur-xl"></div>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-12 rounded-2xl border border-cyan-700 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your News Experience?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join us  and stay better informed with our AI-powered news summarization service.
            </p>
            <Link href="/" className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 px-8 py-4 rounded-lg transition-all duration-300 text-lg font-medium shadow-lg shadow-cyan-600/30 hover:shadow-cyan-500/40">
              <span>Get Started Now</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}