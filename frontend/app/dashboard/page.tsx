"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [form, setForm] = useState({ title: "", subject: "", duration: 30, date: "", notes: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  useEffect(() => {
    fetchSessions();
    // Set initial date on client to avoid hydration mismatch
    setForm(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/sessions");
      if (res.status === 401) {
        router.push("/login");
        // Fallback for immediate redirect
        window.location.href = "/login";
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      console.log("Sessions fetched:", data.length);
      setSessions(data);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    console.log("Generate Insights clicked");
    setGenerating(true);
    setAiInsights(null);
    try {
      console.log("Fetching AI insights...");
      const res = await fetch("/api/ai/insights", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" })
      });
      const data = await res.json();
      console.log("AI Insights response:", data);
      if (!res.ok) throw new Error(data.error || "Failed to generate insights");
      setAiInsights(data.insight);
      showToast("AI Insights generated!", 'success');
    } catch (err: any) {
      console.error("AI Generation Error:", err);
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
    const totalMinutes = sessions.reduce((acc, s) => acc + (Number(s.duration) || 0), 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    const uniqueSubjects = new Set(sessions.map(s => s.subject)).size;
    const avgSession = sessions.length ? (totalMinutes / sessions.length).toFixed(0) : 0;
    
    // Group by subject for chart
    const subjectMap: Record<string, number> = {};
    sessions.forEach(s => {
      if (s.subject) {
        subjectMap[s.subject] = (subjectMap[s.subject] || 0) + (Number(s.duration) || 0);
      }
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
        .filter(s => s.date && s.date.split('T')[0] === date)
        .reduce((acc, s) => acc + (Number(s.duration) || 0), 0);
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        minutes: dayTotal || 0
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

  if (!isMounted) return null;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#09090b] text-zinc-100 font-sans selection:bg-purple-500/30">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col gap-12 relative z-10">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium tracking-wide mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NeuroTrack Workspace</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white flex items-center gap-3">
              Dashboard
            </h1>
            <p className="text-zinc-400 mt-2 text-sm max-w-xl leading-relaxed">
              Analyze your study patterns, generate AI-driven insights, and optimize your learning workflow.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-72">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-purple-400 transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl text-sm text-zinc-200 focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-zinc-900 outline-none transition-all placeholder:text-zinc-600 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards (Neumorphic/Glass) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Study Time', value: `${stats.totalHours}h`, icon: Clock, color: 'text-purple-400', glow: 'group-hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]' },
            { label: 'Active Subjects', value: stats.uniqueSubjects, icon: BookOpen, color: 'text-zinc-300', glow: 'group-hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]' },
            { label: 'Avg Session', value: `${stats.avgSession}m`, icon: Calendar, color: 'text-zinc-300', glow: 'group-hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]' },
            { label: 'Total Sessions', value: sessions.length, icon: TrendingUp, color: 'text-purple-400', glow: 'group-hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]' },
          ].map((item, i) => (
            <div key={i} className={`bg-zinc-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-md transition-all duration-300 hover:bg-zinc-900/80 hover:border-white/10 group ${item.glow}`}>
               <div className="flex justify-between items-start mb-4">
                 <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                   <item.icon className={cn("w-5 h-5", item.color)} />
                 </div>
               </div>
               <p className="text-zinc-500 text-xs font-medium tracking-wide uppercase">{item.label}</p>
               <h3 className="text-3xl font-semibold text-white mt-1.5 tracking-tight">{loading ? <Skeleton className="h-9 w-20 bg-zinc-800" /> : item.value}</h3>
            </div>
          ))}
        </div>

        {/* AI Insights Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900/40 border border-purple-500/20 backdrop-blur-xl group transition-all hover:border-purple-500/40 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)]">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
            <Sparkles className="w-48 h-48 text-purple-400" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
          
          <div className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                Intelligence Center
              </h2>
              <p className="text-zinc-400 mt-4 text-sm leading-relaxed">
                Unlock deep insights into your learning habits. Our AI analyzes your session metadata, duration patterns, and subject focus to generate highly personalized, actionable recommendations to elevate your performance.
              </p>
            </div>
            <button 
              onClick={generateInsights}
              disabled={generating || sessions.length === 0}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-[0.98] whitespace-nowrap"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate AI Report
                </>
              )}
            </button>
          </div>

          {aiInsights && (
            <div className="mx-8 mb-8 p-6 bg-black/40 border border-purple-500/20 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500 backdrop-blur-sm">
              <div className="prose prose-invert prose-purple max-w-none text-zinc-300 text-sm leading-relaxed">
                <ReactMarkdown 
                  components={{
                    h2: ({node, ...props}) => <h3 className="text-lg font-semibold text-white mb-4 mt-6 first:mt-0 tracking-tight" {...props} />,
                    h3: ({node, ...props}) => <h4 className="text-base font-medium text-purple-300 mb-3" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4 text-zinc-300 marker:text-purple-500" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                  }}
                >
                  {aiInsights}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  <h3 className="text-sm font-semibold text-zinc-200 tracking-wide">Velocity</h3>
                </div>
                <div className="h-[240px] w-full">
                  {loading ? <Skeleton className="h-full w-full rounded-2xl bg-zinc-800" /> : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                          itemStyle={{ color: '#c084fc', fontWeight: '500' }}
                          cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Line type="monotone" dataKey="minutes" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 0 }} activeDot={{ r: 5, fill: '#a855f7', stroke: '#fff', strokeWidth: 2 }} animationDuration={1500} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  <h3 className="text-sm font-semibold text-zinc-200 tracking-wide">Distribution</h3>
                </div>
                <div className="h-[240px] w-full">
                  {loading ? <Skeleton className="h-full w-full rounded-2xl bg-zinc-800" /> : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.subjectData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                          cursor={{ fill: '#27272a', opacity: 0.4 }}
                          itemStyle={{ color: '#60a5fa', fontWeight: '500' }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} animationDuration={1500}>
                          {stats.subjectData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#6366f1'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Sessions List */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white tracking-tight">Recent Activity</h3>
                <div className="relative">
                  <select 
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="appearance-none bg-zinc-800/50 border border-white/10 rounded-lg text-xs text-zinc-300 font-medium py-2 pl-3 pr-8 outline-none focus:ring-1 focus:ring-purple-500/50 cursor-pointer hover:bg-zinc-800 transition-colors"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500">
                    <Filter className="w-3 h-3" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {loading ? [...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl bg-zinc-800" />) : 
                 filteredSessions.length === 0 ? (
                  <div className="text-center py-16 bg-zinc-900/50 rounded-2xl border border-dashed border-white/10">
                    <div className="w-12 h-12 bg-zinc-800/50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                      <BookOpen className="w-5 h-5 text-zinc-500" />
                    </div>
                    <p className="text-zinc-300 font-medium text-sm">No activity found</p>
                    <p className="text-xs text-zinc-500 mt-1">Adjust filters or log a new session.</p>
                  </div>
                ) : (
                  filteredSessions.slice(0, 5).map((session) => (
                    <div key={session._id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/30 border border-transparent hover:border-white/5 hover:bg-zinc-800/50 transition-all duration-200">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors border border-white/5">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">{session.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500 font-medium">
                            <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-white/5">{session.subject}</span>
                            <span>•</span>
                            <span>{session.duration}m</span>
                            <span>•</span>
                            <span>{new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        {session.notes && (
                          <button 
                            onClick={() => summarizeNotes(session.notes!, session.title)}
                            title="Summarize Notes"
                            className="p-2 text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => {
                          setEditingId(session._id);
                          setForm({
                            title: session.title,
                            subject: session.subject,
                            duration: session.duration,
                            date: new Date(session.date).toISOString().split('T')[0],
                            notes: session.notes || ""
                          });
                        }} className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(session._id)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Form */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl sticky top-6 shadow-2xl shadow-black/50">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="p-2 rounded-lg bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  {editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <h2 className="text-lg font-semibold text-white tracking-tight">{editingId ? 'Edit Record' : 'New Record'}</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Title</label>
                  <input required type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-zinc-600" placeholder="e.g. Advanced Calculus" />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Subject</label>
                  <input required type="text" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-zinc-600" placeholder="e.g. Mathematics" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Duration (min)</label>
                    <input required type="number" value={form.duration} onChange={(e) => setForm({...form, duration: parseInt(e.target.value)})} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Date</label>
                    <input required type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Notes (Optional)</label>
                  <textarea rows={3} value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all resize-none placeholder:text-zinc-600" placeholder="Markdown supported..."></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-white text-black hover:bg-zinc-200 py-3 rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-[0.98]">
                    {editingId ? "Update Record" : "Save Record"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => setEditingId(null)} className="px-4 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700 hover:text-white transition-all text-sm font-medium">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

