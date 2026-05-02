"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { Brain, ArrowRight, Mail, Lock, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google login failed");

      await refreshUser();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-[2.5rem] border border-indigo-100 shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-7 h-7" />
              </div>
            </Link>
            <h1 className="text-3xl font-black text-indigo-950 tracking-tight">Welcome Back</h1>
            <p className="text-indigo-900/50 font-bold mt-2">Sign in to your neural workspace</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-indigo-900/40 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-5 py-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-indigo-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-indigo-900/40 uppercase tracking-widest">Password</label>
                <Link href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-5 py-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-indigo-200"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-4 rounded-2xl text-lg font-black transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group mt-8"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-indigo-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-indigo-900/30 font-black uppercase tracking-widest">Secure Entry</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="flex justify-center mb-10">
            <div className="w-full max-w-[280px]">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Authentication Failed")}
                theme="outline"
                shape="pill"
                text="continue_with"
                width="280"
              />
            </div>
          </div>

          {/* Footer Link */}
          <p className="text-center text-sm font-bold text-indigo-900/40">
            New to NeuroTrack?{" "}
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 transition-colors font-black underline underline-offset-4 decoration-2">
              Create Account
            </Link>
          </p>
        </div>
        
        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-indigo-900/30 text-[10px] font-black uppercase tracking-[0.2em]">
          <Sparkles className="w-3 h-3" />
          End-to-end Encrypted Workspace
        </div>
      </motion.div>
    </div>
  );
}
