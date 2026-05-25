"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Brain, 
  Clock, 
  BarChart3, 
  Sparkles, 
  ArrowRight
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center font-sans bg-mesh min-h-screen selection:bg-indigo-100 selection:text-indigo-900">
      <main className="flex flex-col w-full relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-100/40 blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -40, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-violet-100/30 blur-[120px]" 
          />
        </div>

        {/* Hero Section */}
        <section className="relative px-6 pt-32 pb-20 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-100 bg-white/50 backdrop-blur-md text-sm font-semibold text-indigo-600 shadow-sm glass"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>NeuroTrack AI 2.0 is now live</span>
              <div className="h-4 w-px bg-indigo-100 mx-1" />
              <Link href="/signup" className="hover:text-indigo-800 transition-colors flex items-center gap-1">
                New features <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-6xl font-extrabold tracking-tight text-indigo-950 sm:text-8xl mb-8 leading-[1.1]"
            >
              Master Your Learning with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800">
                NeuroTrack AI
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 text-xl leading-relaxed text-indigo-900/70 max-w-2xl mx-auto font-medium"
            >
              The ultimate AI-powered study ecosystem designed to peak your cognitive performance. 
              Log sessions, summarize notes, and unlock deep insights.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link
                href="/signup"
                className="group relative flex items-center justify-center rounded-2xl bg-indigo-600 px-10 py-5 text-lg font-bold text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                Get Started Free
              </Link>
              <Link href="#features" className="text-lg font-bold text-indigo-900/40 hover:text-indigo-600 transition-colors">
                View Features
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Feature Section */}
        <section id="features" className="py-40 relative">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mx-auto max-w-2xl lg:text-center mb-32"
            >
              <h2 className="text-indigo-600 font-bold tracking-[0.2em] uppercase text-xs mb-4">NeuroTrack Platform</h2>
              <p className="text-4xl font-extrabold tracking-tight text-indigo-950 sm:text-6xl">
                Peak cognitive <br/> performance.
              </p>
              <div className="h-1.5 w-24 bg-indigo-600 mx-auto rounded-full mb-8" />
              <p className="text-lg leading-relaxed text-indigo-900/60 font-medium">
                Our ecosystem bridges the gap between raw effort and intelligent progress,
                powered by advanced cognitive analysis models.
              </p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                {
                  name: 'AI Analytics',
                  description: 'Deep cognitive analysis of your study patterns.',
                  icon: <Brain className="w-6 h-6 text-indigo-600" />,
                  color: 'indigo'
                },
                {
                  name: 'Session Flow',
                  description: 'Seamless tracking of every study block.',
                  icon: <Clock className="w-6 h-6 text-violet-600" />,
                  color: 'violet'
                },
                {
                  name: 'Smart Charts',
                  description: 'Visual insights into your learning velocity.',
                  icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
                  color: 'blue'
                },
                {
                  name: 'AI Summaries',
                  description: 'Convert hours of study into seconds of review.',
                  icon: <Sparkles className="w-6 h-6 text-amber-600" />,
                  color: 'amber'
                },
              ].map((feature) => (
                <motion.div 
                  key={feature.name} 
                  variants={fadeInUp}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className="group relative p-10 rounded-[2.5rem] bg-white border border-indigo-50/50 hover:border-indigo-200 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.05)] hover:shadow-[0_40px_80px_rgba(79,70,229,0.1)] flex flex-col items-center text-center"
                >
                  <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-${feature.color}-50 text-${feature.color}-600 group-hover:bg-${feature.color}-600 group-hover:text-white transition-all duration-500 shadow-inner overflow-hidden relative`}>
                    {feature.icon}
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-full group-hover:translate-y-0 duration-500" />
                  </div>
                  <h3 className="text-xl font-bold text-indigo-950 mb-4">{feature.name}</h3>
                  <p className="text-indigo-900/60 font-medium leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

      </main>
    </div>
  );
}

