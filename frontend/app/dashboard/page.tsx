"use client";

import { useEffect, useState } from "react";

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
  const [error, setError] = useState("");

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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

      setForm({ title: "", subject: "", duration: 30, date: new Date().toISOString().split('T')[0], notes: "" });
      setEditingId(null);
      fetchSessions();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this study session?")) return;
    try {
      const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSessions(sessions.filter((s) => s._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const startEdit = (session: Session) => {
    setEditingId(session._id);
    setForm({
      title: session.title,
      subject: session.subject,
      duration: session.duration,
      date: new Date(session.date).toISOString().split('T')[0],
      notes: session.notes || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", subject: "", duration: 30, date: new Date().toISOString().split('T')[0], notes: "" });
    setError("");
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Study Sessions</h1>
        <p className="text-slate-400 mt-2">Track your progress and log your study hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl sticky top-24">
            <h2 className="text-xl font-semibold text-white mb-6">
              {editingId ? "Edit Session" : "Log New Session"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>}
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input required type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full rounded-xl bg-slate-950/50 border border-white/10 py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. Chapter 1 Review" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                <input required type="text" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className="w-full rounded-xl bg-slate-950/50 border border-white/10 py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. Biology" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Duration (min)</label>
                  <input required type="number" min="1" value={form.duration} onChange={(e) => setForm({...form, duration: parseInt(e.target.value)})} className="w-full rounded-xl bg-slate-950/50 border border-white/10 py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                  <input required type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="w-full rounded-xl bg-slate-950/50 border border-white/10 py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Notes (Optional)</label>
                <textarea rows={3} value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} className="w-full rounded-xl bg-slate-950/50 border border-white/10 py-2 px-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" placeholder="Key takeaways..."></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-indigo-500/30">
                  {editingId ? "Update" : "Save"}
                </button>
                {editingId && (
                  <button type="button" onClick={cancelEdit} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl font-medium transition-all">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl min-h-[500px]">
            <h2 className="text-xl font-semibold text-white mb-6">Recent Sessions</h2>
            
            {loading ? (
              <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400 mb-4">No study sessions logged yet.</p>
                <p className="text-sm text-slate-500">Use the form to create your first session!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session._id} className="bg-slate-950/50 border border-white/5 p-5 rounded-2xl hover:border-indigo-500/30 transition-colors group">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-medium text-white">{session.title}</h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">{session.subject}</span>
                        </div>
                        <p className="text-sm text-slate-400 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {session.duration} mins • {new Date(session.date).toLocaleDateString()}
                        </p>
                        {session.notes && <p className="mt-3 text-sm text-slate-300 italic">"{session.notes}"</p>}
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(session)} className="p-2 text-slate-400 hover:text-indigo-400 bg-white/5 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(session._id)} className="p-2 text-slate-400 hover:text-red-400 bg-white/5 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
