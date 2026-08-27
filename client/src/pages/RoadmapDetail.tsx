import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Play, 
  Clock, 
  Layers, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  CircleDot,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';
import { Roadmap, Category, Skill, SkillStatus } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

const RoadmapDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Skill Modal State
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [targetCategoryId, setTargetCategoryId] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillTitle, setSkillTitle] = useState('');
  const [skillDesc, setSkillDesc] = useState('');
  const [skillNotes, setSkillNotes] = useState('');
  const [skillEstMinutes, setSkillEstMinutes] = useState<number | ''>('');
  const [skillResourceUrl, setSkillResourceUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/roadmaps/${id}`);
      if (res.data.success) {
        setRoadmap(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load roadmap detail.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [id]);

  // Skill status toggle
  const handleStatusChange = async (skillId: string, currentStatus: SkillStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    let newStatus: SkillStatus = 'IN_PROGRESS';
    if (currentStatus === 'NOT_STARTED') newStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS') newStatus = 'COMPLETED';
    else if (currentStatus === 'COMPLETED') newStatus = 'NOT_STARTED';

    try {
      await api.patch(`/skills/${skillId}/status`, { status: newStatus });
      fetchRoadmap();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update skill status');
    }
  };

  // Category CRUD
  const openCreateCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDesc('');
    setCategoryModalOpen(true);
  };

  const openEditCategory = (cat: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !roadmap) return;

    try {
      setSaving(true);
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, {
          name: catName,
          description: catDesc || undefined
        });
      } else {
        await api.post('/categories', {
          roadmapId: roadmap.id,
          name: catName,
          description: catDesc || undefined,
          order: roadmap.categories?.length || 0
        });
      }
      setCategoryModalOpen(false);
      fetchRoadmap();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this category and all its skills?')) return;
    try {
      await api.delete(`/categories/${catId}`);
      fetchRoadmap();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error deleting category');
    }
  };

  // Skill CRUD
  const openCreateSkill = (catId: string) => {
    setTargetCategoryId(catId);
    setEditingSkill(null);
    setSkillTitle('');
    setSkillDesc('');
    setSkillNotes('');
    setSkillEstMinutes('');
    setSkillResourceUrl('');
    setUrlError(null);
    setSkillModalOpen(true);
  };

  const openEditSkill = (skill: Skill, e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetCategoryId(skill.categoryId);
    setEditingSkill(skill);
    setSkillTitle(skill.title);
    setSkillDesc(skill.description || '');
    setSkillNotes(skill.notes || '');
    setSkillEstMinutes(skill.estimatedMinutes || '');
    setSkillResourceUrl(skill.resourceUrl || '');
    setUrlError(null);
    setSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillTitle.trim() || !targetCategoryId) return;

    // Validate resourceUrl if provided
    let cleanUrl: string | undefined = undefined;
    if (skillResourceUrl.trim()) {
      let formattedUrl = skillResourceUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }
      try {
        new URL(formattedUrl);
        cleanUrl = formattedUrl;
      } catch {
        setUrlError('Please enter a valid URL (e.g. https://react.dev or mdn.io)');
        return;
      }
    }

    try {
      setSaving(true);
      setUrlError(null);
      const payload = {
        categoryId: targetCategoryId,
        title: skillTitle.trim(),
        description: skillDesc.trim() || undefined,
        notes: skillNotes.trim() || undefined,
        estimatedMinutes: skillEstMinutes !== '' ? Number(skillEstMinutes) : undefined,
        resourceUrl: cleanUrl || null
      };

      if (editingSkill) {
        await api.put(`/skills/${editingSkill.id}`, payload);
      } else {
        await api.post('/skills', payload);
      }

      setSkillModalOpen(false);
      fetchRoadmap();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving skill');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (skillId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this skill?')) return;
    try {
      await api.delete(`/skills/${skillId}`);
      fetchRoadmap();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error deleting skill');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
        <div className="h-10 bg-black/5 dark:bg-white/5 rounded-xl w-1/4"></div>
        <div className="h-40 bg-black/5 dark:bg-white/5 rounded-2xl"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-black/5 dark:bg-white/5 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="p-8 text-center rounded-2xl border border-[var(--color-brand-brick)]/20 bg-[var(--color-brand-brick)]/5 max-w-md mx-auto">
        <p className="text-sm font-semibold text-[var(--color-brand-brick)] mb-4">{error || 'Roadmap not found.'}</p>
        <Button onClick={() => navigate('/roadmaps')}>Back to Roadmaps</Button>
      </div>
    );
  }

  let totalSkills = 0;
  let completedSkills = 0;
  roadmap.categories?.forEach((c) => {
    c.skills?.forEach((s) => {
      totalSkills++;
      if (s.status === 'COMPLETED') completedSkills++;
    });
  });
  const progressPct = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/roadmaps')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all Roadmaps
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-[var(--bg-surface)] p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
              {roadmap.status}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black font-serif text-[var(--primary)] tracking-tight">
              {roadmap.title}
            </h1>
            {roadmap.description && (
              <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl">
                {roadmap.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={openCreateCategory} className="flex items-center gap-1.5 text-xs">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Progress Bar & Key Meta */}
        <div className="space-y-2 pt-4 border-t border-[var(--border-color)]">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span>Overall Roadmap Mastery</span>
            <span className="text-[var(--primary)] font-bold text-sm">{progressPct}%</span>
          </div>
          <div className="w-full bg-black/10 dark:bg-white/10 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-[var(--text-muted)] pt-1">
            <span>{completedSkills} of {totalSkills} skills completed</span>
            <span>Target: {roadmap.dailyTargetMinutes}m daily</span>
          </div>
        </div>
      </div>

      {/* Categories & Skills Hierarchy */}
      <div className="space-y-6">
        {roadmap.categories && roadmap.categories.length > 0 ? (
          roadmap.categories.map((category, catIndex) => (
            <div 
              key={category.id}
              className="relative pl-6 sm:pl-8 before:absolute before:inset-y-0 before:left-3 sm:before:left-4 before:w-0.5 before:bg-[var(--border-color)]"
            >
              {/* Category Milestone Marker */}
              <div className="absolute left-1.5 sm:left-2.5 top-3 w-4 h-4 rounded-full bg-[var(--primary)] border-4 border-[var(--bg-main)] shadow-sm flex items-center justify-center"></div>

              {/* Category Container */}
              <Card className="border-[var(--border-color)] shadow-sm">
                <CardHeader className="p-4 sm:p-5 flex flex-row items-center justify-between pb-3 border-b border-[var(--border-color)]">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        Stage {catIndex + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold font-serif text-[var(--text-main)]">
                        {category.name}
                      </h3>
                    </div>
                    {category.description && (
                      <p className="text-xs text-[var(--text-muted)]">{category.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openCreateSkill(category.id)}
                      className="text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Skill
                    </Button>
                    <button
                      onClick={(e) => openEditCategory(category, e)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteCategory(category.id, e)}
                      className="p-1.5 rounded-lg text-[var(--color-brand-brick)] hover:bg-[var(--color-brand-brick)]/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 pt-4">
                  {category.skills && category.skills.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {category.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                            skill.status === 'COMPLETED'
                              ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30'
                              : skill.status === 'IN_PROGRESS'
                              ? 'bg-[var(--secondary)]/10 border-[var(--secondary)]/30'
                              : 'bg-black/5 dark:bg-white/5 border-[var(--border-color)]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <span className="font-bold text-sm text-[var(--text-main)] block">
                                {skill.title}
                              </span>
                              {skill.description && (
                                <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">
                                  {skill.description}
                                </p>
                              )}
                              {skill.notes && (
                                <div className="mt-1.5 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--border-color)] text-[11px] text-[var(--text-main)]">
                                  <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider block mb-0.5">Notes</span>
                                  <p className="whitespace-pre-wrap">{skill.notes}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={(e) => openEditSkill(skill, e)}
                                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                                title="Edit Skill"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteSkill(skill.id, e)}
                                className="p-1 text-[var(--color-brand-brick)] hover:opacity-80"
                                title="Delete Skill"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                            {/* Left: Status button & Optional Resource Link */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleStatusChange(skill.id, skill.status, e)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all ${
                                  skill.status === 'COMPLETED'
                                    ? 'bg-[var(--accent)] text-white'
                                    : skill.status === 'IN_PROGRESS'
                                    ? 'bg-[var(--secondary)] text-white'
                                    : 'bg-black/10 dark:bg-white/10 text-[var(--text-muted)] hover:bg-black/20'
                                }`}
                                title="Click to cycle status: Not Started -> In Progress -> Completed"
                              >
                                <CircleDot className="w-3 h-3" />
                                {skill.status.replace('_', ' ')}
                              </button>

                              {skill.resourceUrl && (
                                <a
                                  href={skill.resourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--secondary)] hover:text-[var(--primary)] hover:underline px-2 py-0.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                  title={`Open resource: ${skill.resourceUrl}`}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span className="hidden sm:inline">Resource</span>
                                </a>
                              )}
                            </div>

                            {/* Right: Focus Button */}
                            <button
                              onClick={() => navigate('/learning', { state: { skillId: skill.id, roadmapId: roadmap.id } })}
                              className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              Focus
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-[var(--border-color)] rounded-xl">
                      <p className="text-xs text-[var(--text-muted)]">No skills added to this category yet.</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openCreateSkill(category.id)}
                        className="mt-2 text-xs"
                      >
                        Add Skill
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-[var(--border-color)] rounded-2xl bg-[var(--bg-surface)]">
            <Layers className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
            <h4 className="text-base font-bold font-serif">Break this Roadmap into Categories</h4>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
              Categories group related topics (e.g. Frontend, Backend, Database). Click below to create your first category.
            </p>
            <Button onClick={openCreateCategory} className="mt-4">
              Add Category
            </Button>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        description="Group skills into logical learning phases or modules."
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <Input
            label="Category Name *"
            placeholder="e.g. Foundations, Advanced APIs, Production Deployment"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--text-main)]">
              Description (Optional)
            </label>
            <textarea
              className="w-full h-20 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              placeholder="What core competencies are covered in this category?"
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
            <Button type="button" variant="outline" onClick={() => setCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Add Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Skill Modal */}
      <Modal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add Skill to Category'}
        description="Specify a concrete skill, framework, concept, or tool to master."
      >
        <form onSubmit={handleSaveSkill} className="space-y-4">
          <Input
            label="Skill Title *"
            placeholder="e.g. React Router, Docker Compose, SQL Indexing"
            value={skillTitle}
            onChange={(e) => setSkillTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--text-main)]">
              Description / Objectives (Optional)
            </label>
            <textarea
              className="w-full h-20 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              placeholder="What concepts will you master?"
              value={skillDesc}
              onChange={(e) => setSkillDesc(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--text-main)]">
              Personal Skill Notes (Optional)
            </label>
            <textarea
              className="w-full h-20 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              placeholder="e.g. Need to understand useEffect cleanup or tricky syntax notes..."
              value={skillNotes}
              onChange={(e) => setSkillNotes(e.target.value)}
            />
          </div>

          <Input
            label="Estimated Study Time (Minutes)"
            type="number"
            min="5"
            placeholder="e.g. 120"
            value={skillEstMinutes}
            onChange={(e) => setSkillEstMinutes(e.target.value === '' ? '' : Number(e.target.value))}
          />

          <Input
            label="Learning Resource URL (Optional)"
            type="url"
            placeholder="e.g. https://developer.mozilla.org or https://react.dev"
            value={skillResourceUrl}
            onChange={(e) => {
              setSkillResourceUrl(e.target.value);
              if (urlError) setUrlError(null);
            }}
            error={urlError || undefined}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
            <Button type="button" variant="outline" onClick={() => setSkillModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingSkill ? 'Update Skill' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoadmapDetail;
