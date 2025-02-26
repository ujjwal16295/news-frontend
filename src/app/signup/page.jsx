"use client";

import { useState } from "react";
import { auth, googleProvider, firestore } from "../../service/firebaseconfig";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { withPublicRouteProtection } from "@/utils/authProtection";
import { toast } from "sonner";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const createUserDoc = async (userId, userEmail, userName) => {
    try {
      const userDoc = doc(firestore, "users", userId);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        await setDoc(userDoc, {
          service: "free",
          news_generation_count: 3,
          voice_generation_count: 0,
          email: userEmail,
          name: userName
        });
      }
    } catch (error) {
      console.error("Error creating user document:", error.message);
      throw error; // Propagate error to be handled by the calling function
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: name
      });

      await createUserDoc(user.uid, user.email, name);
      
      toast.success("Account created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Signup Error:", error.message);
      let errorMessage = "Failed to create account";
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "Email is already registered";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Email/password accounts are not enabled";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak";
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      await createUserDoc(user.uid, user.email, user.displayName);
      
      toast.success("Successfully signed up with Google!");
      router.push("/");
    } catch (error) {
      console.error("Google Sign-Up Error:", error.message);
      let errorMessage = "Failed to sign up with Google";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-up cancelled - popup was closed";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked by the browser";
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg w-96 text-center border border-white/20">
        <h1 className="heading-large mb-4">Sign Up</h1>
        <p className="text-body mb-6">Create an account to get started!</p>
        <form className="flex flex-col space-y-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            className="font-sans p-3 bg-white/10 border border-white/30 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="font-sans p-3 bg-white/10 border border-white/30 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="font-sans p-3 bg-white/10 border border-white/30 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="font-sans bg-blue-500 hover:bg-blue-600 transition p-3 rounded text-white font-semibold">
            Sign Up
          </button>
        </form>
        <div className="mt-4">
          <p className="text-body text-sm">Or sign up with</p>
          <button
            onClick={handleGoogleSignup}
            className="font-sans bg-red-500 hover:bg-red-600 transition p-3 rounded text-white font-semibold w-full mt-2 flex items-center justify-center"
          >
            <img src="/icons8-google.svg" alt="Google" className="w-5 h-5 mr-2" />
            Sign Up with Google
          </button>
        </div>
        <p className="text-body text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default withPublicRouteProtection(Signup);