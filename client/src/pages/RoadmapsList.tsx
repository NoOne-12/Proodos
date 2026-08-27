import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit3, ArrowRight, BookOpen, Layers, CheckCircle2, Flame, Sparkles } from 'lucide-react';
import api from '../services/api';
import { Roadmap } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

const RoadmapsList: React.FC = () => {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create / Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState<Roadmap | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [dailyTargetMinutes, setDailyTargetMinutes] = useState(30);
  const [saving, setSaving] = useState(false);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/roadmaps');
      if (res.data.success) {
        setRoadmaps(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load roadmaps.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const openCreateModal = () => {
    setEditingRoadmap(null);
    setTitle('');
    setDescription('');
    setTargetDate('');
    setDailyTargetMinutes(30);
    setModalOpen(true);
  };

  const openEditModal = (r: Roadmap, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRoadmap(r);
    setTitle(r.title);
    setDescription(r.description || '');
    setTargetDate(r.targetDate ? new Date(r.targetDate).toISOString().split('T')[0] : '');
    setDailyTargetMinutes(r.dailyTargetMinutes || 30);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSaving(true);
      const payload = {
        title,
        description: description || undefined,
        targetDate: targetDate ? new Date(targetDate).toISOString() : undefined,
        dailyTargetMinutes: Number(dailyTargetMinutes) || 30
      };

      if (editingRoadmap) {
        await api.put(`/roadmaps/${editingRoadmap.id}`, payload);
      } else {
        await api.post('/roadmaps', payload);
      }

      setModalOpen(false);
      fetchRoadmaps();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving roadmap');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this roadmap and all its categories/skills?')) return;

    try {
      await api.delete(`/roadmaps/${id}`);
      fetchRoadmaps();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error deleting roadmap');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--primary)] font-serif">
            Learning Roadmaps
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Organize competencies, milestones, and master skills step-by-step.
          </p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New Roadmap
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)]"></div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-2xl border border-[var(--color-brand-brick)]/20 bg-[var(--color-brand-brick)]/5">
          <p className="text-sm font-semibold text-[var(--color-brand-brick)] mb-4">{error}</p>
          <Button onClick={fetchRoadmaps}>Retry</Button>
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-[var(--border-color)] rounded-2xl bg-[var(--bg-surface)]">
          <BookOpen className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold text-[var(--text-main)] font-serif">No Roadmaps Found</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-md mx-auto">
            Design your structured learning paths. Define what you want to master, break it into categories, and track every skill.
          </p>
          <Button onClick={openCreateModal} className="mt-6">
            Create Your First Roadmap
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((roadmap) => {
            let totalSkills = 0;
            let completedSkills = 0;
            roadmap.categories?.forEach((cat) => {
              cat.skills?.forEach((skill) => {
                totalSkills++;
                if (skill.status === 'COMPLETED') completedSkills++;
              });
            });
            const progress = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;

            return (
              <Card
                key={roadmap.id}
                onClick={() => navigate(`/roadmaps/${roadmap.id}`)}
                className="group cursor-pointer hover:border-[var(--primary)] hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
                      {roadmap.status}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => openEditModal(roadmap, e)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
                        title="Edit Roadmap"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(roadmap.id, e)}
                        className="p-1.5 rounded-lg text-[var(--color-brand-brick)] hover:bg-[var(--color-brand-brick)]/10"
                        title="Delete Roadmap"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold font-serif text-[var(--primary)] group-hover:underline mt-2">
                    {roadmap.title}
                  </CardTitle>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1">
                    {roadmap.description || 'No description provided.'}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Progress</span>
                      <span className="text-[var(--primary)] font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[var(--primary)] h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)]">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{roadmap.categories?.length || 0} Categories</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <span>{completedSkills}/{totalSkills} Skills</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingRoadmap ? 'Edit Learning Roadmap' : 'Create New Learning Roadmap'}
        description="Define the overarching discipline, daily commitment, and target date."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Roadmap Title *"
            placeholder="e.g. Full Stack Engineering, Machine Learning, German B2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--text-main)]">
              Description (Optional)
            </label>
            <textarea
              className="w-full h-24 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              placeholder="Why are you learning this? What is your final objective?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Daily Target (Minutes)"
              type="number"
              min="5"
              max="720"
              value={dailyTargetMinutes}
              onChange={(e) => setDailyTargetMinutes(Number(e.target.value))}
            />
            <Input
              label="Target Completion Date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingRoadmap ? 'Update Roadmap' : 'Create Roadmap'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoadmapsList;
