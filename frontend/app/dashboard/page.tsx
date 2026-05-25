"use client";

import { useEffect, useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import {
  Clock, BookOpen, Calendar, Trash2, Edit2, Plus,
  Filter, Search, TrendingUp, Sparkles, Brain, Zap,
  List, Activity,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast, ToastType } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";
import {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
  type SessionData,
} from "@/actions/sessions";
import { generateInsights, summarizeNotes } from "@/actions/ai";

const sessionSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  subject: z.string().min(1, "Subject is required").max(50, "Subject too long"),
  duration: z.number().min(1, "Minimum 1 minute").max(1440, "Maximum 24 hours"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  notes: z.string().max(2000, "Notes too long").optional(),
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
} as const;

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", subject: "", duration: 30, date: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
  };

  const fetchSessions = () => {
    startTransition(async () => {
      const result = await getSessions().catch(() => null);
      if (result === null) {
        router.push("/login");
        return;
      }
      setSessions(result);
      setLoading(false);
    });
  };

  useEffect(() => {
    setMounted(true);
    setForm((prev) => ({ ...prev, date: new Date().toISOString().split("T")[0] }));
    fetchSessions();
  }, []);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    setAiInsights(null);
    const result = await generateInsights();
    setIsGenerating(false);
    if (result.error) {
      showToast(result.error, "error");
    } else {
      setAiInsights(result.insight ?? null);
      showToast("AI Insights generated!", "success");
    }
  };

  const handleSummarizeNotes = async (notes: string, title: string) => {
    if (!notes) return;
    showToast(`Summarizing notes for ${title}...`, "info");
    const result = await summarizeNotes(notes);
    if (result.error) {
      showToast(result.error, "error");
    } else {
      setAiInsights(`### Summary for ${title}\n\n${result.summary}`);
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = sessionSchema.safeParse({ ...form, duration: Number(form.duration) });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      showToast("Please check the form for errors", "error");
      return;
    }

    startTransition(async () => {
      const result = editingId
        ? await updateSession(editingId, parsed.data)
        : await createSession(parsed.data);

      if (result.error) {
        showToast(result.error, "error");
        return;
      }

      showToast(editingId ? "Session updated!" : "Session logged!", "success");
      setForm({ title: "", subject: "", duration: 30, date: new Date().toISOString().split("T")[0], notes: "" });
      setEditingId(null);
      fetchSessions();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this study session?")) return;
    startTransition(async () => {
      const result = await deleteSession(id);
      if (result.error) {
        showToast(result.error, "error");
        return;
      }
      setSessions((prev) => prev.filter((s) => s._id !== id));
      showToast("Session deleted", "success");
    });
  };

  const stats = useMemo(() => {
    const totalMinutes = sessions.reduce((acc, s) => acc + (Number(s.duration) || 0), 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    const subjectMap: Record<string, number> = {};
    sessions.forEach((s) => {
      if (s.subject) subjectMap[s.subject] = (subjectMap[s.subject] || 0) + (Number(s.duration) || 0);
    });

    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    const weeklyData = last7Days.map((date) => ({
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      minutes: sessions
        .filter((s) => s.date && s.date.split("T")[0] === date)
        .reduce((acc, s) => acc + (Number(s.duration) || 0), 0),
    }));

    return { totalHours, weeklyData };
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = subjectFilter === "all" || s.subject === subjectFilter;
      return matchesSearch && matchesSubject;
    });
  }, [sessions, searchQuery, subjectFilter]);

  const subjects = Array.from(new Set(sessions.map((s) => s.subject)));

  return (
    <div className="min-h-screen bg-mesh font-sans selection:bg-indigo-100 selection:text-indigo-900 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>Workspace Control Center</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-indigo-950">
              Welcome back, <span className="text-indigo-600">{user?.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-indigo-900/50 mt-1 font-medium">Your learning velocity is up by 12% this week.</p>
          </div>
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Find sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              suppressHydrationWarning
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-indigo-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all glass shadow-sm"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {[
            { label: "Study Hours", value: `${stats.totalHours}h`, icon: Clock },
            { label: "Completed", value: sessions.length, icon: TrendingUp },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="glass p-8 rounded-3xl border border-indigo-100 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-indigo-900/40 text-[10px] font-black uppercase tracking-widest">{item.label}</p>
                  <div className="text-2xl font-black text-indigo-950">{item.value}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-8">

            {/* AI Insights Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-8 text-white shadow-2xl shadow-indigo-200"
            >
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none rotate-12">
                <Brain className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-100">Cognitive Engine</span>
                </div>
                <h2 className="text-3xl font-black mb-4">Neural Learning Report</h2>
                <p className="text-indigo-100/80 mb-8 max-w-xl font-medium leading-relaxed">
                  Generate a deep-learning analysis of your study sessions to identify focus gaps and optimize your retention schedule.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleGenerateInsights}
                    disabled={isGenerating || sessions.length === 0}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 disabled:bg-indigo-400 disabled:text-indigo-200 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-900/20"
                  >
                    {isGenerating ? (
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Zap className="w-5 h-5" />
                    )}
                    {isGenerating ? "Analyzing Neural Data..." : "Run AI Analysis"}
                  </button>
                  {aiInsights && (
                    <button
                      onClick={() => setAiInsights(null)}
                      className="px-8 py-4 bg-indigo-500/50 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all"
                    >
                      Dismiss Report
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {aiInsights && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-8 overflow-hidden"
                  >
                    <div className="p-6 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10 prose prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          h2: ({ node, ...props }) => <h3 className="text-xl font-black text-white mb-4 mt-6 first:mt-0" {...props} />,
                          p: ({ node, ...props }) => <p className="text-indigo-50 font-medium leading-relaxed mb-4" {...props} />,
                          li: ({ node, ...props }) => <li className="text-indigo-50 font-medium marker:text-indigo-200" {...props} />,
                        }}
                      >
                        {aiInsights}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Velocity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-[2.5rem] border border-indigo-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-indigo-950">Learning Velocity</h3>
                  <p className="text-sm text-indigo-900/50 font-bold">Your performance across the last 7 days</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div style={{ width: "100%", height: 300 }}>
                {loading || !mounted ? (
                  <Skeleton className="h-full w-full rounded-3xl bg-indigo-50" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={stats.weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#94a3b8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                        itemStyle={{ color: "#6366f1", fontWeight: "800" }}
                        cursor={{ stroke: "#6366f1", strokeWidth: 2, strokeDasharray: "4 4" }}
                      />
                      <Area type="monotone" dataKey="minutes" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorMinutes)" animationDuration={2000} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>

            {/* Session List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-[2.5rem] border border-indigo-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-indigo-950">Recent Logs</h3>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-300" />
                  <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    suppressHydrationWarning
                    className="appearance-none bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-900/70 py-2.5 pl-9 pr-8 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {loading ? (
                  [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-3xl bg-indigo-50" />)
                ) : filteredSessions.length === 0 ? (
                  <div className="text-center py-20 bg-indigo-50/50 rounded-3xl border border-dashed border-indigo-100">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <List className="w-6 h-6 text-indigo-300" />
                    </div>
                    <p className="text-indigo-950 font-black">Zero data found</p>
                    <p className="text-sm text-indigo-900/40 mt-1 font-bold">Start a new study session to see logs here.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredSessions.map((session) => (
                      <motion.div
                        key={session._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-indigo-50 hover:border-indigo-200 transition-all hover:shadow-lg hover:shadow-indigo-500/5"
                      >
                        <div className="flex items-center gap-5">
                          <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            <Clock className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-base font-black text-indigo-950 mb-1">{session.title}</h4>
                            <div className="flex items-center gap-3 text-xs font-bold">
                              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">{session.subject}</span>
                              <span className="text-indigo-900/30">•</span>
                              <span className="text-indigo-900/40 flex items-center gap-1"><Clock className="w-3 h-3" /> {session.duration}m</span>
                              <span className="text-indigo-900/30">•</span>
                              <span className="text-indigo-900/40 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(session.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.notes && (
                            <button
                              onClick={() => handleSummarizeNotes(session.notes!, session.title)}
                              className="p-3 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                              title="Summarize notes"
                            >
                              <Sparkles className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingId(session._id);
                              setForm({
                                title: session.title,
                                subject: session.subject,
                                duration: session.duration,
                                date: new Date(session.date).toISOString().split("T")[0],
                                notes: session.notes || "",
                              });
                            }}
                            className="p-3 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(session._id)}
                            className="p-3 text-indigo-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar — Session Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[2.5rem] border border-indigo-100 shadow-xl sticky top-32"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-600 text-white">
                  {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <h3 className="text-xl font-black text-indigo-950">{editingId ? "Edit Record" : "New Session"}</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-indigo-900/40 uppercase tracking-widest">Session Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    suppressHydrationWarning
                    className={cn("w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl px-5 py-4 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-indigo-200", errors.title && "border-rose-500")}
                    placeholder="e.g. Quantum Mechanics"
                  />
                  {errors.title && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider ml-1">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-indigo-900/40 uppercase tracking-widest">Topic / Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    suppressHydrationWarning
                    className={cn("w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl px-5 py-4 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-indigo-200", errors.subject && "border-rose-500")}
                    placeholder="e.g. Physics"
                  />
                  {errors.subject && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider ml-1">{errors.subject}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-indigo-900/40 uppercase tracking-widest">Mins</label>
                    <input
                      type="number"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                      suppressHydrationWarning
                      className={cn("w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl px-5 py-4 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all", errors.duration && "border-rose-500")}
                    />
                    {errors.duration && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider ml-1">{errors.duration}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-indigo-900/40 uppercase tracking-widest">Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      suppressHydrationWarning
                      className={cn("w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl px-5 py-4 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all", errors.date && "border-rose-500")}
                    />
                    {errors.date && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider ml-1">{errors.date}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-indigo-900/40 uppercase tracking-widest">Cognitive Notes</label>
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    suppressHydrationWarning
                    className={cn("w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl px-5 py-4 text-sm font-bold text-indigo-950 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-indigo-200", errors.notes && "border-rose-500")}
                    placeholder="Key concepts, breakthroughs..."
                  />
                  {errors.notes && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider ml-1">{errors.notes}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  suppressHydrationWarning
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-5 rounded-2xl text-lg font-black transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100"
                >
                  {editingId ? "Update Intelligence" : "Commit to Neural Log"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => {
                      setEditingId(null);
                      setForm({ title: "", subject: "", duration: 30, date: new Date().toISOString().split("T")[0], notes: "" });
                      setErrors({});
                    }}
                    className="w-full bg-indigo-50 text-indigo-600 font-bold py-4 rounded-2xl hover:bg-indigo-100 transition-all"
                  >
                    Discard Edits
                  </button>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
