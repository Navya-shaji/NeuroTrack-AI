"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Brain, 
  Clock, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Zap,
  ShieldCheck,
  Target
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
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/signup"
                className="group relative flex items-center justify-center rounded-2xl bg-indigo-600 px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10">Start Tracking Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="#features" className="flex items-center gap-2 px-8 py-5 text-lg font-bold text-indigo-900/60 hover:text-indigo-950 transition-all group">
                Explore Features 
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-indigo-100 group-hover:border-indigo-300 transition-all">
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>

            {/* Hero Visual Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-20 relative mx-auto max-w-5xl"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[2.5rem] blur opacity-20" />
              <div className="relative glass rounded-[2.5rem] overflow-hidden border border-indigo-100 shadow-2xl">
                <img 
                  src="/hero-vision.png" 
                  alt="Neural Intelligence Visualization" 
                  className="w-full h-auto object-cover opacity-90 hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40" />
              </div>
              
              {/* Floating elements to add depth */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 hidden lg:block glass p-6 rounded-3xl border border-indigo-100 shadow-xl z-10"
              >
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-black text-indigo-950 tracking-tight">System Optimized</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-20 pt-10 border-t border-indigo-50/50 flex flex-wrap justify-center gap-x-12 gap-y-6 text-indigo-300 font-semibold text-sm grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
            >
              <div className="flex items-center gap-2 italic">MIT Trusted</div>
              <div className="flex items-center gap-2 italic">Stanford Study Lab</div>
              <div className="flex items-center gap-2 italic">Harvard Cognitive Research</div>
            </motion.div>
          </div>
        </section>

        {/* Feature Section */}
        <section id="features" className="py-32 relative">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div 
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mx-auto max-w-2xl lg:text-center mb-24"
            >
              <h2 className="text-indigo-600 font-bold tracking-[0.2em] uppercase text-sm mb-4">The Platform</h2>
              <p className="text-4xl font-extrabold tracking-tight text-indigo-950 sm:text-6xl mb-6">
                Everything you need to <br/> perform at your peak
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

        {/* Stats / Proof Section */}
        <section className="py-24 bg-indigo-950 text-white relative overflow-hidden rounded-[4rem] mx-6 mb-32 shadow-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-violet-900/50" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            {[
              { label: 'Study Sessions Logged', value: '2.4M+' },
              { label: 'Active Learners', value: '150K+' },
              { label: 'Improvement in Retention', value: '42%' },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <div className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-300">
                  {stat.value}
                </div>
                <div className="text-indigo-200/60 font-bold uppercase tracking-widest text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

