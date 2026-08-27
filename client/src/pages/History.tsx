import React from 'react';
import { Card, CardContent } from '../components/ui/Card';

const mockHistory = [
  { id: '1', date: '2023-10-15', skill: 'React Hooks', duration: 45, notes: 'Learned useEffect' },
  { id: '2', date: '2023-10-14', skill: 'JavaScript Promises', duration: 60, notes: 'Async/Await practice' },
  { id: '3', date: '2023-10-13', skill: 'CSS Grid', duration: 30, notes: 'Layout built' },
];

const History: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-[var(--border-color)] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)]">Learning History</h1>
        <p className="text-[var(--text-muted)] mt-1">Review your past learning sessions and notes.</p>
      </div>

      <div className="space-y-4">
        {mockHistory.map(session => (
          <Card key={session.id}>
            <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--text-muted)]">{session.date}</p>
                <h3 className="text-lg font-semibold text-[var(--text-main)] mt-1">{session.skill}</h3>
                {session.notes && <p className="text-sm mt-2 text-[var(--text-muted)] italic">"{session.notes}"</p>}
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-2xl font-bold text-[var(--secondary)]">{session.duration}</div>
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Minutes</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default History;
