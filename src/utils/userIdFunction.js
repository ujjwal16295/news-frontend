"use client";

import { auth, firestore } from "@/service/firebaseconfig";
import { ChangeUserid } from "@/store/UserSlice";
import { useEffect, useState } from "react"; // Added useState
import { useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore";

const AuthListener = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null); // Added state for user data

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        const userDocRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data); // Store the data in useState
          
          // Add the service value from userData to the array in ChangeUserid
          dispatch(ChangeUserid([user.uid, user.email, user.displayName, data.service]));
        } else {
          console.error("No user data found");
          dispatch(ChangeUserid([user.uid, user.email, user.displayName, null]));
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error.message);
        dispatch(ChangeUserid([user.uid, user.email, user.displayName, null]));
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user);
      } else {
        sessionStorage.clear();
        setUserData(null);
        dispatch(ChangeUserid([null, null, null, null]));
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default AuthListener;
