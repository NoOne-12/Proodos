import React, { useEffect, useState } from 'react';
import { 
  Target, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';
import api from '../services/api';
import { Goal, Roadmap, GoalType } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Goal Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<GoalType>('DURATION');
  const [targetValue, setTargetValue] = useState<number>(60);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [deadline, setDeadline] = useState<string>('');
  const [roadmapId, setRoadmapId] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const fetchGoalsAndRoadmaps = async () => {
    try {
      setLoading(true);
      setError(null);
      const [goalsRes, roadmapsRes] = await Promise.all([
        api.get('/goals'),
        api.get('/roadmaps')
      ]);
      if (goalsRes.data.success) setGoals(goalsRes.data.data);
      if (roadmapsRes.data.success) setRoadmaps(roadmapsRes.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch goals data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalsAndRoadmaps();
  }, []);

  const openCreateModal = () => {
    setEditingGoal(null);
    setTitle('');
    setDescription('');
    setType('DURATION');
    setTargetValue(120);
    setCurrentValue(0);
    setDeadline('');
    setRoadmapId('');
    setModalOpen(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setDescription(goal.description || '');
    setType(goal.type);
    setTargetValue(goal.targetValue);
    setCurrentValue(goal.currentValue);
    setDeadline(goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '');
    setRoadmapId(goal.roadmapId || '');
    setModalOpen(true);
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSaving(true);
      const payload = {
        title,
        description: description || undefined,
        type,
        targetValue: Number(targetValue),
        currentValue: Number(currentValue),
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        roadmapId: roadmapId ? roadmapId : undefined
      };

      if (editingGoal) {
        await api.put(`/goals/${editingGoal.id}`, payload);
      } else {
        await api.post('/goals', payload);
      }

      setModalOpen(false);
      fetchGoalsAndRoadmaps();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save goal');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    try {
      await api.delete(`/goals/${goalId}`);
      fetchGoalsAndRoadmaps();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete goal');
    }
  };

  const handleIncrementProgress = async (goal: Goal, delta: number) => {
    try {
      const newCurrent = Math.max(0, goal.currentValue + delta);
      await api.put(`/goals/${goal.id}`, { currentValue: newCurrent });
      fetchGoalsAndRoadmaps();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update progress');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
            <Target className="w-4 h-4" />
            Milestones & Objectives
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--primary)] font-serif">
            Learning Goals
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Set time commitments, skill thresholds, or deadlines to accelerate progress.
          </p>
        </div>

        <Button onClick={openCreateModal} className="flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Create New Goal
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)]"></div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-2xl border border-[var(--color-brand-brick)]/20 bg-[var(--color-brand-brick)]/5">
          <p className="text-sm font-semibold text-[var(--color-brand-brick)] mb-4">{error}</p>
          <Button onClick={fetchGoalsAndRoadmaps}>Retry</Button>
        </div>
      ) : goals.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-[var(--border-color)] rounded-2xl bg-[var(--bg-surface)]">
          <Target className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold font-serif">No Goals Configured</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-md mx-auto">
            Give your learning sessions direction. Create targets like "Complete 5 Frontend skills" or "Study 600 minutes this month".
          </p>
          <Button onClick={openCreateModal} className="mt-6">
            Create Goal
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
            const isCompleted = goal.status === 'COMPLETED' || pct >= 100;

            return (
              <Card 
                key={goal.id}
                className={`border flex flex-col justify-between transition-all ${
                  isCompleted 
                    ? 'border-[var(--accent)]/40 bg-[var(--accent)]/5' 
                    : 'border-[var(--border-color)] hover:border-[var(--primary)]'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isCompleted 
                        ? 'bg-[var(--accent)] text-white' 
                        : 'bg-[var(--primary)]/10 text-[var(--primary)]'
                    }`}>
                      {isCompleted ? 'COMPLETED' : goal.type}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(goal)}
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                        title="Edit Goal"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1 text-[var(--color-brand-brick)] hover:opacity-80"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <CardTitle className="text-lg font-bold font-serif text-[var(--text-main)] mt-2">
                    {goal.title}
                  </CardTitle>
                  {goal.description && (
                    <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
                      {goal.description}
                    </p>
                  )}
                  {goal.roadmap && (
                    <p className="text-[11px] font-semibold text-[var(--primary)] mt-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {goal.roadmap.title}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[var(--text-muted)]">
                        {goal.currentValue} / {goal.targetValue} {goal.type === 'DURATION' ? 'Minutes' : 'Skills'}
                      </span>
                      <span className="font-bold text-[var(--primary)]">{pct}%</span>
                    </div>
                    <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-[var(--accent)]' : 'bg-[var(--primary)]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Manual Progress Incrementers */}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)] text-xs">
                    {goal.deadline ? (
                      <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[var(--text-muted)]">Ongoing Goal</span>
                    )}

                    {!isCompleted && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleIncrementProgress(goal, goal.type === 'DURATION' ? 15 : 1)}
                          className="px-2 py-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 rounded-md text-[10px] font-bold text-[var(--text-main)]"
                          title="Add progress manually"
                        >
                          +{goal.type === 'DURATION' ? '15m' : '1'}
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Goal Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingGoal ? 'Edit Goal' : 'Create Learning Goal'}
        description="Establish explicit targets to sustain deliberate learning."
      >
        <form onSubmit={handleSaveGoal} className="space-y-4">
          <Input
            label="Goal Title *"
            placeholder="e.g. Master React Hooks, Complete 10 hours of backend"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--text-main)]">
              Description (Optional)
            </label>
            <textarea
              className="w-full h-20 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Context or rewards for hitting this goal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[var(--text-main)]">
                Goal Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as GoalType)}
                className="w-full h-11 px-3 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="DURATION">Study Duration (Minutes)</option>
                <option value="COUNT">Skill Completion Count</option>
                <option value="DEADLINE">Target Milestone Deadline</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-[var(--text-main)]">
                Associated Roadmap (Optional)
              </label>
              <select
                value={roadmapId}
                onChange={(e) => setRoadmapId(e.target.value)}
                className="w-full h-11 px-3 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="">All / Global</option>
                {roadmaps.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={type === 'DURATION' ? 'Target Minutes *' : 'Target Count *'}
              type="number"
              min="1"
              value={targetValue}
              onChange={(e) => setTargetValue(Number(e.target.value))}
              required
            />

            <Input
              label="Target Deadline Date (Optional)"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingGoal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GoalsPage;
