"use client";

import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Terms of Service</h1>
        <p className="text-gray-300 mb-4">
          Last Updated: February 25, 2025
        </p>
        <p className="mb-6">
          Welcome to NewsEcho! By using our website, you agree to these Terms of Service. Please read them carefully.
        </p>
        
        <h2 className="text-2xl text-blue-500 mt-8 mb-3">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing or using NewsEcho, you agree to be bound by these terms. If you do not agree, please do not use our services.
        </p>
        
        <h2 className="text-2xl text-blue-500 mt-8 mb-3">2. Description of Service</h2>
        <p className="mb-4">
          NewsEcho provides AI-powered news summarization and text-to-speech services for PDFs and images. The summaries and voice narrations are generated automatically and may not always be 100% accurate.
        </p>
        
        <h2 className="text-2xl text-blue-500 mt-8 mb-3">3. User Responsibilities</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>You must not upload copyrighted, illegal, or harmful content.</li>
          <li>You agree to use the service only for lawful purposes.</li>
          <li>You are responsible for maintaining the security of your account ny not sharing your password.</li>
        </ul>
        
        <h2 className="text-2xl text-blue-500 mt-8 mb-3">4. Payments and Subscriptions</h2>
        <p className="mb-4">
          Some features may require a paid subscription. Payments are handled via Paddle.
          There is no refund policy for any product
        </p>
        
        <h2 className="text-2xl text-blue-500 mt-8 mb-3">5. Limitation of Liability</h2>
        <p className="mb-4">
          NewsEcho is provided "as is." We are not responsible for any inaccuracies, errors, or losses resulting from the use of our service.
        </p>
        
        <h2 className="text-2xl text-blue-500 mt-8 mb-3">6. Modifications</h2>
        <p className="mb-4">
          We reserve the right to update these terms at any time. Continued use of NewsEcho after changes means you accept the new terms.
        </p>
        
        <h2 className="text-2xl text-blue-500 mt-8 mb-3">7. Contact Us</h2>
        <p className="mb-8">
          For any questions about these terms, contact us at ujjwal.chandra.patel@gmail.com.
        </p>
        
        <div className="border-t border-gray-700 pt-6 mt-8">
          <p className="text-gray-400 text-sm">
            By using NewsEcho, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="/policy" className="text-blue-400 hover:text-blue-300 hover:underline text-sm">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}