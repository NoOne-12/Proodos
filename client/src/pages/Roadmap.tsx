import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const mockCategories = [
  {
    id: '1',
    name: 'Frontend',
    skills: [
      { id: '1', title: 'HTML', status: 'COMPLETED' },
      { id: '2', title: 'CSS', status: 'COMPLETED' },
      { id: '3', title: 'JavaScript', status: 'IN_PROGRESS' },
      { id: '4', title: 'React', status: 'NOT_STARTED' },
    ]
  },
  {
    id: '2',
    name: 'Backend',
    skills: [
      { id: '5', title: 'Node.js', status: 'NOT_STARTED' },
      { id: '6', title: 'Express', status: 'NOT_STARTED' },
    ]
  }
];

const Roadmap: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)]">Full Stack Development</h1>
          <p className="text-[var(--text-muted)] mt-1">Mastering modern web development from frontend to backend.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit Roadmap</Button>
          <Button>Add Category</Button>
        </div>
      </div>

      <div className="space-y-8 mt-8">
        {mockCategories.map(category => (
          <div key={category.id} className="relative pl-8 before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-[var(--border-color)]">
            <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-[var(--bg-main)] border-2 border-[var(--primary)] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--text-main)]">{category.name}</h2>
              <Button variant="ghost" size="sm" className="text-[var(--text-muted)]">Add Skill</Button>
            </div>
            
            <div className="grid gap-3 md:grid-cols-2">
              {category.skills.map(skill => (
                <Card key={skill.id} className="hover:shadow-md transition-shadow cursor-pointer border-[var(--border-color)]">
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="font-medium text-[var(--text-main)]">{skill.title}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      skill.status === 'COMPLETED' ? 'bg-[var(--accent)]/10 text-[var(--accent)]' :
                      skill.status === 'IN_PROGRESS' ? 'bg-[var(--secondary)]/10 text-[var(--secondary)]' :
                      'bg-[var(--text-muted)]/10 text-[var(--text-muted)]'
                    }`}>
                      {skill.status.replace('_', ' ')}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
