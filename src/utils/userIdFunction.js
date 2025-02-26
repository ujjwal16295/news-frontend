"use client";

import { auth } from "@/service/firebaseconfig";
import { ChangeUserid } from "@/store/UserSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const AuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(ChangeUserid([user.uid,user.email,user.displayName]));
      } else {
        sessionStorage.clear();
        dispatch(ChangeUserid([null,null,null]));
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default AuthListener;
