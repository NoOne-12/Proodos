import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Flame, 
  Clock, 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  Play, 
  Plus, 
  ArrowRight, 
  BookOpen, 
  Sparkles,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { RootState } from '../store';
import api from '../services/api';
import { DashboardStats, Roadmap, Goal } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, roadmapsRes, goalsRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/roadmaps'),
        api.get('/goals')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (roadmapsRes.data.success) setRoadmaps(roadmapsRes.data.data);
      if (goalsRes.data.success) setGoals(goalsRes.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-black/5 dark:bg-white/5 rounded-2xl w-1/3"></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-black/5 dark:bg-white/5 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-80 bg-black/5 dark:bg-white/5 rounded-2xl"></div>
          <div className="h-80 bg-black/5 dark:bg-white/5 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center rounded-2xl border border-[var(--color-brand-brick)]/20 bg-[var(--color-brand-brick)]/5">
        <p className="text-[var(--color-brand-brick)] font-semibold mb-4">Error: {error}</p>
        <Button onClick={fetchDashboardData}>Try Again</Button>
      </div>
    );
  }

  const activeRoadmap = roadmaps.find(r => r.status === 'ACTIVE') || roadmaps[0];
  const activeGoals = goals.filter(g => g.status === 'ACTIVE');

  return (
    <div className="space-y-8">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-surface)] p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Personal Learning OS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--primary)] font-serif">
            Welcome back, {user?.name || 'Scholar'}!
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            {stats && stats.todaysLearningTime >= stats.todaysTarget
              ? "🎯 You've hit your daily learning target! Consistency builds mastery."
              : `You are ${Math.max(0, (stats?.todaysTarget || 30) - (stats?.todaysLearningTime || 0))} minutes away from today's target.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button 
            onClick={() => navigate('/roadmaps')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Roadmaps
          </Button>
          <Button 
            onClick={() => navigate('/learning')}
            className="flex items-center gap-2 bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 shadow-md"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Learning
          </Button>
        </div>
      </div>

      {/* 4 Core Summary Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Target */}
        <Card className="hover:border-[var(--secondary)]/50 transition-colors">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Today's Focus
            </CardTitle>
            <Clock className="w-4 h-4 text-[var(--secondary)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-[var(--secondary)]">
              {stats?.todaysLearningTime || 0} <span className="text-xs font-semibold text-[var(--text-muted)]">/ {stats?.todaysTarget || 30} min</span>
            </div>
            <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-[var(--secondary)] h-full transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, ((stats?.todaysLearningTime || 0) / (stats?.todaysTarget || 30)) * 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Current & Longest Streak */}
        <Card className="hover:border-[var(--color-brand-ochre)]/50 transition-colors">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Consistency Streak
            </CardTitle>
            <Flame className="w-4 h-4 text-[var(--color-brand-ochre)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-[var(--color-brand-ochre)] flex items-baseline gap-1">
              {stats?.currentStreak || 0} <span className="text-xs font-semibold text-[var(--text-muted)]">Days</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[var(--color-brand-ochre)]" />
              All-time record: <span className="font-bold text-[var(--text-main)]">{stats?.longestStreak || 0} days</span>
            </p>
          </CardContent>
        </Card>

        {/* Roadmap Progress */}
        <Card className="hover:border-[var(--primary)]/50 transition-colors">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Active Roadmap
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-[var(--primary)]">
              {stats?.overallProgress || 0}%
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2 truncate">
              {activeRoadmap ? activeRoadmap.title : 'No active roadmap'}
            </p>
          </CardContent>
        </Card>

        {/* Skills Mastered */}
        <Card className="hover:border-[var(--accent)]/50 transition-colors">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Skills Mastered
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-[var(--accent)]">
              {stats?.completedSkillsCount || 0}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              <span className="font-semibold text-[var(--secondary)]">{stats?.inProgressSkillsCount || 0} in progress</span> • {stats?.remainingSkillsCount || 0} remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Weekly Consistency Graph & Active Roadmap Preview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Learning Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">7-Day Learning Activity</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Focus minutes tracked daily</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/statistics')} className="text-xs">
              View Analytics <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            {stats && stats.weeklyChart.some(d => d.minutes > 0) ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.weeklyChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="dayName" 
                      stroke="var(--text-muted)" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="var(--text-muted)" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <Tooltip 
                      formatter={(val: any) => [`${val} minutes`, 'Focus Time']}
                      contentStyle={{ 
                        backgroundColor: 'var(--bg-surface)', 
                        borderColor: 'var(--border-color)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: 'var(--text-main)'
                      }}
                    />
                    <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                      {stats.weeklyChart.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.minutes > 0 ? 'var(--primary)' : 'var(--color-brand-stone)'} 
                          opacity={entry.minutes > 0 ? 1 : 0.2}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] rounded-xl text-center p-6">
                <Clock className="w-8 h-8 text-[var(--text-muted)] mb-2 opacity-50" />
                <p className="text-xs font-semibold text-[var(--text-main)]">No focus sessions recorded this week</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-1 mb-4">Start your first learning session to populate your consistency heatmap.</p>
                <Button size="sm" onClick={() => navigate('/learning')}>Start Learning Session</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Goals Panel */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Active Goals</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Target milestones</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/goals')} className="text-xs">
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between pt-2">
            {activeGoals.length > 0 ? (
              <div className="space-y-3">
                {activeGoals.slice(0, 3).map((goal) => {
                  const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
                  return (
                    <div key={goal.id} className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)]">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="truncate">{goal.title}</span>
                        <span className="text-[var(--primary)] font-bold">{pct}%</span>
                      </div>
                      <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-[var(--accent)] h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] mt-1.5">
                        <span>{goal.currentValue} / {goal.targetValue} {goal.type === 'DURATION' ? 'mins' : 'skills'}</span>
                        {goal.deadline && <span>Due {new Date(goal.deadline).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-4 text-center border border-dashed border-[var(--border-color)] rounded-xl my-2">
                <Target className="w-7 h-7 text-[var(--text-muted)] mb-2 opacity-50" />
                <p className="text-xs font-semibold">No active goals</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">Set a deadline or target time goal to stay on track.</p>
                <Button size="sm" variant="outline" className="mt-3 text-xs" onClick={() => navigate('/goals')}>
                  Create Goal
                </Button>
              </div>
            )}

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/goals')}
              className="w-full mt-4 text-xs"
            >
              Manage All Goals
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Active Roadmap Breakdown & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Roadmap Detailed Snapshot */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Roadmap Overview</CardTitle>
              <p className="text-xs text-[var(--text-muted)]">
                {activeRoadmap ? activeRoadmap.title : 'No roadmap selected'}
              </p>
            </div>
            {activeRoadmap && (
              <Button size="sm" onClick={() => navigate(`/roadmaps/${activeRoadmap.id}`)} className="text-xs">
                Open Roadmap <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-2">
            {activeRoadmap && activeRoadmap.categories?.length > 0 ? (
              <div className="space-y-4">
                {activeRoadmap.categories.slice(0, 3).map((category) => (
                  <div key={category.id} className="p-3.5 rounded-xl border border-[var(--border-color)] bg-black/5 dark:bg-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">{category.name}</h4>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        {category.skills.filter(s => s.status === 'COMPLETED').length} / {category.skills.length} Completed
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {category.skills.map((skill) => (
                        <span
                          key={skill.id}
                          onClick={() => navigate(`/roadmaps/${activeRoadmap.id}`)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all ${
                            skill.status === 'COMPLETED' 
                              ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30 font-semibold' 
                              : skill.status === 'IN_PROGRESS'
                              ? 'bg-[var(--secondary)]/20 text-[var(--secondary)] border border-[var(--secondary)]/30 font-semibold'
                              : 'bg-black/5 dark:bg-white/10 text-[var(--text-muted)] hover:border-[var(--border-color)]'
                          }`}
                        >
                          {skill.title}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-[var(--border-color)] rounded-xl">
                <BookOpen className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">You don't have any roadmaps configured.</p>
                <Button size="sm" className="mt-3 text-xs" onClick={() => navigate('/roadmaps')}>
                  Create Learning Roadmap
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Focus Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
              <p className="text-xs text-[var(--text-muted)]">Latest recorded sessions</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="text-xs">
              All
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            {stats && stats.recentActivity?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.map((session) => (
                  <div key={session.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-[var(--border-color)] bg-black/5 dark:bg-white/5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--secondary)]/15 text-[var(--secondary)] flex items-center justify-center font-bold text-xs shrink-0">
                      {session.durationMinutes}m
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[var(--text-main)] truncate">
                        {session.skill?.title || 'Focused Study'}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">
                        {new Date(session.startedAt).toLocaleDateString()} • {session.skill?.category?.name || 'General'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-[var(--text-muted)]">
                No recent study sessions recorded yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
