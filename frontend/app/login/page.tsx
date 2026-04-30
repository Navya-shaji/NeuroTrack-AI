"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";

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
      router.push("/");
    } catch (err: any) {
      setError(err.message);
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
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative overflow-hidden bg-white">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-50/50 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-xl border border-purple-100 rounded-3xl p-10 shadow-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-purple-900">Welcome back</h2>
            <p className="mt-3 text-sm text-purple-900/40 font-bold">Sign in to access your dashboard</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-purple-50 border border-purple-100 text-purple-600 p-4 rounded-xl text-sm text-center font-extrabold">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-purple-900/60 mb-2">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-2xl border border-purple-100 bg-purple-50/20 py-3.5 px-5 text-purple-900 font-bold shadow-sm ring-1 ring-inset ring-purple-100/50 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 placeholder:text-purple-200 transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-bold text-purple-900/60 mb-2">
                  Password
                </label>
                <Link href="#" className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-2xl border border-purple-100 bg-purple-50/20 py-3.5 px-5 text-purple-900 font-bold shadow-sm ring-1 ring-inset ring-purple-100/50 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 placeholder:text-purple-200 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-2xl bg-purple-600 px-4 py-4 text-sm font-bold leading-6 text-white shadow-lg shadow-purple-100 hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50 transition-all hover:shadow-purple-200 active:scale-[0.98] mt-8"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Sign in to Dashboard"}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-purple-900/40 font-bold">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Login Failed")}
                theme="outline"
                shape="pill"
                text="continue_with"
                width="350"
              />
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-purple-900/40 font-bold">
            Don't have an account?{" "}
            <Link href="/signup" className="font-extrabold leading-6 text-purple-600 hover:text-purple-700 transition-colors underline underline-offset-4">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

