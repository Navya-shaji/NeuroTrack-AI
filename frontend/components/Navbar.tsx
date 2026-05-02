"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, X, LogIn, LogOut, LayoutDashboard, User as UserIcon, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    ...(user ? [{ name: "Dashboard", href: "/dashboard" }] : []),
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "py-3" : "py-5"
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`relative flex items-center justify-between rounded-2xl transition-all duration-500 px-6 py-2 ${
          scrolled ? "glass shadow-[0_8px_32px_rgba(79,70,229,0.1)] border-indigo-100/50" : "bg-transparent border-transparent"
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-all duration-300">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-indigo-950">
              NeuroTrack <span className="text-indigo-600">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className={`px-4 py-2 text-sm font-bold transition-all rounded-xl ${
                  pathname === link.href 
                    ? "text-indigo-600 bg-indigo-50/50" 
                    : "text-indigo-900/60 hover:text-indigo-950 hover:bg-indigo-50/30"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-4 w-px bg-indigo-100 mx-3" />
            
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-900/60 hover:text-indigo-950 transition-all rounded-xl hover:bg-indigo-50"
                  >
                    <UserIcon className="w-4 h-4 text-indigo-600" />
                    {user.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all rounded-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-indigo-900/60 hover:text-indigo-950 transition-all rounded-xl hover:bg-indigo-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-95"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="md:hidden absolute top-full left-0 right-0 p-4"
          >
            <div className="glass rounded-3xl p-6 shadow-2xl border border-indigo-100/50 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className={`block text-lg font-bold transition-colors ${
                    pathname === link.href ? "text-indigo-600" : "text-indigo-950 hover:text-indigo-600"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px w-full bg-indigo-100 my-4" />
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-black text-indigo-950">{user.name}</div>
                      <div className="text-xs text-indigo-900/50">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-4 text-sm font-bold text-rose-600 bg-rose-50 rounded-2xl"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 px-4 py-4 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-2xl"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center justify-center gap-2 px-4 py-4 text-sm font-bold text-white bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
