// "use client";
// import { withPrivateRouteProtection } from "@/utils/authProtection";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { CheckCircle2, Loader2, AlertCircle, Home } from "lucide-react";

// function Success() {
//   const [loading, setLoading] = useState(true);
//   const [sessionId, setSessionId] = useState(null);
//   const [sessionDetails, setSessionDetails] = useState(null);
//   const userId = useSelector(state => state.user)["userDetail"][0];
//   const email = useSelector(state => state.user)["userDetail"][1];
//   const router = useRouter();

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const session_id = urlParams.get("session_id");
    
//     if (session_id) {
//       setSessionId(session_id);
//       fetchSessionDetails(session_id);
//     } else {
//       router.push("/");
//     }
//   }, []);

//   const fetchSessionDetails = async (session_id) => {
//     try {
//       const response = await fetch("http://localhost:4000/api/stripe/get-session-details", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ sessionId: session_id, userId: userId }),
//       });

//       const data = await response.json();
//       setSessionDetails(data);
//     } catch (error) {
//       console.error("Error fetching session details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//GAP


"use client";
import { withPrivateRouteProtection } from "@/utils/authProtection";
import { useSelector } from "react-redux";
import { CheckCircle2 } from "lucide-react";

function Success() {
  const email = useSelector(state => state.user)["userDetail"][1];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md bg-gradient-to-b from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-cyan-400 rounded-full blur opacity-25"></div>
              <CheckCircle2 className="w-16 h-16 text-cyan-400 relative animate-bounce" />
            </div>
            <h1 className="heading-large mt-4 text-center">
              Payment Successful!
            </h1>
            <p className="text-body mt-2 text-center">
            Thank you for choosing our service. We have sent you the invoice via email. Please check your inbox.            </p>
          </div>

          <div className="space-y-4 bg-gray-900/50 p-6 rounded-xl border border-gray-700/50">
            <div className="space-y-3 font-sans">
              <div className="flex justify-between items-center">
                <span className="text-body">Email</span>
                <span className="text-marker">
                  {email || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <button
            className="font-sans w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-800 
                      text-cyan-400 rounded-xl transition-all duration-300 
                      hover:bg-gray-700 hover:shadow-lg hover:shadow-cyan-500/20
                      focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={() => (window.location.href = "/settings")}
          >
            <span>Go to Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default withPrivateRouteProtection(Success);