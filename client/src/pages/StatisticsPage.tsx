import React, { useEffect, useState } from 'react';
import { 
  BarChart2, 
  Clock, 
  Flame, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Calendar, 
  PieChart as PieIcon,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import api from '../services/api';
import { StatisticsData } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const StatisticsPage: React.FC = () => {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/statistics');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-6xl mx-auto">
        <div className="h-10 bg-black/5 dark:bg-white/5 rounded-xl w-1/3"></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-black/5 dark:bg-white/5 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 bg-black/5 dark:bg-white/5 rounded-2xl"></div>
          <div className="h-80 bg-black/5 dark:bg-white/5 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center rounded-2xl border border-[var(--color-brand-brick)]/20 bg-[var(--color-brand-brick)]/5 max-w-md mx-auto">
        <p className="text-sm font-semibold text-[var(--color-brand-brick)] mb-4">{error || 'No statistics available.'}</p>
        <Button onClick={fetchStats}>Retry</Button>
      </div>
    );
  }

  const categoryColors = [
    'var(--primary)',
    'var(--secondary)',
    'var(--accent)',
    'var(--color-brand-ochre)',
    'var(--color-brand-stone)'
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Heading */}
      <div className="border-b border-[var(--border-color)] pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
          <BarChart2 className="w-4 h-4" />
          Deliberate Practice Analytics
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--primary)] font-serif">
          Learning Statistics & Insights
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Quantitative feedback on your time investment, streaks, and competency mastery.
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Time */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              All-Time Focus
            </CardTitle>
            <Clock className="w-4 h-4 text-[var(--primary)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-[var(--primary)]">
              {stats.totalHours} <span className="text-xs font-semibold text-[var(--text-muted)]">Hours</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
              {stats.totalMinutes} total minutes recorded
            </p>
          </CardContent>
        </Card>

        {/* This Week vs This Month */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Recent Velocity
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-[var(--secondary)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-[var(--secondary)]">
              {stats.weekMinutes}m <span className="text-xs font-semibold text-[var(--text-muted)]">this week</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
              {stats.monthMinutes} minutes this month
            </p>
          </CardContent>
        </Card>

        {/* Consistency Streak */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Current Streak
            </CardTitle>
            <Flame className="w-4 h-4 text-[var(--color-brand-ochre)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-[var(--color-brand-ochre)]">
              {stats.currentStreak} <span className="text-xs font-semibold text-[var(--text-muted)]">Days</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
              Longest streak: {stats.longestStreak} days
            </p>
          </CardContent>
        </Card>

        {/* Skills Mastered */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Skills Completed
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-black text-[var(--accent)]">
              {stats.completedSkills} <span className="text-xs font-semibold text-[var(--text-muted)]">/ {stats.totalSkills}</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
              {stats.inProgressSkills} currently in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 30-Day Activity Trend Bar Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-bold font-serif">30-Day Focus Minutes Heatmap</CardTitle>
            <p className="text-xs text-[var(--text-muted)]">Daily minutes dedicated to deliberate practice</p>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.last30Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="label" 
                  stroke="var(--text-muted)" 
                  fontSize={10} 
                  tickLine={false} 
                  interval={3}
                />
                <YAxis 
                  stroke="var(--text-muted)" 
                  fontSize={10} 
                  tickLine={false} 
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
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                  {stats.last30Days.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.minutes > 0 ? 'var(--primary)' : 'var(--color-brand-stone)'} 
                      opacity={entry.minutes > 0 ? 0.9 : 0.15}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2-Col Grid: Category Distribution & Productivity By Day */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Time Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold font-serif">Category Time Breakdown</CardTitle>
            <p className="text-xs text-[var(--text-muted)]">Hours distributed by discipline</p>
          </CardHeader>
          <CardContent className="pt-4">
            {stats.categoryDistribution.length > 0 ? (
              <div className="space-y-3">
                {stats.categoryDistribution.map((cat, idx) => {
                  const color = categoryColors[idx % categoryColors.length];
                  const total = stats.totalMinutes || 1;
                  const pct = Math.round((cat.minutes / total) * 100);
                  return (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                          {cat.name}
                        </span>
                        <span>{cat.hours} hrs ({pct}%)</span>
                      </div>
                      <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-[var(--text-muted)]">
                Record focus sessions to see your category breakdown.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Most Productive Days of the Week */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold font-serif">Productivity by Day of Week</CardTitle>
            <p className="text-xs text-[var(--text-muted)]">Cumulative focus minutes per day</p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.productivityByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <Tooltip 
                    formatter={(val: any) => [`${val} minutes`, 'Total Focus']}
                    contentStyle={{ 
                      backgroundColor: 'var(--bg-surface)', 
                      borderColor: 'var(--border-color)',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="minutes" fill="var(--secondary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roadmap Completion Status Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold font-serif">Roadmap Completion Overview</CardTitle>
          <p className="text-xs text-[var(--text-muted)]">Status across all created curriculum roadmaps</p>
        </CardHeader>
        <CardContent className="pt-4">
          {stats.roadmapSummaries.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.roadmapSummaries.map((rm) => (
                <div key={rm.id} className="p-4 rounded-xl border border-[var(--border-color)] bg-black/5 dark:bg-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="truncate">{rm.title}</span>
                    <span className="text-[var(--primary)] font-extrabold">{rm.progress}%</span>
                  </div>
                  <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[var(--primary)] h-full rounded-full transition-all duration-300"
                      style={{ width: `${rm.progress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {rm.completedSkills} of {rm.totalSkills} skills mastered
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-[var(--text-muted)]">
              No roadmaps available to analyze.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPage;
