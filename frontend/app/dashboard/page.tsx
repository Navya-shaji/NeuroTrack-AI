"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import { 
  Clock, BookOpen, Calendar, Trash2, Edit2, Plus, 
  Filter, Search, ArrowUpRight, TrendingUp, MoreVertical, Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast, ToastType } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface Session {
  _id: string;
  title: string;
  subject: string;
  duration: number;
  date: string;
  notes?: string;
}

export default function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", subject: "", duration: 30, date: new Date().toISOString().split('T')[0], notes: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/sessions");
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      setSessions(data);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    setGenerating(true);
    setAiInsights(null);
    try {
      const res = await fetch("/api/ai/insights", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate insights");
      setAiInsights(data.insight);
      showToast("AI Insights generated!", 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const summarizeNotes = async (notes: string, title: string) => {
    if (!notes) return;
    showToast(`Summarizing notes for ${title}...`, 'info');
    try {
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "summarize", notes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to summarize notes");
      
      // We could show this in a modal or just update the insight area
      setAiInsights(`### Summary for ${title}\n\n${data.summary}`);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/sessions/${editingId}` : "/api/sessions";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          duration: Number(form.duration),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      showToast(editingId ? "Session updated!" : "Session logged!", 'success');
      setForm({ title: "", subject: "", duration: 30, date: new Date().toISOString().split('T')[0], notes: "" });
      setEditingId(null);
      fetchSessions();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this study session?")) return;
    try {
      const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSessions(sessions.filter((s) => s._id !== id));
      showToast("Session deleted", 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Stats Calculations
  const stats = useMemo(() => {
    const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    const uniqueSubjects = new Set(sessions.map(s => s.subject)).size;
    const avgSession = sessions.length ? (totalMinutes / sessions.length).toFixed(0) : 0;
    
    // Group by subject for chart
    const subjectMap: Record<string, number> = {};
    sessions.forEach(s => {
      subjectMap[s.subject] = (subjectMap[s.subject] || 0) + s.duration;
    });
    const subjectData = Object.entries(subjectMap).map(([name, value]) => ({ name, value }));

    // Weekly progress (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    
    const weeklyData = last7Days.map(date => {
      const dayTotal = sessions
        .filter(s => s.date.split('T')[0] === date)
        .reduce((acc, s) => acc + s.duration, 0);
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        minutes: dayTotal
      };
    });

    return { totalHours, uniqueSubjects, avgSession, subjectData, weeklyData };
  }, [sessions]);

  // Filtering Logic
  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = subjectFilter === "all" || s.subject === subjectFilter;
      return matchesSearch && matchesSubject;
    });
  }, [sessions, searchQuery, subjectFilter]);

  const subjects = Array.from(new Set(sessions.map(s => s.subject)));

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col gap-10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-3">
            <TrendingUp className="text-indigo-400 w-8 h-8" />
            Study Tracker
          </h1>
          <p className="text-slate-400 mt-2">Analyze your progress and optimize your study routine.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-full text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Study Time', value: `${stats.totalHours}h`, icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
          { label: 'Active Subjects', value: stats.uniqueSubjects, icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Avg Session', value: `${stats.avgSession}m`, icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Total Sessions', value: sessions.length, icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-400/10' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
             <div className="flex justify-between items-start mb-4">
               <div className={cn("p-3 rounded-2xl", item.bg)}>
                 <item.icon className={cn("w-6 h-6", item.color)} />
               </div>
               <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
             </div>
             <p className="text-slate-400 text-sm font-medium">{item.label}</p>
             <h3 className="text-3xl font-bold text-white mt-1">{loading ? <Skeleton className="h-9 w-20" /> : item.value}</h3>
          </div>
        ))}
      </div>

      {/* AI Insights Section */}
      <div className="bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-transparent border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-24 h-24 text-indigo-400" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Sparkles className="text-indigo-400 w-6 h-6" />
              AI Study Insights
            </h2>
            <p className="text-slate-400 mt-2">
              Get personalized study summaries and suggestions based on your recent sessions. 
              Our AI analyzes your patterns to help you stay focused.
            </p>
          </div>
          <button 
            onClick={generateInsights}
            disabled={generating || sessions.length === 0}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] whitespace-nowrap"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing Sessions...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Insights
              </>
            )}
          </button>
        </div>

        {aiInsights && (
          <div className="mt-8 p-6 bg-slate-950/50 border border-white/5 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
              <ReactMarkdown 
                components={{
                  h2: ({node, ...props}) => <h3 className="text-xl font-bold text-white mb-4 mt-6 first:mt-0" {...props} />,
                  h3: ({node, ...props}) => <h4 className="text-lg font-semibold text-indigo-300 mb-3" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4" {...props} />,
                  strong: ({node, ...props}) => <strong className="text-indigo-200 font-bold" {...props} />,
                }}
              >
                {aiInsights}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts & Form */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                Weekly Progress
              </h3>
              <div className="h-[200px] w-full">
                {loading ? <Skeleton className="h-full w-full rounded-2xl" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '12px' }}
                        itemStyle={{ color: '#818cf8' }}
                      />
                      <Line type="monotone" dataKey="minutes" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: '#818cf8' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Time per Subject
              </h3>
              <div className="h-[200px] w-full">
                {loading ? <Skeleton className="h-full w-full rounded-2xl" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.subjectData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '12px' }}
                        cursor={{ fill: '#ffffff05' }}
                      />
                      <Bar dataKey="value" fill="#a78bfa" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Sessions List */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Recent Sessions</h3>
              <div className="flex items-center gap-3">
                <select 
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="bg-slate-950/50 border border-white/10 rounded-full text-xs text-slate-300 py-1.5 px-4 outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />) : 
               filteredSessions.length === 0 ? (
                <div className="text-center py-20 bg-slate-950/20 rounded-3xl border border-dashed border-white/5">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400">No sessions found</p>
                  <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or log a new session.</p>
                </div>
              ) : (
                filteredSessions.slice(0, 5).map((session) => (
                  <div key={session._id} className="group relative bg-slate-950/40 hover:bg-slate-950/60 border border-white/5 hover:border-indigo-500/30 p-5 rounded-2xl transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold group-hover:text-indigo-300 transition-colors">{session.title}</h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium uppercase tracking-wider">
                            <span>{session.subject}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            <span>{session.duration} mins</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            <span>{new Date(session.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.notes && (
                          <button 
                            onClick={() => summarizeNotes(session.notes!, session.title)}
                            title="Summarize Notes"
                            className="p-2 text-indigo-400 hover:text-white hover:bg-indigo-500/20 rounded-lg transition-all"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => setEditingId(session._id) || setForm({
                          title: session.title,
                          subject: session.subject,
                          duration: session.duration,
                          date: new Date(session.date).toISOString().split('T')[0],
                          notes: session.notes || ""
                        })} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(session._id)} className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl sticky top-28">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-emerald-500/10">
                <Plus className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Session' : 'New Session'}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">Title</label>
                <input required type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600" placeholder="Session Title" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                <input required type="text" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600" placeholder="Subject Name" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">Duration</label>
                  <input required type="number" value={form.duration} onChange={(e) => setForm({...form, duration: parseInt(e.target.value)})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">Date</label>
                  <input required type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-indigo-500 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest ml-1">Notes</label>
                <textarea rows={3} value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-indigo-500 outline-none transition-all resize-none" placeholder="Optional notes..."></textarea>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-white hover:bg-slate-200 text-slate-950 py-4 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]">
                  {editingId ? "Update" : "Save"}
                </button>
                {editingId && (
                  <button type="button" onClick={() => setEditingId(null)} className="px-6 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-all font-semibold">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
