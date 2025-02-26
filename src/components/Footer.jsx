"use client"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6">
      <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center">
        <p className="font-display text-lg font-semibold tracking-wide">
          Thank You
        </p>
        
        <div className="mt-4 flex space-x-6">
          <a 
            href="/policy" 
            className="font-sans hover:text-cyan-400 transition-colors duration-300"
          >
            Privacy Policy
          </a>
          <a 
            href="/terms" 
            className="font-sans hover:text-cyan-400 transition-colors duration-300"
          >
            Terms of Service
          </a>
          {/* <a 
            href="#" 
            className="font-sans hover:text-cyan-400 transition-colors duration-300"
          >
            Contact
          </a> */}
        </div>

        <p className="mt-4 text-sm text-gray-500 font-sans">
          &copy; {new Date().getFullYear()} NewsEcho. All rights reserved.
        </p>
      </div>
    </footer>
  );
}