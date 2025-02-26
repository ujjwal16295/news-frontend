
"use client";

import { useState } from "react";
import { auth, googleProvider, firestore } from "../../service/firebaseconfig";
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { withPublicRouteProtection } from "@/utils/authProtection";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetError, setResetError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        await setDoc(userDoc, {
          service: "free",
          news_generation_count: 3,
          voice_generation_count: 0,
          email: user.email
        });
      }

      toast.success("Login successful!");
      router.push("/");
    } catch (error) {
      console.error("Login Error:", error.message);
      
      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many login attempts. Please try again later");
      } else {
        toast.error("Failed to login. Please try again");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      const userDoc = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        await setDoc(userDoc, {
          service: "free",
          news_generation_count: 3,
          voice_generation_count: 0,
          email: user.email
        });
      }

      toast.success("Google login successful!");
      router.push("/");
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Login cancelled. Please try again");
      } else {
        toast.error("Failed to login with Google. Please try again");
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setResetError("Please enter your email address first");
      toast.error("Please enter your email address first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setResetError("");
      toast.success("Password reset email sent! Check your inbox");
    } catch (error) {
      const errorMessage = "Failed to send reset email. Please check your email address.";
      setResetError(errorMessage);
      toast.error(errorMessage);
      console.error("Password Reset Error:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg w-96 text-center border border-white/20">
        <h1 className="font-display text-3xl font-semibold mb-4 text-white">Login</h1>
        <p className="font-sans text-gray-400 mb-6">Welcome back! Please enter your details.</p>
        
        <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
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
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="font-sans text-sm text-blue-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          
          {resetEmailSent && (
            <p className="font-sans text-green-400 text-sm">
              Password reset email sent! Check your inbox.
            </p>
          )}
          {resetError && (
            <p className="font-sans text-red-400 text-sm">{resetError}</p>
          )}
          
          <button type="submit" className="font-sans bg-blue-500 hover:bg-blue-600 transition p-3 rounded text-white font-semibold">
            Login
          </button>
        </form>

        <div className="mt-4">
          <p className="font-sans text-gray-400 text-sm">Or login with</p>
          <button
            onClick={handleGoogleLogin}
            className="font-sans bg-red-500 hover:bg-red-600 transition p-3 rounded text-white font-semibold w-full mt-2 flex items-center justify-center"
          >
            <img src="/icons8-google.svg" alt="Google" className="w-5 h-5 mr-2" />
            Login with Google
          </button>
        </div>

        <p className="font-sans text-gray-500 text-sm mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default withPublicRouteProtection(Login);