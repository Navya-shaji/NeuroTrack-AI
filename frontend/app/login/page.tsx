"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { login } from "@/actions/auth";
import { authClient } from "@/lib/auth-client";
import { Brain, ArrowRight, Mail, Lock, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [googlePending, setGooglePending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await login(email, password);
      if (result.error) {
        setError(result.error);
        return;
      }
      // Sync client-side user state from the session
      const session = await authClient.getSession();
      if (session.data?.user) {
        setUser({
          id: session.data.user.id,
          name: session.data.user.name,
          email: session.data.user.email,
          image: session.data.user.image,
        });
      }
      router.push("/dashboard");
      router.refresh();
    });
  };

  const handleGoogleLogin = async () => {
    setGooglePending(true);
    setError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Google login failed");
      setError(error.message);
      setGooglePending(false);
    }
  };

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

          {/* Error */}
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
              <label className="text-xs font-black text-indigo-900/40 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  suppressHydrationWarning
                  className="w-full pl-12 pr-5 py-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-indigo-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-indigo-900/40 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  suppressHydrationWarning
                  className="w-full pl-12 pr-5 py-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-indigo-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              suppressHydrationWarning
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-4 rounded-2xl text-lg font-black transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group mt-8 disabled:opacity-60 disabled:scale-100"
            >
              {isPending ? (
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
              <div className="w-full border-t border-indigo-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-indigo-900/30 font-black uppercase tracking-widest">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googlePending}
            suppressHydrationWarning
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-indigo-100 rounded-2xl text-sm font-bold text-indigo-900/70 hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm disabled:opacity-60 mb-10"
          >
            {googlePending ? (
              <div className="w-5 h-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-center text-sm font-bold text-indigo-900/40">
            New to NeuroTrack?{" "}
            <Link
              href="/signup"
              className="text-indigo-600 hover:text-indigo-700 transition-colors font-black underline underline-offset-4 decoration-2"
            >
              Create Account
            </Link>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-indigo-900/30 text-[10px] font-black uppercase tracking-[0.2em]">
          <Sparkles className="w-3 h-3" />
          End-to-end Encrypted Workspace
        </div>
      </motion.div>
    </div>
  );
}
