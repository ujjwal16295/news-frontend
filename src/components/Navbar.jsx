"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "../service/firebaseconfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const getLinkStyles = (path) => {
    const isActive = pathname === path;
    const baseStyles = "font-sans transition-all duration-300 relative";
    const activeStyles = "text-cyan-400 font-semibold text-lg";
    const inactiveStyles = "text-gray-300 hover:text-cyan-400";
    
    return `${baseStyles} ${isActive ? activeStyles : inactiveStyles} ${
      isActive ? "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-cyan-400" : ""
    }`;
  };

  const getLinkStylesSettings = (path) => {
    const isActive = pathname === path;
    const baseStyles = "font-sans transition-all duration-300 relative";
    const activeStyles = "text-cyan-400 font-semibold text-lg";
    const inactiveStyles = "text-gray-300 hover:text-cyan-400";
  
    return `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`;
  };

  const getMobileLinkStyles = (path) => {
    const isActive = pathname === path;
    const baseStyles = "font-sans block transition-colors duration-300";
    const activeStyles = "text-cyan-400 font-semibold text-lg";
    const inactiveStyles = "text-gray-300 hover:text-cyan-400";
    
    return `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`;
  };

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        
        {/* Left: Logo */}
        <a href="#" className="flex items-center space-x-3">
          {/* <img src="/apple-touch-icon.png" className="h-8" alt="Logo" /> */}
          <span className="self-center text-3xl font-display font-semibold text-white">
          NewsEcho
          </span>
        </a>

        {/* Center: Desktop Nav Links */}
        <div className="hidden md:flex md:items-center md:space-x-8 mx-auto">
          <Link href="/" className={getLinkStyles("/")}>Home</Link>
          <Link href="/whytouse" className={getLinkStyles("/whytouse")}>Why To Use</Link>
          <Link href="/pdfreader" className={getLinkStyles("/pdfreader")}>PDF Reader</Link>
          <Link href="/photoreader" className={getLinkStyles("/photoreader")}>Photo Reader</Link>
          <Link href="/pricing" className={getLinkStyles("/pricing")}>Pricing</Link>
        </div>

        {/* Right: User Profile or Login */}
        <div className="hidden md:flex items-center relative">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex text-sm bg-gray-900 rounded-full p-2 focus:ring-4 focus:ring-gray-700"
              >
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"/>
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-gray-900 rounded-lg shadow-lg w-40 p-2 z-50">
                  <p className="font-sans text-gray-300 text-sm px-3">
                    {user.displayName || "User"}
                  </p>
                  <hr className="my-2 border-gray-700" />
                  <Link href="/settings" className={`block px-4 py-2 ${getLinkStylesSettings("/settings")}`}>
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="font-sans block w-full text-left px-4 py-2 text-gray-300 hover:text-red-400"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="font-sans bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Log In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 w-10 h-10 text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-700"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 text-gray-300 py-2 space-y-2 px-4">
          <Link href="/" className={getMobileLinkStyles("/")}>Home</Link>
          <Link href="/whytouse" className={getMobileLinkStyles("/whytouse")}>Why To Use</Link>
          <Link href="/pdfreader" className={getMobileLinkStyles("/pdfreader")}>PDF Reader</Link>
          <Link href="/photoreader" className={getMobileLinkStyles("/photoreader")}>Photo Reader</Link>
          <Link href="/pricing" className={getMobileLinkStyles("/pricing")}>Pricing</Link>


          <div className="border-t border-gray-700 pt-2 mt-2">
            {user ? (
              <>
                <Link href="/settings" className={getMobileLinkStyles("/settings")}>Settings</Link>
                <button
                  onClick={handleLogout}
                  className="font-sans block w-full text-left py-2 text-gray-300 hover:text-red-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className={getMobileLinkStyles("/login")}>Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;