import { Brain } from "lucide-react";

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

          {/* Bottom Bar */}
          <div className="w-full pt-10 border-t border-indigo-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm font-bold text-indigo-900/30">
              &copy; {new Date().getFullYear()} NeuroTrack AI.
            </p>
            <div className="text-sm font-bold text-indigo-900/40">
              Built by <span className="text-indigo-600">Navya Shaji</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
