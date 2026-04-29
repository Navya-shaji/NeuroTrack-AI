export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-400 mt-2">Welcome back. Here's what's happening with your projects today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'Total Articles', value: '24', trend: '+12%', color: 'text-indigo-400' },
          { title: 'Keywords Tracking', value: '1,432', trend: '+5.4%', color: 'text-purple-400' },
          { title: 'Avg Ranking', value: '#4.2', trend: '+1.2', color: 'text-pink-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
            <h3 className="text-slate-400 text-sm font-medium">{stat.title}</h3>
            <div className="mt-2 flex items-baseline gap-4">
              <p className="text-4xl font-semibold text-white">{stat.value}</p>
              <p className={`text-sm font-medium ${stat.color}`}>{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-grow bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No active projects</h2>
          <p className="text-slate-400 max-w-sm mx-auto mb-8">
            Get started by creating a new content project and connecting your target keywords.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]">
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
