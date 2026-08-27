export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  createdAt: string;
}

export type SkillStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type RoadmapStatus = 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';
export type GoalType = 'DEADLINE' | 'DURATION' | 'COUNT';
export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'FAILED';

export interface Skill {
  id: string;
  categoryId: string;
  title: string;
  description?: string | null;
  notes?: string | null;
  status: SkillStatus;
  order: number;
  estimatedMinutes?: number | null;
  resourceUrl?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  roadmapId: string;
  name: string;
  description?: string | null;
  order: number;
  skills: Skill[];
}

export interface Roadmap {
  id: string;
  userId: string;
  title: string;
  description?: string | null;
  targetDate?: string | null;
  dailyTargetMinutes: number;
  status: RoadmapStatus;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
}

export interface LearningSession {
  id: string;
  userId: string;
  skillId: string;
  skill?: Skill & {
    category?: Category & {
      roadmap?: Roadmap;
    };
  };
  startedAt: string;
  endedAt?: string | null;
  durationMinutes: number;
  notes?: string | null;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  roadmapId?: string | null;
  roadmap?: {
    id: string;
    title: string;
  } | null;
  title: string;
  description?: string | null;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  deadline?: string | null;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'STREAK' | 'GOAL' | 'ACHIEVEMENT' | 'REMINDER' | 'INFO';
  linkUrl?: string | null;
  read: boolean;
  createdAt: string;
}

export interface ActivityDay {
  date: string;
  dayName: string;
  monthName: string;
  minutes: number;
  count: number;
  level: number; // 0, 1, 2, 3
}

export interface DashboardStats {
  todaysLearningTime: number;
  todaysTarget: number;
  weeklyLearningMinutes: number;
  currentStreak: number;
  longestStreak: number;
  overallProgress: number;
  completedSkillsCount: number;
  inProgressSkillsCount: number;
  remainingSkillsCount: number;
  recommendedSkill?: (Skill & {
    categoryName: string;
    roadmapTitle: string;
    roadmapId: string;
  }) | null;
  weeklyChart: Array<{
    date: string;
    dayName: string;
    minutes: number;
  }>;
  activityCalendar: ActivityDay[];
  recentActivity: LearningSession[];
}

export interface StatisticsData {
  totalHours: number;
  totalMinutes: number;
  todayMinutes: number;
  weekMinutes: number;
  monthMinutes: number;
  totalSkills: number;
  completedSkills: number;
  inProgressSkills: number;
  notStartedSkills: number;
  currentStreak: number;
  longestStreak: number;
  roadmapSummaries: Array<{
    id: string;
    title: string;
    status: RoadmapStatus;
    totalSkills: number;
    completedSkills: number;
    progress: number;
  }>;
  categoryDistribution: Array<{
    name: string;
    minutes: number;
    hours: number;
  }>;
  last30Days: Array<{
    date: string;
    label: string;
    minutes: number;
  }>;
  productivityByDay: Array<{
    day: string;
    minutes: number;
  }>;
}

export interface SearchResults {
  roadmaps: Array<{
    id: string;
    title: string;
    description?: string | null;
    status: RoadmapStatus;
    dailyTargetMinutes: number;
  }>;
  skills: Array<Skill & {
    category: {
      id: string;
      name: string;
      roadmapId: string;
      roadmap: { id: string; title: string };
    };
  }>;
  goals: Goal[];
  learningSessions: Array<LearningSession & {
    skill?: { id: string; title: string };
  }>;
}
