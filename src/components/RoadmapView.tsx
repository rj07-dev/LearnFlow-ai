/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Clock, ExternalLink, FileText, Lock, PlayCircle, Trophy, Target } from 'lucide-react';
import { Phase, Roadmap, Resource, Task } from '../types';
import { cn } from '../lib/utils';

interface RoadmapViewProps {
  roadmap: Roadmap;
  onToggleTask: (phaseId: string, taskId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap, onToggleTask }) => {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-sm uppercase tracking-widest">
            <Trophy className="w-4 h-4" />
            Current Journey
          </div>
          <h2 className="text-4xl font-display font-bold text-slate-900">{roadmap.title}</h2>
          <p className="text-slate-500 max-w-2xl">{roadmap.description}</p>
        </div>
        
        <div className="p-6 bg-slate-50 rounded-3xl min-w-[200px] flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 flex items-center justify-center mb-2">
            <svg className="w-24 h-24 -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-200"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={251.2}
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * roadmap.progress) / 100 }}
                fill="transparent"
                strokeLinecap="round"
                className="text-brand-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-display font-bold">{Math.round(roadmap.progress)}%</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Overall Progress</p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline connector line */}
        <div className="absolute left-6 md:left-12 top-8 bottom-8 w-1 bg-slate-100" />

        <div className="space-y-16 relative">
          {roadmap.phases.map((phase, idx) => (
            <PhaseItem 
              key={phase.id} 
              phase={phase} 
              index={idx}
              onToggleTask={(taskId) => onToggleTask(phase.id, taskId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const PhaseItem: React.FC<{ 
  phase: Phase; 
  index: number; 
  onToggleTask: (taskId: string) => void 
}> = ({ phase, index, onToggleTask }) => {
  const isLocked = index > 0; // Simplified logic for demo

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className={cn("relative pl-16 md:pl-24", isLocked && "opacity-75")}
    >
      {/* Node indicator */}
      <div className={cn(
        "absolute left-[1.15rem] md:left-[2.65rem] top-0 w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10 transition-colors",
        phase.completed ? "bg-green-500 text-white" : "bg-brand-500 text-white",
        isLocked && !phase.completed && "bg-slate-200"
      )}>
        {phase.completed ? <CheckCircle2 className="w-5 h-5" /> : (isLocked ? <Lock className="w-4 h-4" /> : <Circle className="w-5 h-5 fill-current" />)}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:border-brand-200 transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg uppercase tracking-wider">{phase.duration}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phase {index + 1}</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900">{phase.title}</h3>
            <p className="text-slate-500">{phase.description}</p>
          </div>
          
          {phase.milestone && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 text-sm font-bold">
              <Trophy className="w-4 h-4" />
              {phase.milestone}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              <Target className="w-4 h-4" />
              Tasks to complete
            </h4>
            <div className="space-y-1">
              {phase.tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left group",
                    task.completed 
                      ? "bg-slate-50 text-slate-400" 
                      : "hover:bg-brand-50 text-slate-700"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    task.completed 
                      ? "bg-green-500 border-green-500 text-white" 
                      : "border-slate-200 bg-white group-hover:border-brand-300"
                  )}>
                    {task.completed && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className={cn("font-semibold text-sm", task.completed && "line-through")}>{task.title}</p>
                    <p className="text-xs opacity-80">{task.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              <PlayCircle className="w-4 h-4" />
              Recommended Resources
            </h4>
            <div className="grid gap-3">
              {phase.resources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all group"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                    {resource.type === 'Video' ? <PlayCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-900 leading-tight mb-0.5">{resource.title}</p>
                    <p className="text-xs text-slate-400 font-medium">{resource.type}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
