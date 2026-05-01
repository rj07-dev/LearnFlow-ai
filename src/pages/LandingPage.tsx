/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Brain, Sparkles, Target, Trophy, LineChart, Loader2, AlertCircle } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onDemoStart: () => void;
  isAuthenticating?: boolean;
  authError?: string | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onDemoStart, isAuthenticating, authError }) => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-100 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-40" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-brand-200">L</div>
          <span className="font-display text-2xl font-bold tracking-tight text-slate-900">LearnFlow</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Features</a>
          <button 
            onClick={onDemoStart}
            className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
          >
            Try Demo
          </button>
          <button 
            onClick={onStart}
            disabled={isAuthenticating}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : "Sign In with Google"}
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 text-brand-700 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">AI-Powered Learning</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.1] mb-6">
              Your path to <span className="text-brand-600">mastery</span> starts here.
            </h1>
            
            <p className="text-xl text-slate-600 mb-6 leading-relaxed max-w-lg">
              Stop guessing what to learn next. Get a personalized, AI-generated roadmap tailored to your goals, skill level, and schedule.
            </p>

            {authError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-medium"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {authError}
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={onStart}
                disabled={isAuthenticating}
                className="w-full sm:w-auto px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Generate My Roadmap
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <button 
                onClick={onDemoStart}
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm"
              >
                Try Demo Mode
              </button>
            </div>

            <div className="mt-12 flex items-center gap-4 text-slate-500">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img 
                    key={i}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} 
                    className="w-10 h-10 rounded-full border-2 border-white bg-slate-100"
                    alt="User"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <p className="text-sm font-medium italic">Join 12,000+ students learning better</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-[2rem] p-4 shadow-2xl border border-slate-100 premium-shadow">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                alt="Students studying" 
                className="rounded-2xl w-full h-auto grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating UI Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-8 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Milestone Reached</p>
                  <p className="text-sm font-bold text-slate-900">React Advanced Hooks</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-8 -right-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Daily Goal</p>
                  <p className="text-sm font-bold text-slate-900">2.5 / 4 hours complete</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <section id="features" className="pt-32 grid md:grid-cols-3 gap-8">
          {[
            { icon: Brain, title: 'Smart Generation', desc: 'Our AI understands your goals and breaks them into logical, bite-sized steps.' },
            { icon: BookOpen, title: 'Curated Resources', desc: 'Get hand-picked articles, videos, and exercises for every single milestone.' },
            { icon: LineChart, title: 'Visual Progress', desc: 'Track your growth with interactive charts and milestone-based progression.' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-brand-200 transition-all hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-slate-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-display font-bold">L</div>
            <span className="font-display text-xl font-bold">LearnFlow</span>
          </div>
          <p className="text-slate-400 text-sm italic font-medium">Empowering the next generation of builders and thinkers.</p>
          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
