"use client";

import { firestore } from '@/service/firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';

const SubscriptionNotice = () => {
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [subscriptionDate, setSubDate] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [hasSeenNotice, setHasSeenNotice] = useState(true);
  const userId = useSelector(state => state.user)["userDetail"][0];
  
  useEffect(() => {
    const hasSeenInSession = sessionStorage.getItem('hasSeenSubscriptionNotice');
    setHasSeenNotice(!!hasSeenInSession);
  }, []);
  
  useEffect(() => {
    const fetchSubscriptionDate = async () => {
      if (!userId) return;
      
      try {
        const userDoc = await getDoc(doc(firestore, "users", userId));
        if (userDoc.exists()) {
          const subscriptionDate = userDoc.data().end_date;
          setSubDate(subscriptionDate);
        }
      } catch (error) {
        console.error("Error fetching subscription date:", error);
      }
    };
    
    fetchSubscriptionDate();
  }, [userId]);
  
  useEffect(() => {
    if (!subscriptionDate) return;
    
    const subDate = subscriptionDate.toDate();
    const today = new Date();
    const diffTime = subDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
    setDaysRemaining(diffDays);
  }, [subscriptionDate]);
  
  const handleClose = () => {
    setIsClosing(true);
    sessionStorage.setItem('hasSeenSubscriptionNotice', 'true');
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };
  
  if (!daysRemaining || daysRemaining > 10 || !isVisible || hasSeenNotice) return null;
  
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform
         ${isClosing ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
    >
      <div className="bg-gray-900 text-white border-b border-gray-700 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            <div className="flex items-center space-x-2">
              <span className="text-cyan-400">⚠️</span>
              <p className="font-sans text-sm md:text-base">
                {daysRemaining <= 0 ? null : "Your subscription will expire in "}
                <span className="font-display font-bold text-cyan-400">
                  {daysRemaining <= 0 
                    ? "Your plan has been expired" 
                    : `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}`}
                </span>
              </p>
              <a
                href="/pricing"
                className="font-sans ml-4 px-4 py-1 text-sm bg-gray-800 text-cyan-400 rounded-full hover:bg-gray-700 transition-colors duration-200"
              >
                Renew Now
              </a>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-800 rounded-full transition-colors duration-200 text-gray-400 hover:text-cyan-400"
                aria-label="Close notification"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionNotice;