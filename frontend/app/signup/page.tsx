"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [name, setName] = useState("");
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

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
            <h2 className="text-3xl font-extrabold tracking-tight text-purple-900">Create account</h2>
            <p className="mt-3 text-sm text-purple-900/40 font-bold">Join NeuroTrack AI and optimize your studies.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-purple-50 border border-purple-100 text-purple-600 p-4 rounded-xl text-sm text-center font-extrabold">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-bold text-purple-900/60 mb-2">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-2xl border border-purple-100 bg-purple-50/20 py-3.5 px-5 text-purple-900 font-bold shadow-sm ring-1 ring-inset ring-purple-100/50 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 placeholder:text-purple-200 transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
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
              <label htmlFor="password" className="block text-sm font-bold text-purple-900/60 mb-2">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
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
              ) : "Create Free Account"}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-purple-900/40 font-bold">
            Already have an account?{" "}
            <Link href="/login" className="font-extrabold leading-6 text-purple-600 hover:text-purple-700 transition-colors underline underline-offset-4">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

