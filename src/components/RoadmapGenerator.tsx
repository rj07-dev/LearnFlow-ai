/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles, Target } from 'lucide-react';
import { UserPreferences, SkillLevel, LearningStyle, PlanMode } from '../types';
import { LEARNING_STYLES, PLAN_MODES, SKILL_LEVELS } from '../constants';
import { cn } from '../lib/utils';

interface RoadmapGeneratorProps {
  onGenerate: (prefs: UserPreferences) => Promise<void>;
  isGenerating: boolean;
}

export const RoadmapGenerator: React.FC<RoadmapGeneratorProps> = ({ onGenerate, isGenerating }) => {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<UserPreferences>({
    goal: '',
    level: 'Beginner',
    deadline: '',
    hoursPerWeek: 10,
    style: 'Visual',
    mode: 'Skill'
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleGenerate = () => {
    if (step === 3) {
      onGenerate(prefs);
    } else {
      nextStep();
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className={cn(
                  "h-1.5 w-12 rounded-full transition-all duration-500",
                  step >= i ? "bg-brand-500" : "bg-slate-200"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Step {step}/3</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100"
        >
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">What's your goal?</h2>
                <p className="text-slate-500">Be as specific as possible for the best results.</p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <Target className="absolute left-4 top-4 w-5 h-5 text-brand-500" />
                  <textarea
                    value={prefs.goal}
                    onChange={(e) => setPrefs({ ...prefs, goal: e.target.value })}
                    placeholder="e.g., Learn Full-stack Web Development with React and Node.js"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg focus:border-brand-500 focus:bg-white outline-none transition-all min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {PLAN_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setPrefs({ ...prefs, mode: mode.id as PlanMode })}
                      className={cn(
                        "p-4 text-left rounded-2xl border-2 transition-all",
                        prefs.mode === mode.id 
                          ? "border-brand-500 bg-brand-50" 
                          : "border-slate-100 hover:border-slate-200 bg-slate-50"
                      )}
                    >
                      <p className={cn(
                        "font-bold text-sm mb-1",
                        prefs.mode === mode.id ? "text-brand-700" : "text-slate-900"
                      )}>{mode.label}</p>
                      <p className="text-[10px] text-slate-500 leading-tight">{mode.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Configure your path</h2>
                <p className="text-slate-500">How much time do you have and what's your starting point?</p>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 block">Current Level</label>
                  <div className="flex gap-2">
                    {SKILL_LEVELS.map((level) => (
                      <button
                        key={level}
                        onClick={() => setPrefs({ ...prefs, level: level as SkillLevel })}
                        className={cn(
                          "flex-1 py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all",
                          prefs.level === level 
                            ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-200" 
                            : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Weekly Commitment</label>
                    <span className="text-sm font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">{prefs.hoursPerWeek} hours/week</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={prefs.hoursPerWeek}
                    onChange={(e) => setPrefs({ ...prefs, hoursPerWeek: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter text-center">
                    <span>Chill (1h)</span>
                    <span>Pro (20h)</span>
                    <span>Intense (40h)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Final touches</h2>
                <p className="text-slate-500">Pick your preferred style and setting a deadline.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 block">Learning Style</label>
                  <div className="grid grid-cols-2 gap-3">
                    {LEARNING_STYLES.map((style) => (
                      <button
                        key={style}
                        onClick={() => setPrefs({ ...prefs, style: style as LearningStyle })}
                        className={cn(
                          "px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all",
                          prefs.style === style
                            ? "bg-brand-50 text-brand-700 border-brand-500"
                            : "bg-white text-slate-600 border-slate-100 hover:border-slate-200"
                        )}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 block">Goal Deadline</label>
                  <input
                    type="date"
                    value={prefs.deadline}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setPrefs({ ...prefs, deadline: e.target.value })}
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg focus:border-brand-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 flex items-center justify-between gap-4">
            {step > 1 && (
              <button
                onClick={prevStep}
                disabled={isGenerating}
                className="p-4 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || (step === 1 && !prefs.goal) || (step === 3 && !prefs.deadline)}
              className={cn(
                "flex-1 py-4 px-8 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:scale-100",
                step === 3 && "bg-brand-600 shadow-brand-500/20"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Roadmap...
                </>
              ) : step === 3 ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  Build My Roadmap
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 text-center bg-white p-4 rounded-2xl inline-flex items-center gap-2 text-sm text-slate-500 mx-auto w-full justify-center">
        <div className="flex -space-x-2">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" className="w-6 h-6 rounded-full border border-white" alt="u" referrerPolicy="no-referrer" />
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" className="w-6 h-6 rounded-full border border-white" alt="u" referrerPolicy="no-referrer" />
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" className="w-6 h-6 rounded-full border border-white" alt="u" referrerPolicy="no-referrer" />
        </div>
        <span>Generated 300+ roadmaps today</span>
      </div>
    </div>
  );
};
