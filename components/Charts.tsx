import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Item } from '../types';

interface ChartProps {
  items: Item[];
}

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b']; // Blue, Green, Red, Amber

export const DashboardCharts: React.FC<ChartProps> = ({ items }) => {
  const total = items.length;
  const completed = items.filter(i => i.status === 'completed').length;
  const active = items.filter(i => i.status === 'active').length;
  const archived = items.filter(i => i.status === 'archived').length;

  const data = [
    { name: 'Active', value: active },
    { name: 'Completed', value: completed },
    { name: 'Archived', value: archived },
  ].filter(d => d.value > 0);

  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="w-full space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox label="Total" value={total} color="text-blue-600" />
        <StatBox label="Done" value={completed} color="text-green-600" />
        <StatBox label="Pending" value={active} color="text-amber-600" />
      </div>

      {/* Progress Bar */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Progress</span>
            <span className="text-2xl font-bold text-primary-600">{completionRate}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
                className="h-full bg-gradient-to-r from-primary-500 to-green-400 transition-all duration-1000 ease-out" 
                style={{ width: `${completionRate}%` }}
            />
        </div>
      </div>

      {/* Pie Chart (Only if data exists) */}
      {data.length > 0 && (
        <div className="glass-card rounded-2xl p-4 flex items-center h-40">
          <div className="w-1/2 h-full">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 pl-2 space-y-2">
                {data.map((entry, index) => (
                    <div key={entry.name} className="flex items-center text-xs text-slate-600 dark:text-slate-300">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }} />
                        <span>{entry.name}: {entry.value}</span>
                    </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatBox = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="glass-card p-3 rounded-2xl flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{label}</span>
    </div>
);
