import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  FileText, 
  Flame,
  Layers
} from 'lucide-react';
import api from '../services/api';
import { Roadmap, Skill } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const LearningSessionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('');
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Timer state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Status & loading
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const timerRef = useRef<any>(null);

  // Load roadmaps and skills
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const res = await api.get('/roadmaps');
        if (res.data.success) {
          const list: Roadmap[] = res.data.data;
          setRoadmaps(list);

          // Check if navigated with state
          const stateRoadmapId = (location.state as any)?.roadmapId;
          const stateSkillId = (location.state as any)?.skillId;

          if (stateRoadmapId) {
            setSelectedRoadmapId(stateRoadmapId);
          } else if (list.length > 0) {
            setSelectedRoadmapId(list[0].id);
          }

          if (stateSkillId) {
            setSelectedSkillId(stateSkillId);
          }
        }
      } catch (err) {
        console.error('Failed to load roadmaps for learning session', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, [location.state]);

  // Set default skill when roadmap changes
  useEffect(() => {
    if (selectedRoadmapId) {
      const rm = roadmaps.find(r => r.id === selectedRoadmapId);
      if (rm && rm.categories) {
        const allSkills = rm.categories.flatMap(c => c.skills || []);
        if (allSkills.length > 0 && !allSkills.some(s => s.id === selectedSkillId)) {
          setSelectedSkillId(allSkills[0].id);
        }
      }
    }
  }, [selectedRoadmapId, roadmaps]);

  // Timer Tick Logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStart = () => {
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset timer and discard current progress?')) {
      setIsRunning(false);
      setSecondsElapsed(0);
      setSessionStartTime(null);
    }
  };

  const handleFinishSession = async () => {
    if (!selectedSkillId) {
      alert('Please select a skill to focus on before recording a session.');
      return;
    }

    const durationMinutes = Math.max(1, Math.round(secondsElapsed / 60));
    const startedAt = sessionStartTime || new Date(Date.now() - durationMinutes * 60000);
    const endedAt = new Date();

    try {
      setSubmitting(true);
      const res = await api.post('/learning/sessions', {
        skillId: selectedSkillId,
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
        durationMinutes,
        notes: notes.trim() || undefined
      });

      if (res.data.success) {
        setIsRunning(false);
        setSecondsElapsed(0);
        setSessionStartTime(null);
        setNotes('');
        setSuccessMessage(`Awesome work! Saved ${durationMinutes} minutes of focused study.`);
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save session');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : ''}${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentRoadmap = roadmaps.find(r => r.id === selectedRoadmapId);
  const currentSkills: Skill[] = currentRoadmap?.categories?.flatMap(c => c.skills || []) || [];
  const activeSkill = currentSkills.find(s => s.id === selectedSkillId);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--secondary)] mb-1">
          <Flame className="w-4 h-4 text-[var(--secondary)]" />
          Focus & Mastery Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--primary)] font-serif">
          Learning Focus Session
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Eliminate distractions, track deliberate practice, and log real-time study notes.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent)] flex items-center gap-3 font-semibold text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Focus Control Container */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left 3 cols: Timer Display & Controls */}
        <Card className="lg:col-span-3 border-[var(--border-color)] shadow-md flex flex-col justify-between">
          <CardHeader className="text-center pb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
              {isRunning ? '🟢 Active Focus Mode' : '⚪ Session Paused / Ready'}
            </span>
            <CardTitle className="text-4xl sm:text-6xl font-mono font-black text-[var(--primary)] tracking-tight py-4">
              {formatTime(secondsElapsed)}
            </CardTitle>
            <p className="text-xs text-[var(--text-muted)]">
              {activeSkill ? `Targeting: ${activeSkill.title}` : 'Select a skill to focus on'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pt-0">
            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold flex items-center gap-2 rounded-2xl shadow"
                >
                  <Play className="w-5 h-5 fill-current" />
                  {secondsElapsed > 0 ? 'Resume Timer' : 'Start Focus Session'}
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  size="lg"
                  className="px-8 py-3 bg-[var(--color-brand-ochre)] hover:bg-[var(--color-brand-ochre)]/90 text-white font-bold flex items-center gap-2 rounded-2xl shadow"
                >
                  <Pause className="w-5 h-5 fill-current" />
                  Pause Timer
                </Button>
              )}

              <Button
                onClick={handleFinishSession}
                variant="outline"
                size="lg"
                disabled={secondsElapsed < 5 || submitting}
                className="px-6 py-3 border-[var(--border-color)] font-bold flex items-center gap-2 rounded-2xl"
              >
                <Square className="w-4 h-4 fill-current text-[var(--color-brand-brick)]" />
                {submitting ? 'Saving...' : 'Finish & Save Session'}
              </Button>

              {secondsElapsed > 0 && !isRunning && (
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-[var(--text-muted)] flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </Button>
              )}
            </div>

            {/* Session Study Notes */}
            <div className="pt-4 border-t border-[var(--border-color)] space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Session Notes & Key Insights
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write what you learned, breakthroughs, problems solved, or reference links..."
                className="w-full h-28 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-xs sm:text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Right 2 cols: Skill & Roadmap Selection */}
        <Card className="lg:col-span-2 border-[var(--border-color)] shadow-sm space-y-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold font-serif text-[var(--primary)] flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Focus Target
            </CardTitle>
            <p className="text-xs text-[var(--text-muted)]">Choose the roadmap and skill for this session.</p>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {/* Roadmap Select */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Roadmap
              </label>
              <select
                value={selectedRoadmapId}
                onChange={(e) => setSelectedRoadmapId(e.target.value)}
                disabled={isRunning}
                className="w-full h-11 px-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                {roadmaps.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Skill Select */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Skill / Competency
              </label>
              {currentSkills.length > 0 ? (
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {currentSkills.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => !isRunning && setSelectedSkillId(s.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                        selectedSkillId === s.id
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] shadow-sm'
                          : 'border-[var(--border-color)] bg-black/5 dark:bg-white/5 hover:border-black/20 text-[var(--text-main)]'
                      } ${isRunning ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <span className="truncate">{s.title}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-md uppercase font-bold ${
                        s.status === 'COMPLETED' ? 'bg-[var(--accent)] text-white' :
                        s.status === 'IN_PROGRESS' ? 'bg-[var(--secondary)] text-white' :
                        'bg-black/10 dark:bg-white/10 text-[var(--text-muted)]'
                      }`}>
                        {s.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center border border-dashed border-[var(--border-color)] rounded-xl text-xs text-[var(--text-muted)]">
                  No skills in this roadmap.
                </div>
              )}
            </div>

            {/* Target Daily Guidance */}
            {currentRoadmap && (
              <div className="p-3 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/20 text-[11px] text-[var(--text-muted)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <span>Daily commitment target for this roadmap: <strong>{currentRoadmap.dailyTargetMinutes} mins</strong></span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningSessionPage;
