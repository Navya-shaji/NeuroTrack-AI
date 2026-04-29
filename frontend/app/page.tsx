export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center font-sans">
      <main className="flex flex-col w-full relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-indigo-900/20 blur-[120px]" />
          <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-900/20 blur-[120px]" />
        </div>

        {/* Hero Section */}
        <div className="relative isolate px-6 pt-24 lg:px-8 overflow-hidden">
          <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm text-slate-300 shadow-2xl">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                NeuroTrack AI 2.0 is now live
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
                Supercharge Your SEO with <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
                  NeuroTrack AI
                </span>
              </h1>
              <p className="mt-8 text-lg leading-8 text-slate-400 max-w-2xl mx-auto">
                The ultimate AI-powered blogging platform designed to skyrocket your search engine rankings. Automate content creation, optimize for keywords, and grow your audience effortlessly.
              </p>
              <div className="mt-12 flex items-center justify-center gap-x-6">
                <a
                  href="/signup"
                  className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all hover:scale-105"
                >
                  Start optimizing for free
                </a>
                <a href="#features" className="text-sm font-semibold leading-6 text-slate-300 group hover:text-white transition-colors">
                  View features <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div id="features" className="py-24 sm:py-32 relative">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-400 tracking-wide uppercase">Faster Content Creation</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Everything you need to rank higher</p>
              <p className="mt-6 text-lg leading-8 text-slate-400">
                Our platform combines cutting-edge AI with proven SEO strategies to deliver content that search engines and users love.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-5xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {[
                  {
                    name: 'AI-Driven Research',
                    description: 'Automatically discover high-converting keywords and topic clusters relevant to your niche.',
                    icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                  },
                  {
                    name: 'Automated Publishing',
                    description: 'Schedule and publish SEO-optimized blogs directly to your site with a single click.',
                    icon: 'M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z'
                  },
                  {
                    name: 'Real-time Analytics',
                    description: 'Track your keyword rankings, organic traffic, and content performance in one unified dashboard.',
                    icon: 'M3 131.2 5.2a1 1 0 011.6 0l2.2 2.2a1 1 0 001.4 0l3.2-3.2a1 1 0 011.4 0l2.2 2.2m-12-8v12'
                  },
                  {
                    name: 'Competitor Analysis',
                    description: 'Analyze top-ranking competitor articles to find content gaps and ranking opportunities.',
                    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  },
                ].map((feature) => (
                  <div key={feature.name} className="relative group p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-800/50 transition-colors backdrop-blur-sm hover:border-white/10">
                    <dt className="text-base font-semibold leading-7 text-white flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                        </svg>
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-4 text-base leading-7 text-slate-400">{feature.description}</dd>
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
