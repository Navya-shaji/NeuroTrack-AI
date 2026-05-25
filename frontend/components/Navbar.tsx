"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    // Set mounted state after initial render to avoid hydration issues
    const timer = setTimeout(() => setMounted(true), 0);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    ...(user ? [{ name: "Dashboard", href: "/dashboard" }] : []),
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
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
                    onClick={logout}
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

          {/* Mobile menu button — only rendered after mount to avoid hydration mismatch */}
          {mounted && (
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center rounded-xl p-2 text-indigo-600 hover:bg-indigo-50 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mounted && isOpen && (
          <div className="md:hidden mt-2 glass rounded-2xl border border-indigo-100 shadow-lg px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 text-sm font-bold text-indigo-900/70 hover:text-indigo-950 hover:bg-indigo-50 rounded-xl transition-all"
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-indigo-100 pt-2 mt-2">
              {user ? (
                <button
                  onClick={() => { setIsOpen(false); logout(); }}
                  className="w-full text-left px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >
                  Sign Out
                </button>
              ) : (
                <div className="space-y-1">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm font-bold text-indigo-900/70 hover:bg-indigo-50 rounded-xl transition-all">
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all text-center">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
