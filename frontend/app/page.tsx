export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center font-sans bg-white">
      <main className="flex flex-col w-full relative">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-50/50 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-100/30 blur-[120px]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        </div>

        {/* Hero Section */}
        <div className="relative isolate px-6 pt-24 lg:px-8">
          <div className="mx-auto max-w-4xl py-24 sm:py-32 lg:py-40">
            <div className="text-center">
              <div className="mb-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-100 bg-purple-50/50 text-sm font-bold text-purple-700 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
                NeuroTrack AI 2.0 is now live
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-purple-900 sm:text-7xl">
                Master Your Learning with <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-purple-800">
                  NeuroTrack AI
                </span>
              </h1>
              <p className="mt-8 text-xl leading-8 text-purple-900/70 max-w-2xl mx-auto font-bold">
                The ultimate AI-powered study tracker designed to optimize your learning efficiency. Log sessions, analyze patterns, and get personalized insights to excel in your studies.
              </p>
              <div className="mt-12 flex items-center justify-center gap-x-6">
                <a
                  href="/signup"
                  className="rounded-2xl bg-purple-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-purple-100 hover:bg-purple-700 hover:shadow-purple-200 transition-all hover:scale-105 active:scale-95"
                >
                  Start tracking for free
                </a>
                <a href="#features" className="text-sm font-bold leading-6 text-purple-900/60 group hover:text-purple-600 transition-colors">
                  Explore features <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div id="features" className="py-24 sm:py-32 bg-purple-50/20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-bold leading-7 text-purple-600 tracking-wide uppercase">Smart Study Management</h2>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-purple-900 sm:text-5xl">Everything you need to succeed</p>
              <p className="mt-6 text-lg leading-8 text-purple-900/70 font-bold">
                Our platform combines intuitive tracking with cutting-edge AI to help you understand your study habits and perform at your best.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-5xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {[
                  {
                    name: 'AI-Powered Insights',
                    description: 'Get personalized analysis of your study habits and actionable suggestions to improve your retention.',
                    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
                  },
                  {
                    name: 'Session Tracking',
                    description: 'Log your study time, subjects, and notes with an intuitive interface designed for students.',
                    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  },
                  {
                    name: 'Progress Analytics',
                    description: 'Visualize your weekly progress and time distribution across different subjects with beautiful charts.',
                    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  },
                  {
                    name: 'Notes Summarization',
                    description: 'Paste your long study notes and let our AI summarize them into key takeaways instantly.',
                    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  },
                ].map((feature) => (
                  <div key={feature.name} className="relative group p-8 rounded-3xl bg-white border border-purple-100 hover:border-purple-300 transition-all shadow-sm hover:shadow-md">
                    <dt className="text-xl font-bold leading-7 text-purple-900 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                        </svg>
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-4 text-base leading-7 text-purple-900/60 font-bold">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

