"use client"

import { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../service/firebaseconfig";
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { SummaryOfNews } from '@/store/SummarySlice';

const SummaryList = () => {
  const [loading, setLoading] = useState(false);
  const [hasSummaries, setHasSummaries] = useState(false);
  const userId = useSelector(state => state.user)["userDetail"][0];
  const dispatch = useDispatch();
  const router = useRouter();
  const [allSummaries, setAllSummaries] = useState([]);

  const handleViewSummaries = async () => {
    try {
      setLoading(true);
      const userDocRef = doc(firestore, "users", userId);
      const userSnap = await getDoc(userDocRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const summaries = userData.summaries || [];
        if (summaries.length === 0) {
          setHasSummaries(false);
          return;
        }
        setAllSummaries(summaries);
        setHasSummaries(true);
      }
    } catch (error) {
      console.error("Error fetching summaries:", error);
      setHasSummaries(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSummaries = async () => {
      await handleViewSummaries();
    };
    
    fetchSummaries();
  }, []);

  const handleSingleViewSummary = async(i) => {
    dispatch(SummaryOfNews(allSummaries[i]["newSummaries"]));
    router.push("/summary");
  };

  const handleRedirectToPdfReader = () => {
    router.push('/pdfreader');
  };

  return (
    <div className="mt-8 w-full max-w-3xl">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="font-display text-xl font-semibold text-cyan-400 mb-4">
          Your Summaries
        </h2>
        
        {hasSummaries === false ? (
          <div className="text-center">
            <p className="font-sans text-gray-300 mb-4">
              No summaries exist yet.
            </p>
            <button
              onClick={handleRedirectToPdfReader}
              className="font-sans px-6 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg transition-all duration-300
              hover:border-cyan-400 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              Create Your First Summary
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {Array.from({ length: allSummaries.length }, (_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black rounded border border-gray-700">
                  <span className="font-sans text-gray-300">
                    Summary {i + 1}
                  </span>
                  <button
                    onClick={() => handleSingleViewSummary(i)}
                    disabled={loading}
                    className="font-sans px-4 py-1 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg text-sm transition-all duration-300
                    hover:border-cyan-400 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SummaryList;