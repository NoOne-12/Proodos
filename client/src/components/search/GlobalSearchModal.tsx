import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  X, 
  Map, 
  CheckCircle2, 
  Target, 
  Clock, 
  BookOpen, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { SearchResults } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get(`/search?q=${encodeURIComponent(query.trim())}`);
        if (res.data.success) {
          setResults(res.data.data);
        }
      } catch (e) {
        console.error('Search query failed:', e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResultsCount =
    (results?.roadmaps?.length || 0) +
    (results?.skills?.length || 0) +
    (results?.goals?.length || 0) +
    (results?.learningSessions?.length || 0);

  const handleSelect = (url: string) => {
    onClose();
    navigate(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-[var(--bg-surface)] border border-[var(--border-color)] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-color)] bg-[var(--bg-surface)]">
          <SearchIcon className="w-5 h-5 text-[var(--primary)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roadmaps, skills, notes, and goals..."
            className="w-full bg-transparent text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {loading && (
            <div className="py-8 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
              <span>Searching knowledge graph...</span>
            </div>
          )}

          {!loading && query && totalResultsCount === 0 && (
            <div className="py-12 text-center text-xs text-[var(--text-muted)] space-y-2">
              <SearchIcon className="w-8 h-8 mx-auto opacity-30" />
              <p className="font-semibold text-[var(--text-main)]">No matches found for "{query}"</p>
              <p className="text-[11px]">Try searching for roadmap topics, skill names, or learning notes.</p>
            </div>
          )}

          {!loading && !query && (
            <div className="py-8 text-center text-xs text-[var(--text-muted)] space-y-1">
              <Sparkles className="w-6 h-6 mx-auto text-[var(--primary)] opacity-50 mb-2" />
              <p className="font-medium">Type any keyword to search across your learning OS.</p>
              <p className="text-[10px] text-[var(--text-muted)]">Includes Roadmaps, Skills, Notes, Goals, and Session Logs.</p>
            </div>
          )}

          {!loading && results && totalResultsCount > 0 && (
            <div className="space-y-4">
              {/* Roadmaps */}
              {results.roadmaps.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-2 mb-1.5 flex items-center gap-1.5">
                    <Map className="w-3 h-3" /> Roadmaps
                  </h4>
                  <div className="space-y-1">
                    {results.roadmaps.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => handleSelect(`/roadmaps/${r.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] truncate">
                            {r.title}
                          </p>
                          {r.description && (
                            <p className="text-[11px] text-[var(--text-muted)] truncate">{r.description}</p>
                          )}
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {results.skills.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-2 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3" /> Skills & Notes
                  </h4>
                  <div className="space-y-1">
                    {results.skills.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleSelect(`/roadmaps/${s.category?.roadmapId}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                      >
                        <div className="min-w-0 pr-2 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] truncate">
                              {s.title}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                              s.status === 'COMPLETED'
                                ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
                                : s.status === 'IN_PROGRESS'
                                ? 'bg-[var(--secondary)]/15 text-[var(--secondary)]'
                                : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'
                            }`}>
                              {s.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-[10px] text-[var(--text-muted)] truncate">
                            {s.category?.roadmap?.title} • {s.category?.name}
                            {s.notes && <span className="italic ml-2">"{s.notes}"</span>}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Goals */}
              {results.goals.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-2 mb-1.5 flex items-center gap-1.5">
                    <Target className="w-3 h-3" /> Goals
                  </h4>
                  <div className="space-y-1">
                    {results.goals.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => handleSelect('/goals')}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--primary)] truncate">
                            {g.title}
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)]">
                            Progress: {g.currentValue} / {g.targetValue} ({g.status})
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
