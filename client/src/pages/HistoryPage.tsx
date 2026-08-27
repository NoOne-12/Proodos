import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  BookOpen, 
  Calendar, 
  FileText, 
  Filter, 
  Layers, 
  Sparkles,
  Search
} from 'lucide-react';
import api from '../services/api';
import { LearningSession, Roadmap } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const HistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sessionsRes, roadmapsRes] = await Promise.all([
        api.get('/learning/sessions', {
          params: { roadmapId: selectedRoadmapId || undefined }
        }),
        api.get('/roadmaps')
      ]);

      if (sessionsRes.data.success) setSessions(sessionsRes.data.data);
      if (roadmapsRes.data.success) setRoadmaps(roadmapsRes.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedRoadmapId]);

  const filteredSessions = sessions.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const skillMatch = s.skill?.title?.toLowerCase().includes(q);
    const catMatch = s.skill?.category?.name?.toLowerCase().includes(q);
    const notesMatch = s.notes?.toLowerCase().includes(q);
    return skillMatch || catMatch || notesMatch;
  });

  const totalMinutes = filteredSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
            <Clock className="w-4 h-4" />
            Session Archives
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--primary)] font-serif">
            Learning History & Notes
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Complete timeline of all your deliberate practice sessions, reflections, and notes.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[var(--bg-surface)] px-4 py-2 rounded-2xl border border-[var(--border-color)]">
          <Clock className="w-4 h-4 text-[var(--secondary)]" />
          <div className="text-xs font-semibold">
            <span>Filtered Total: </span>
            <strong className="text-[var(--secondary)] font-bold">{totalMinutes} mins</strong> ({+(totalMinutes / 60).toFixed(1)} hrs)
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[var(--bg-surface)] p-3.5 rounded-2xl border border-[var(--border-color)] shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by skill, category, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedRoadmapId}
            onChange={(e) => setSelectedRoadmapId(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="">All Roadmaps</option>
            {roadmaps.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)]"></div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-2xl border border-[var(--color-brand-brick)]/20 bg-[var(--color-brand-brick)]/5">
          <p className="text-sm font-semibold text-[var(--color-brand-brick)] mb-4">{error}</p>
          <Button onClick={fetchHistory}>Retry</Button>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-[var(--border-color)] rounded-2xl bg-[var(--bg-surface)]">
          <Clock className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold font-serif">No Session Records Found</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-md mx-auto">
            {searchQuery || selectedRoadmapId 
              ? 'No sessions match your search filters.' 
              : 'Complete a learning session in the Focus Mode to start building your study log.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="border-[var(--border-color)] shadow-sm hover:border-[var(--primary)]/50 transition-all">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-[var(--primary)] px-2 py-0.5 rounded-md bg-[var(--primary)]/10">
                      {session.skill?.category?.roadmap?.title || 'Roadmap'}
                    </span>
                    <span className="text-[var(--text-muted)]">•</span>
                    <span className="font-semibold text-[var(--text-muted)]">
                      {session.skill?.category?.name || 'Category'}
                    </span>
                    <span className="text-[var(--text-muted)]">•</span>
                    <span className="text-[var(--text-muted)] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(session.startedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-serif text-[var(--text-main)]">
                    {session.skill?.title || 'Target Topic'}
                  </h3>

                  {session.notes && (
                    <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] text-xs text-[var(--text-main)] italic flex items-start gap-2">
                      <FileText className="w-4 h-4 text-[var(--text-muted)] shrink-0 mt-0.5" />
                      <p className="whitespace-pre-wrap">{session.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border-color)]">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-[var(--secondary)]">
                    {session.durationMinutes}
                  </div>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Minutes Tracked
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
