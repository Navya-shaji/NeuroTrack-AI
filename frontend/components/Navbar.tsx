"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { User, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await refreshUser();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isMounted) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 tracking-tight">
                NeuroTrack AI
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6 text-sm font-bold text-purple-900/70">
              <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
              <Link href="/dashboard" className="hover:text-purple-600 transition-colors">Dashboard</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-900">
                  <User className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-bold">Hello, {user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-purple-900/60 hover:text-purple-600 hover:bg-purple-50 transition-all font-bold text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-purple-900/70 hover:text-purple-600 transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" className="text-sm font-bold px-6 py-2.5 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-md shadow-purple-100 hover:shadow-purple-200 hover:scale-[1.02] active:scale-[0.98]">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button className="text-purple-300 hover:text-purple-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
