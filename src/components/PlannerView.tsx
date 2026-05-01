/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2, Circle } from 'lucide-react';
import { Roadmap, Task } from '../types';
import { cn } from '../lib/utils';

interface PlannerViewProps {
  roadmap: Roadmap | null;
  onToggleTask: (phaseId: string, taskId: string) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({ roadmap, onToggleTask }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Distribute tasks across days for current week (simple logic)
  const allTasks = roadmap?.phases.flatMap(p => p.tasks.map(t => ({ ...t, phaseId: p.id }))) || [];
  const activeTasks = allTasks.filter(t => !t.completed).slice(0, 14); // Next 14 tasks

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">Study Planner</h2>
          <p className="text-slate-500">Your personalized schedule for the week.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200">
           <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronLeft className="w-5 h-5" /></button>
           <span className="text-sm font-bold text-slate-900 px-2">May 1 - May 7</span>
           <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="grid lg:grid-cols-7 gap-4">
        {days.map((day) => {
          const isToday = day === today;
          const dayTasks = activeTasks.slice(days.indexOf(day) * 2, days.indexOf(day) * 2 + 2);

          return (
            <div key={day} className={cn(
              "flex flex-col gap-3 group",
              isToday ? "opacity-100" : "opacity-70 hover:opacity-100 transition-opacity"
            )}>
              <div className={cn(
                "py-3 px-4 rounded-2xl border text-center transition-all",
                isToday ? "bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-200" : "bg-white border-slate-200 text-slate-600"
              )}>
                <p className="text-[10px] font-black uppercase tracking-tighter mb-0.5">{day.slice(0, 3)}</p>
                <p className="text-xl font-display font-bold">{Math.floor(Math.random() * 31) + 1}</p>
              </div>

              <div className="flex-1 space-y-2 min-h-[200px]">
                {dayTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-xs hover:border-brand-300 cursor-pointer transition-colors"
                    onClick={() => onToggleTask(task.phaseId, task.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                       <Clock className="w-3 h-3 text-brand-500" />
                       <span className="font-bold text-slate-400">09:00 AM</span>
                    </div>
                    <p className="font-bold text-slate-900 line-clamp-2">{task.title}</p>
                  </div>
                ))}
                
                {dayTasks.length === 0 && (
                  <div className="h-full border border-dashed border-slate-200 rounded-2xl flex items-center justify-center p-4">
                     <p className="text-[10px] font-bold text-slate-300 text-center">NO TASKS PLANNED</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
