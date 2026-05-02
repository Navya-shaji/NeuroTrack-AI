import { Brain, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white pt-20 pb-10 border-t border-indigo-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-indigo-950">
              NeuroTrack <span className="text-indigo-600">AI</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-12">
            {['Product', 'Features', 'Insights', 'Privacy', 'Contact'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-sm font-bold text-indigo-900/40 hover:text-indigo-600 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Socials */}
          <div className="flex items-center gap-6 mb-12">
            <a 
              href="https://github.com/Navya-shaji"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400 hover:bg-indigo-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="https://linkedin.com/in/navya-shaji"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400 hover:bg-indigo-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a 
              href="mailto:hello@neurotrack.ai"
              className="h-12 w-12 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400 hover:bg-indigo-600 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Bottom Bar */}
          <div className="w-full pt-10 border-t border-indigo-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm font-bold text-indigo-900/30">
              &copy; {new Date().getFullYear()} NeuroTrack AI. Built for the future of learning.
            </p>
            <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-900/40">
              Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" /> by <span className="text-indigo-600">Navya Shaji</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
