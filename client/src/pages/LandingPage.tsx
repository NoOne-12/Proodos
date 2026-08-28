import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Map, 
  CheckCircle2, 
  Clock, 
  Target, 
  TrendingUp, 
  Flame, 
  History, 
  ExternalLink, 
  ArrowRight, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Sparkles, 
  Layers, 
  Play, 
  BookOpen, 
  Calendar, 
  Check, 
  Code2, 
  Compass, 
  GraduationCap, 
  Briefcase, 
  UserCheck, 
  ShieldCheck, 
  ChevronRight,
  CircleDot,
  BarChart3,
  Timer
} from 'lucide-react';
import { RootState } from '../store';
import { Button, cn } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Interactive sample state for hero interactive demo tabs
  const [activeHeroTab, setActiveHeroTab] = useState<'roadmap' | 'stats' | 'session'>('roadmap');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Map,
      title: 'Learning Roadmaps',
      description: 'Create and organize your custom learning roadmap with milestones, categories, and targeted deadlines.',
      badge: 'Architecture'
    },
    {
      icon: CheckCircle2,
      title: 'Skill Tracking',
      description: 'Track granular skills across three distinct states: Not Started, In Progress, and Completed.',
      badge: 'Execution'
    },
    {
      icon: Timer,
      title: 'Learning Sessions',
      description: 'Record live learning duration with our built-in focus timer and session notes to form lasting habits.',
      badge: 'Focus'
    },
    {
      icon: Target,
      title: 'Actionable Goals',
      description: 'Set daily and weekly learning goals, measure completion percentage, and stay accountable.',
      badge: 'Discipline'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Visualize roadmap, category, and skill progress with granular completion rates and milestone analytics.',
      badge: 'Clarity'
    },
    {
      icon: Flame,
      title: 'Streaks & Consistency',
      description: 'Visualize daily activity with interactive contribution heatmaps and maintain ongoing learning streaks.',
      badge: 'Momentum'
    },
    {
      icon: History,
      title: 'Learning History',
      description: 'Review logs of past focus sessions, notes, time invested, and skill progression over weeks and months.',
      badge: 'Reflection'
    },
    {
      icon: ExternalLink,
      title: 'Resource Links',
      description: 'Attach documentation, articles, courses, and reference material directly to individual skills.',
      badge: 'Knowledge'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Create your roadmap',
      description: 'Build a roadmap around what you want to learn. Structure it into logical categories, skills, and target deadlines.'
    },
    {
      num: '02',
      title: 'Learn consistently',
      description: 'Track your learning sessions and daily progress. Start focus sessions with the timer and log your key takeaways.'
    },
    {
      num: '03',
      title: 'Complete skills',
      description: 'Mark skills as you master them and watch your roadmap evolve from initial concepts to demonstrated mastery.'
    },
    {
      num: '04',
      title: 'Measure your growth',
      description: 'Review your total learning hours, active streaks, weekly goals, and long-term skill progression over time.'
    }
  ];

  const personas = [
    {
      icon: GraduationCap,
      title: 'Students & Academics',
      description: 'Master complex course curricula, prepare for technical exams, and manage semester study plans with structured milestones.'
    },
    {
      icon: Code2,
      title: 'Software Engineers',
      description: 'Systematically master new frameworks, backend architectures, system design, and open-source stacks step by step.'
    },
    {
      icon: Compass,
      title: 'Self-Directed Learners',
      description: 'Turn scattered bookmarks, videos, and tutorials into a single coherent path with measurable proof of progress.'
    },
    {
      icon: Briefcase,
      title: 'Career Changers',
      description: 'Build foundational and advanced industry competencies needed to transition smoothly into high-impact roles.'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans antialiased transition-colors duration-200 selection:bg-[var(--primary)] selection:text-white">
      
      {/* ========================================================
          PUBLIC NAVIGATION HEADER
         ======================================================== */}
      <header className="sticky top-0 z-50 bg-[var(--bg-surface)]/90 backdrop-blur-md border-b border-[var(--border-color)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 rounded-xl p-1">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-serif font-black text-xl shadow-md transition-transform group-hover:scale-105">
              Π
            </div>
            <div>
              <span className="text-xl font-black font-serif tracking-wider text-[var(--primary)] block leading-none">
                PROODOS
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[var(--text-muted)] block mt-0.5">
                Learning OS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            <button 
              onClick={() => scrollToSection('problem')}
              className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              Why Proodos
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('preview')}
              className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              Product
            </button>
            <button 
              onClick={() => scrollToSection('consistency')}
              className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              Progress
            </button>
          </nav>

          {/* Right Actions: Theme Toggle + Auth CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[var(--color-brand-ochre)]" /> : <Moon className="w-4 h-4 text-[var(--primary)]" />}
            </button>

            {isAuthenticated ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="sm"
                className="gap-2 font-semibold shadow-sm px-4"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-xs text-[var(--text-main)]">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="font-semibold text-xs shadow-sm px-4">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)]"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[var(--color-brand-ochre)]" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
              <button 
                onClick={() => scrollToSection('problem')}
                className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
              >
                Why Proodos
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('preview')}
                className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
              >
                Product Preview
              </button>
              <button 
                onClick={() => scrollToSection('consistency')}
                className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
              >
                Consistency System
              </button>
            </nav>

            <div className="pt-4 border-t border-[var(--border-color)] flex flex-col gap-2.5">
              {isAuthenticated ? (
                <Button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/dashboard');
                  }} 
                  className="w-full justify-center"
                >
                  Enter Application
                </Button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center">
                      Start Learning
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ========================================================
            HERO SECTION
           ======================================================== */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[var(--border-color)]">
          {/* Subtle Ambient Background Accents */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[var(--primary)]/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Hero Copy & Actions */}
              <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
                
                {/* Product Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-muted)] shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-brand-moss)] animate-pulse" />
                  <span className="font-serif tracking-wider font-bold text-[var(--primary)]">PROODOS OS</span>
                  <span className="text-[var(--border-color)]">•</span>
                  <span>Personal Roadmap & Habit Engine</span>
                </div>

                {/* Main Headline */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-[var(--text-main)] leading-[1.1]">
                    Turn Learning Into <span className="text-[var(--primary)] underline decoration-[var(--secondary)] decoration-wavy decoration-2 underline-offset-8">Progress</span>.
                  </h1>
                  <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                    Build your learning roadmap, stay consistent, track your progress, and turn your goals into real skills with Proodos.
                  </p>
                </div>

                {/* CTA Group */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto font-semibold gap-3 shadow-md hover:shadow-lg transition-all group">
                      <span>Start Learning</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => scrollToSection('features')}
                    className="w-full sm:w-auto font-medium text-[var(--text-main)] border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Explore Proodos
                  </Button>
                </div>

                {/* Key Philosophy Pillars */}
                <div className="pt-6 border-t border-[var(--border-color)] flex items-center justify-center lg:justify-start gap-6 sm:gap-8 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                    <span>Consistency</span>
                  </div>
                  <span className="text-[var(--border-color)]">→</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)]" />
                    <span>Progress</span>
                  </div>
                  <span className="text-[var(--border-color)]">→</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-moss)]" />
                    <span>Growth</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Realistic Proodos UI Product Preview */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden transition-all">
                  
                  {/* Mock Window Top Bar */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[var(--color-brand-brick)]/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-[var(--color-brand-ochre)]/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-[var(--color-brand-moss)]/80 inline-block" />
                      <span className="ml-2 font-mono text-[11px] text-[var(--text-muted)]">app.proodos.os / roadmap-preview</span>
                    </div>
                    
                    {/* Switchable Interactive Tabs */}
                    <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-0.5 rounded-lg border border-[var(--border-color)]">
                      <button
                        onClick={() => setActiveHeroTab('roadmap')}
                        className={cn(
                          "px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer",
                          activeHeroTab === 'roadmap' ? "bg-[var(--primary)] text-white shadow-2xs" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                        )}
                      >
                        Roadmap
                      </button>
                      <button
                        onClick={() => setActiveHeroTab('stats')}
                        className={cn(
                          "px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer",
                          activeHeroTab === 'stats' ? "bg-[var(--primary)] text-white shadow-2xs" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                        )}
                      >
                        Consistency
                      </button>
                      <button
                        onClick={() => setActiveHeroTab('session')}
                        className={cn(
                          "px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer",
                          activeHeroTab === 'session' ? "bg-[var(--primary)] text-white shadow-2xs" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                        )}
                      >
                        Focus
                      </button>
                    </div>
                  </div>

                  {/* Tab 1: Roadmap View */}
                  {activeHeroTab === 'roadmap' && (
                    <div className="p-5 sm:p-6 space-y-5">
                      {/* Roadmap Header */}
                      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--primary)]/10 text-[var(--primary)]">ACTIVE</span>
                            <span className="text-[11px] text-[var(--text-muted)]">Target: Dec 31, 2026</span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold font-serif text-[var(--text-main)] mt-1">
                            Distributed Systems & Cloud Architecture
                          </h3>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-2xl font-black font-serif text-[var(--primary)]">68%</span>
                          <span className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Completed</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="w-full bg-black/5 dark:bg-white/5 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--color-brand-moss)] h-full rounded-full transition-all duration-500" style={{ width: '68%' }} />
                        </div>
                        <div className="flex justify-between text-[11px] text-[var(--text-muted)]">
                          <span>17 of 25 skills mastered</span>
                          <span>3 categories</span>
                        </div>
                      </div>

                      {/* Sample Category & Skills */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                          <div className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[var(--primary)]" />
                            <span>Module 2: Consensus & Replication</span>
                          </div>
                          <span className="text-[11px] font-semibold text-[var(--color-brand-moss)]">3 / 4 Done</span>
                        </div>

                        <div className="space-y-2">
                          <div className="p-3 rounded-xl border border-[var(--border-color)] bg-black/2 dark:bg-white/2 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-[var(--color-brand-moss)]/20 text-[var(--color-brand-moss)] flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-[var(--text-main)]">Raft Consensus Algorithm</p>
                                <p className="text-[10px] text-[var(--text-muted)]">Leader election & log replication invariants</p>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[var(--color-brand-moss)]/15 text-[var(--color-brand-moss)]">
                              COMPLETED
                            </span>
                          </div>

                          <div className="p-3 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-[var(--secondary)]/20 text-[var(--secondary)] flex items-center justify-center animate-pulse">
                                <CircleDot className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-[var(--text-main)]">Vector Clocks & Causality</p>
                                <p className="text-[10px] text-[var(--text-muted)]">Detecting concurrent conflict in Dynamo</p>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[var(--secondary)]/20 text-[var(--secondary)]">
                              IN PROGRESS
                            </span>
                          </div>

                          <div className="p-3 rounded-xl border border-[var(--border-color)] bg-black/2 dark:bg-white/2 flex items-center justify-between opacity-75">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 text-[var(--text-muted)] flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-current" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-[var(--text-main)]">Byzantine Fault Tolerance</p>
                                <p className="text-[10px] text-[var(--text-muted)]">PBFT and asymmetric signature validation</p>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-black/5 dark:bg-white/5 text-[var(--text-muted)]">
                              NOT STARTED
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Consistency View */}
                  {activeHeroTab === 'stats' && (
                    <div className="p-5 sm:p-6 space-y-5">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl border border-[var(--border-color)] bg-black/2 dark:bg-white/2 text-center">
                          <div className="flex items-center justify-center gap-1 text-[var(--secondary)] mb-1">
                            <Flame className="w-4 h-4 fill-current" />
                            <span className="text-lg font-black font-serif">14 Days</span>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Current Streak</span>
                        </div>
                        <div className="p-3 rounded-xl border border-[var(--border-color)] bg-black/2 dark:bg-white/2 text-center">
                          <div className="flex items-center justify-center gap-1 text-[var(--primary)] mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-lg font-black font-serif">48.5 hrs</span>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Total Focused</span>
                        </div>
                        <div className="p-3 rounded-xl border border-[var(--border-color)] bg-black/2 dark:bg-white/2 text-center">
                          <div className="flex items-center justify-center gap-1 text-[var(--color-brand-moss)] mb-1">
                            <Target className="w-4 h-4" />
                            <span className="text-lg font-black font-serif">92%</span>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Weekly Goal</span>
                        </div>
                      </div>

                      {/* Mini Heatmap Visualization */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[var(--text-main)]">Learning Activity Calendar</span>
                          <span className="text-[10px] text-[var(--text-muted)]">Past 4 Weeks</span>
                        </div>
                        <div className="grid grid-flow-col grid-rows-7 gap-1.5 p-3 rounded-xl border border-[var(--border-color)] bg-black/2 dark:bg-white/2">
                          {[
                            3, 2, 4, 1, 3, 2, 0,
                            2, 3, 4, 3, 2, 4, 1,
                            4, 3, 2, 4, 3, 4, 3,
                            3, 4, 4, 2, 3, 4, 4
                          ].map((level, i) => (
                            <div
                              key={i}
                              className={cn(
                                "w-full h-3 rounded-[3px] transition-colors",
                                level === 0 && "bg-black/5 dark:bg-white/5",
                                level === 1 && "bg-[var(--primary)]/25",
                                level === 2 && "bg-[var(--primary)]/50",
                                level === 3 && "bg-[var(--primary)]/80",
                                level === 4 && "bg-[var(--primary)]"
                              )}
                              title={`Day ${i + 1}: ${level * 30} mins logged`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-end gap-1.5 text-[9px] text-[var(--text-muted)]">
                          <span>Less</span>
                          <span className="w-2.5 h-2.5 rounded-[2px] bg-black/5 dark:bg-white/5" />
                          <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--primary)]/25" />
                          <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--primary)]/50" />
                          <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--primary)]/80" />
                          <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--primary)]" />
                          <span>More</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Focus Session View */}
                  {activeHeroTab === 'session' && (
                    <div className="p-5 sm:p-6 space-y-5 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--secondary)]">Active Focus Session</span>
                        <h4 className="text-sm font-bold text-[var(--text-main)]">Vector Clocks & Causality</h4>
                      </div>

                      {/* Big Digital Timer Display */}
                      <div className="py-4 font-mono font-black text-4xl sm:text-5xl text-[var(--primary)] tracking-widest">
                        00:42:15
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <div className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold flex items-center gap-2 shadow-xs">
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Focusing</span>
                        </div>
                        <div className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-xs font-semibold text-[var(--text-muted)]">
                          Goal: 60 mins
                        </div>
                      </div>

                      <div className="p-3 rounded-xl border border-[var(--border-color)] bg-black/2 dark:bg-white/2 text-left text-xs space-y-1">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Session Notes:</span>
                        <p className="text-[11px] text-[var(--text-main)] italic">
                          "Implemented logical timestamp array comparison in Python. Tested clock drift scenarios..."
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 1 — THE PROBLEM
           ======================================================== */}
        <section id="problem" className="py-20 border-b border-[var(--border-color)] bg-black/2 dark:bg-white/2">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--secondary)]">
              <span>The Reality of Learning</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-serif text-[var(--text-main)] tracking-tight">
              Learning is easy to start.<br />
              <span className="text-[var(--primary)]">Consistency is hard to maintain.</span>
            </h2>

            <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed font-normal">
              People collect courses, tutorials, bookmarks, and fragmented roadmaps, but often lose track of what they are actually learning and how far they have come.
            </p>

            <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm max-w-2xl mx-auto text-left space-y-3">
              <div className="flex items-center gap-3 text-[var(--primary)]">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <h3 className="text-base font-bold text-[var(--text-main)]">
                  Proodos gives learning structure and makes progress visible.
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-normal pl-11">
                By organizing topics into milestone roadmaps, tracking live focus sessions, and celebrating daily momentum, you transform fragmented study hours into tangible skill mastery.
              </p>
            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION 2 — CORE FEATURES
           ======================================================== */}
        <section id="features" className="py-24 border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--primary)]">
                <span>Everything You Need</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-serif text-[var(--text-main)] tracking-tight">
                Designed for Serious Personal Growth
              </h2>
              <p className="text-base text-[var(--text-muted)]">
                A purposeful toolkit built to organize skills, monitor learning sessions, and protect your consistency.
              </p>
            </div>

            {/* 8 Features Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm hover:shadow-md hover:border-[var(--primary)]/40 transition-all space-y-4 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-serif text-[var(--text-main)]">
                      {feature.title}
                    </h3>

                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center text-[11px] font-semibold text-[var(--primary)] gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION 3 — HOW IT WORKS
           ======================================================== */}
        <section id="how-it-works" className="py-24 border-b border-[var(--border-color)] bg-black/2 dark:bg-white/2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--primary)]">
                <span>The Proodos Workflow</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-serif text-[var(--text-main)] tracking-tight">
                Simple Steps to Daily Consistency
              </h2>
              <p className="text-base text-[var(--text-muted)]">
                Four deliberate steps that turn long-term aspirations into measurable daily execution.
              </p>
            </div>

            {/* 4 Steps Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {steps.map((step, idx) => (
                <div key={idx} className="relative space-y-4 p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm">
                  <div className="text-3xl font-black font-serif text-[var(--primary)]/40">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold font-serif text-[var(--text-main)]">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION 4 — PRODUCT PREVIEW
           ======================================================== */}
        <section id="preview" className="py-24 border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--primary)]">
                <span>Interface Preview</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-serif text-[var(--text-main)] tracking-tight">
                A Serious Workspace for Focused Learning
              </h2>
              <p className="text-base text-[var(--text-muted)]">
                Clean, uncluttered, and built around your personal flow. No algorithmic distraction feeds.
              </p>
            </div>

            {/* 3 Realistic Feature Cards Preview */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Card 1: Dashboard Overview */}
              <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
                    <h3 className="text-sm font-bold font-serif">Executive Dashboard</h3>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">Overview</span>
                </div>
                
                <p className="text-xs text-[var(--text-muted)]">
                  Get a high-level summary of active roadmaps, today's goals, current streaks, and recent focus milestones at a single glance.
                </p>

                <div className="p-4 rounded-xl bg-black/2 dark:bg-white/2 border border-[var(--border-color)] space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Active Roadmaps</span>
                    <span className="text-[var(--primary)] font-serif font-black">3 in progress</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Weekly Target</span>
                    <span className="text-[var(--secondary)] font-serif font-black">7.5 / 10 hrs</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>Mastery Level</span>
                    <span className="text-[var(--color-brand-moss)] font-serif font-black">42 Skills Total</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Roadmap Hierarchy */}
              <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--secondary)]" />
                    <h3 className="text-sm font-bold font-serif">Structured Skill Tree</h3>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">Categories</span>
                </div>
                
                <p className="text-xs text-[var(--text-muted)]">
                  Break vast subjects into digestible modules, track exact states, and store reference documentation for every single skill.
                </p>

                <div className="p-4 rounded-xl bg-black/2 dark:bg-white/2 border border-[var(--border-color)] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--text-main)]">1. Core Fundamentals</span>
                    <span className="text-[10px] font-bold text-[var(--color-brand-moss)]">100%</span>
                  </div>
                  <div className="w-full bg-black/5 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[var(--color-brand-moss)] h-full w-full" />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-semibold text-[var(--text-main)]">2. Advanced Implementations</span>
                    <span className="text-[10px] font-bold text-[var(--secondary)]">60%</span>
                  </div>
                  <div className="w-full bg-black/5 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[var(--secondary)] h-full w-3/5" />
                  </div>
                </div>
              </div>

              {/* Card 3: Deep Focus Timer */}
              <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-moss)]" />
                    <h3 className="text-sm font-bold font-serif">Deep Focus Engine</h3>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">Sessions</span>
                </div>
                
                <p className="text-xs text-[var(--text-muted)]">
                  Eliminate context switching. Start a live timer directly connected to the skill you are studying and archive key insights.
                </p>

                <div className="p-4 rounded-xl bg-black/2 dark:bg-white/2 border border-[var(--border-color)] space-y-3 text-center">
                  <div className="text-2xl font-black font-mono text-[var(--primary)]">
                    45m 00s
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Session In Progress • Rust Async/Await
                  </div>
                  <div className="text-[11px] text-[var(--text-main)] bg-[var(--bg-surface)] p-2 rounded-lg border border-[var(--border-color)] truncate">
                    Notes saved: Tokio runtime spawn mechanics
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION 5 — PROGRESS / CONSISTENCY
           ======================================================== */}
        <section id="consistency" className="py-24 border-b border-[var(--border-color)] bg-black/2 dark:bg-white/2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--secondary)]">
                <span>Proof of Effort</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-serif text-[var(--text-main)] tracking-tight">
                Make Your Progress Visible
              </h2>
              <p className="text-base text-[var(--text-muted)]">
                You cannot improve what you do not measure. Proodos gives you objective proof of your daily dedication.
              </p>
            </div>

            {/* Comprehensive Consistency Dashboard Mockup */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xl space-y-8 max-w-5xl mx-auto">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-black/2 dark:bg-white/2 border border-[var(--border-color)]">
                  <div className="flex items-center gap-1.5 text-[var(--secondary)] mb-1">
                    <Flame className="w-4 h-4 fill-current" />
                    <span className="text-xl font-black font-serif">14 Days</span>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] font-medium">Active Streak</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/2 dark:bg-white/2 border border-[var(--border-color)]">
                  <div className="flex items-center gap-1.5 text-[var(--primary)] mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xl font-black font-serif">62.4 hrs</span>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] font-medium">Logged Focus</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/2 dark:bg-white/2 border border-[var(--border-color)]">
                  <div className="flex items-center gap-1.5 text-[var(--color-brand-moss)] mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xl font-black font-serif">28 Skills</span>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] font-medium">Completed</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/2 dark:bg-white/2 border border-[var(--border-color)]">
                  <div className="flex items-center gap-1.5 text-[var(--color-brand-ochre)] mb-1">
                    <Target className="w-4 h-4" />
                    <span className="text-xl font-black font-serif">85%</span>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] font-medium">Goal Velocity</span>
                </div>
              </div>

              {/* Full Width Activity Calendar */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold font-serif text-[var(--text-main)]">Learning Consistency Heatmap</h4>
                    <p className="text-xs text-[var(--text-muted)]">Frequency of daily learning sessions over the past quarter</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <span>94 sessions recorded</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/2 dark:bg-white/2 border border-[var(--border-color)] overflow-x-auto">
                  <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[500px]">
                    {Array.from({ length: 112 }).map((_, i) => {
                      const pseudoDensity = (i * 7 + 3) % 5;
                      return (
                        <div
                          key={i}
                          className={cn(
                            "w-full h-3.5 rounded-[3px] transition-colors",
                            pseudoDensity === 0 && "bg-black/5 dark:bg-white/5",
                            pseudoDensity === 1 && "bg-[var(--primary)]/20",
                            pseudoDensity === 2 && "bg-[var(--primary)]/45",
                            pseudoDensity === 3 && "bg-[var(--primary)]/75",
                            pseudoDensity === 4 && "bg-[var(--primary)]"
                          )}
                          title={`Day ${i + 1}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1">
                  <span>Mon, Wed, Fri focus peaks</span>
                  <div className="flex items-center gap-1.5">
                    <span>Less</span>
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-black/5 dark:bg-white/5" />
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--primary)]/20" />
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--primary)]/45" />
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--primary)]/75" />
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--primary)]" />
                    <span>More</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION 6 — WHO IS PROODOS FOR?
           ======================================================== */}
        <section className="py-24 border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--primary)]">
                <span>Personal Learning Discipline</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-serif text-[var(--text-main)] tracking-tight">
                Built for Independent, Driven Minds
              </h2>
              <p className="text-base text-[var(--text-muted)]">
                Proodos is not a school management system or an enterprise course portal. It is your personal operating system for self-directed mastery.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {personas.map((persona, idx) => (
                <div 
                  key={idx} 
                  className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm hover:border-[var(--primary)]/40 transition-all space-y-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--secondary)]/10 text-[var(--secondary)] flex items-center justify-center">
                    <persona.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold font-serif text-[var(--text-main)]">
                    {persona.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {persona.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================
            SECTION 7 — FINAL CTA
           ======================================================== */}
        <section className="py-24 bg-gradient-to-b from-[var(--bg-main)] to-[var(--bg-surface)] border-b border-[var(--border-color)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            
            <div className="w-16 h-16 rounded-3xl bg-[var(--primary)] text-white font-serif font-black text-3xl flex items-center justify-center mx-auto shadow-xl">
              Π
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black font-serif text-[var(--text-main)] tracking-tight">
                Your next skill starts with consistency.
              </h2>
              <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl mx-auto font-normal">
                Build your roadmap. Track your learning. Keep moving forward.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto font-semibold gap-3 px-8 shadow-md">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-medium text-[var(--text-main)]">
                  Log In to Existing Account
                </Button>
              </Link>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              No credit card required. Free and open for dedicated learners.
            </p>

          </div>
        </section>
      </main>

      {/* ========================================================
          FOOTER
         ======================================================== */}
      <footer className="bg-[var(--bg-surface)] py-16 text-xs text-[var(--text-muted)] border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 pb-12 border-b border-[var(--border-color)]">
            
            {/* Logo & Description */}
            <div className="col-span-2 md:col-span-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-serif font-black text-base shadow-xs">
                  Π
                </div>
                <span className="text-base font-black font-serif tracking-wider text-[var(--primary)]">
                  PROODOS
                </span>
              </div>
              <p className="text-xs leading-relaxed max-w-sm text-[var(--text-muted)]">
                Proodos is a personal learning roadmap and consistency operating system. Turn your ambitions into structured, demonstrable skills.
              </p>
              <p className="text-[11px] text-[var(--text-muted)]/80">
                Consistency → Progress → Growth
              </p>
            </div>

            {/* Product Section Links */}
            <div className="col-span-1 md:col-span-3 space-y-3">
              <p className="font-bold font-serif text-[var(--text-main)] uppercase tracking-wider text-[11px]">
                Product
              </p>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('preview')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    Interface
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('consistency')} className="hover:text-[var(--primary)] transition-colors cursor-pointer">
                    Consistency System
                  </button>
                </li>
              </ul>
            </div>

            {/* Account Links */}
            <div className="col-span-1 md:col-span-3 space-y-3">
              <p className="font-bold font-serif text-[var(--text-main)] uppercase tracking-wider text-[11px]">
                Account
              </p>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="hover:text-[var(--primary)] transition-colors">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-[var(--primary)] transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/forgot-password" className="hover:text-[var(--primary)] transition-colors">
                    Reset Password
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© {new Date().getFullYear()} PROODOS OS. All rights reserved.</p>
            <p className="text-[10px] text-[var(--text-muted)]">
              Designed with precision for self-directed learners.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
