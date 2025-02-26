"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore, auth } from "../../service/firebaseconfig";
import { withPrivateRouteProtection } from "@/utils/authProtection";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import SummaryList from "@/components/SummaryList";
import { toast, Toaster } from "sonner";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const email = useSelector(state => state.user)["userDetail"][1];
  const name = useSelector(state => state.user)["userDetail"][2];
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        const userDocRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        
        if (userSnap.exists()) {
          setUserData(userSnap.data());
          toast.success("User data loaded successfully");
        } else {
          toast.error("No user data found");
        }
      } catch (error) {
        toast.error("Failed to fetch user data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setLoading(false);
        toast.error("No authenticated user found");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout: " + error.message);
    }
  };

  if (loading) return (
    <>
      <Toaster richColors position="top-center" />
      <p className="text-body text-center mt-10">Loading...</p>
    </>
  );

  if (!userData) return (
    <>
      <Toaster richColors position="top-center" />
      <p className="text-body text-center mt-10">No user data found.</p>
    </>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6 my-5">
      <Toaster richColors position="top-center" />
      <h1 className="heading-large text-cyan-400 mb-6">User Dashboard</h1>
      <div className="w-full max-w-3xl">
        <table className="w-full border-collapse border border-gray-700 text-white font-sans">
          <tbody>
            <tr className="bg-gray-900 border-b border-gray-700">
              <td className="p-4 text-marker">Email</td>
              <td className="p-4 text-body">{email}</td>
            </tr>
            <tr className="bg-gray-900 border-b border-gray-700">
              <td className="p-4 text-marker">Name</td>
              <td className="p-4 text-body">{name}</td>
            </tr>
            <tr className="bg-gray-900 border-b border-gray-700">
              <td className="p-4 text-marker">Service</td>
              <td className="p-4 text-body">{userData.service}</td>
            </tr>
            {(userData.start_date && userData.service!="free") && (
              <tr className="bg-gray-900 border-b border-gray-700">
                <td className="p-4 text-marker">Start Date</td>
                <td className="p-4 text-body">{userData.start_date.toDate().toLocaleDateString()}</td>
              </tr>
            )}
            {(userData.end_date&& userData.service!="free") && (
              <tr className="bg-gray-900 border-b border-gray-700">
                <td className="p-4 text-marker">End Date</td>
                <td className="p-4 text-body">{userData.end_date.toDate().toLocaleDateString()}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <SummaryList />

      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-3 bg-gray-900 border border-gray-700 font-display rounded-lg transition-all duration-300 
        hover:border-cyan-400 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
      >
        Logout
      </button>
    </div>
  );
}

export default withPrivateRouteProtection(Dashboard);