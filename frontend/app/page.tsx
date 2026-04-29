export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-white font-sans">
      <main className="flex flex-col w-full">
        {/* Hero Section */}
        <div className="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-br from-indigo-50 to-white overflow-hidden">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                Supercharge Your SEO with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">NeuroTrack AI</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                The ultimate AI-powered blogging platform designed to skyrocket your search engine rankings. Automate content creation, optimize for keywords, and grow your audience effortlessly.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105"
                >
                  Get started
                </a>
                <a href="#" className="text-sm font-semibold leading-6 text-gray-900 group">
                  Learn more <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
            <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}></div>
          </div>
        </div>

        {/* Feature Section */}
        <div className="py-24 sm:py-32 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Faster Content Creation</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to rank higher</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Our platform combines cutting-edge AI with proven SEO strategies to deliver content that search engines and users love.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {[
                  {
                    name: 'AI-Driven Research',
                    description: 'Automatically discover high-converting keywords and topic clusters relevant to your niche.',
                  },
                  {
                    name: 'Automated Publishing',
                    description: 'Schedule and publish SEO-optimized blogs directly to your site with a single click.',
                  },
                  {
                    name: 'Real-time Analytics',
                    description: 'Track your keyword rankings, organic traffic, and content performance in one unified dashboard.',
                  },
                  {
                    name: 'Competitor Analysis',
                    description: 'Analyze top-ranking competitor articles to find content gaps and ranking opportunities.',
                  },
                ].map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-base font-semibold leading-7 text-gray-900">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                        {/* Example Icon */}
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
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
