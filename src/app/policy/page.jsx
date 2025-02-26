"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Privacy Policy</h1>
        <p className="text-gray-300 mb-4">
          Last Updated: February 25, 2025
        </p>
        <p className="mb-6">
          Your privacy is important to us. This policy explains how we collect, use, and protect your data.
        </p>
        
        <h2 className="text-2xl text-blue-500 mt-8 mb-3">1. Information We Collect</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><span className="font-medium">Personal Information:</span> If you sign up or make a payment, we may collect your name, email, and payment details.</li>
          <li><span className="font-medium">Uploaded Content:</span> PDFs and images uploaded for summarization are processed but not stored permanently.</li>
          <li><span className="font-medium">Usage Data:</span> We collect analytics on how users interact with our service to improve performance.</li>
        </ul>
        
        <h2 className="text-2xl text-blue-500 mt-8 mb-3">2. How We Use Your Data</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>To provide and improve our summarization and voice services.</li>
          <li>To process payments for subscriptions.</li>
          <li>To analyze usage trends and enhance user experience.</li>
        </ul>
        
        <h2 className="text-2xl text-blue-500 mt-8 mb-3">3. Data Sharing and Storage</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>We do not sell or share your personal data with third parties.</li>
          <li>Payment processing is handled by Paddle, and we do not store payment details.</li>
          <li>Uploaded content is temporarily stored for processing and deleted after completion.</li>
        </ul>
        
        <h2 className="text-2xl text-blue-500 mt-8 mb-3">4. Cookies and Tracking</h2>
        <p className="mb-4">
          We may use cookies to enhance user experience and track analytics. You can disable cookies in your browser settings.
        </p>
        
        <h2 className="text-2xl text-blue-500 mt-8 mb-3">5. Security</h2>
        <p className="mb-4">
          We implement security measures to protect user data, but no system is 100% secure. Use our service at your own risk.
        </p>
        
        <h2 className="text-2xl text-blue-500 mt-8 mb-3">6. Your Rights</h2>
        <p className="mb-4">
          You can request data deletion or access to your information by contacting us at ujjwal.chandra.patel@gmail.com.
        </p>
        
        <h2 className="text-2xl text-blue-500 mt-8 mb-3">7. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy. Changes will be posted on this page.
        </p>
        
        <h2 className="text-2xl text-blue-500 mt-8 mb-3">8. Contact Us</h2>
        <p className="mb-8">
          For privacy concerns, email us at ujjwal.chandra.patel@gmail.com.
        </p>
        
        <div className="border-t border-gray-700 pt-6 mt-8">
          <div className="flex gap-4 mt-4">
            <Link href="/terms" className="text-blue-400 hover:text-blue-300 hover:underline text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}