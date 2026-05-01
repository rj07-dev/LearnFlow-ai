/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Roadmap } from '../types';
import { Trophy, Target, Zap, Clock } from 'lucide-react';

interface ProgressViewProps {
  roadmaps: Roadmap[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({ roadmaps }) => {
  const totalTasks = roadmaps.reduce((acc, r) => acc + r.phases.reduce((sum, p) => sum + p.tasks.length, 0), 0);
  const completedTasks = roadmaps.reduce((acc, r) => acc + r.phases.reduce((sum, p) => sum + p.tasks.filter(t => t.completed).length, 0), 0);
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Mock data for learning activity chart
  const activityData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 4.0 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 3.5 },
    { day: 'Fri', hours: 5.0 },
    { day: 'Sat', hours: 2.0 },
    { day: 'Sun', hours: 1.0 },
  ];

  const pieData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Remaining', value: totalTasks - completedTasks },
  ];
  
  const COLORS = ['#6366f1', '#f1f5f9'];

  return (
    <div className="space-y-8 pb-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProgStatCard icon={Zap} label="Current Streak" value="4 Days" color="amber" />
        <ProgStatCard icon={Trophy} label="Completion Rate" value={`${Math.round(completionRate)}%`} color="brand" />
        <ProgStatCard icon={Target} label="Tasks Solved" value={`${completedTasks} / ${totalTasks}`} color="emerald" />
        <ProgStatCard icon={Clock} label="Learning Time" value="19.5h" color="blue" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Learning Intensity (This Week)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-display font-bold text-slate-900 mb-6 w-full">Task Breakdown</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-500" />
                <span className="text-sm font-medium text-slate-600">Completed</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{completedTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="text-sm font-medium text-slate-600">Yet to start</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{totalTasks - completedTasks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgStatCard: React.FC<{ icon: any, label: string, value: string, color: string }> = ({ icon: Icon, label, value, color }) => {
  const colors: Record<string, string> = {
    brand: "bg-brand-50 text-brand-600 border-brand-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-500 border-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-display font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
};
