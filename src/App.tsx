/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, signInWithGoogle, db } from './lib/firebase';
import { handleFirestoreError, OperationType } from './lib/firestoreUtils';
import { LandingPage } from './pages/LandingPage';
import { RoadmapGenerator } from './components/RoadmapGenerator';
import { RoadmapView } from './components/RoadmapView';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Roadmap, UserPreferences } from './types';
import { generateRoadmap } from './services/roadmapService';
import { cn } from './lib/utils';
import { Sparkles, LayoutDashboard, Calendar, Library, LineChart, LogOut, Settings, BarChart3, User, BookMarked, Loader2 } from 'lucide-react';
import { EmptyState } from './components/EmptyState';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'generator' | 'app'>('landing');
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [activeRoadmapId, setActiveRoadmapId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const roadmap = roadmaps.find(r => r.id === activeRoadmapId) || roadmaps[0] || null;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        // Sync user profile
        setDoc(doc(db, 'users', u.uid), {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
          updatedAt: serverTimestamp()
        }, { merge: true }).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${u.uid}`));

        if (view === 'landing') setView('app');
      } else {
        setView('landing');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setRoadmaps([]);
      return;
    }

    const q = query(collection(db, 'roadmaps'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => doc.data() as Roadmap);
      setRoadmaps(docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'roadmaps');
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = () => {
    setAuthError(null);
    setIsAuthenticating(true);
    
    signInWithGoogle()
      .catch((error: any) => {
        if (error.code === 'auth/popup-closed-by-user') {
          setAuthError('Sign-in window was closed. Try disabling popup blockers or opening this app in a new tab.');
        } else if (error.code === 'auth/blocked-at-popup-request') {
          setAuthError('Sign-in popup was blocked by your browser. Please allow popups for this site.');
        } else {
          setAuthError('An error occurred during sign-in. Please try again.');
        }
        console.error("Login failed", error);
        setIsAuthenticating(false);
      });
  };

  const handleGenerate = async (prefs: UserPreferences) => {
    if (!user) {
      await handleLogin();
      return;
    }

    setIsGenerating(true);
    try {
      const newRoadmap = await generateRoadmap(prefs, user.uid);
      setActiveRoadmapId(newRoadmap.id);
      setView('app');
      setCurrentPath('/dashboard');
    } catch (error) {
      alert("Failed to generate roadmap. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = async (phaseId: string, taskId: string) => {
    if (!roadmap || !user) return;
    
    const updatedPhases = roadmap.phases.map(p => {
      if (p.id === phaseId) {
        const updatedTasks = p.tasks.map(t => {
          if (t.id === taskId) return { ...t, completed: !t.completed };
          return t;
        });
        return { ...p, tasks: updatedTasks, completed: updatedTasks.every(t => t.completed) };
      }
      return p;
    });

    const allTasks = updatedPhases.flatMap(p => p.tasks);
    const completedTasks = allTasks.filter(t => t.completed).length;
    const progress = (completedTasks / allTasks.length) * 100;

    try {
      await updateDoc(doc(db, 'roadmaps', roadmap.id), {
        phases: updatedPhases,
        progress: progress
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `roadmaps/${roadmap.id}`);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setRoadmaps([]);
    setActiveRoadmapId(null);
    setView('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    if (currentPath === '/dashboard' && roadmap) {
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={Sparkles} 
              label="Current Focus" 
              value={roadmap.phases.find(p => !p.completed)?.title || "Goal Achieved!"} 
              color="brand"
            />
            <StatCard 
                icon={LayoutDashboard} 
                label="Progress" 
                value={`${Math.round(roadmap.progress)}%`} 
                color="blue"
            />
            <StatCard 
                icon={Calendar} 
                label="Est. Weeks" 
                value={`${roadmap.estimatedTotalWeeks} Weeks`} 
                color="amber"
            />
            <StatCard 
                icon={LineChart} 
                label="Next Task" 
                value={roadmap.phases.find(p => !p.completed)?.tasks.find(t => !t.completed)?.title || "Review & Celebrate"} 
                color="emerald"
            />
          </div>

          <RoadmapView roadmap={roadmap} onToggleTask={handleToggleTask} />
        </div>
      );
    }

    switch (currentPath) {
      case '/planner':
        return <EmptyState icon={Calendar} title="Study Planner" description="Optimize your study schedule with AI-driven time-blocking and deadline tracking. Coming very soon!" onAction={() => setCurrentPath('/dashboard')} actionLabel="Back to Dashboard" />;
      case '/resources':
        return <EmptyState icon={Library} title="Resource Vault" description="Your personalized library of curated learning materials, saved across all your roadmaps." onAction={() => setCurrentPath('/dashboard')} actionLabel="Back to Dashboard" />;
      case '/progress':
        return <EmptyState icon={BarChart3} title="Learning Analytics" description="Dive deep into your learning patterns, streak history, and detailed subject mastery reports." onAction={() => setCurrentPath('/dashboard')} actionLabel="Back to Dashboard" />;
      case '/roadmaps':
        return roadmap ? (
           <div className="space-y-8">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">My Roadmaps</h2>
                <button onClick={() => setView('generator')} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20">
                  <Sparkles className="w-4 h-4" /> New Roadmap
                </button>
             </div>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                  onClick={() => setCurrentPath('/dashboard')}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-brand-300 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <BookMarked className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{roadmap.title}</h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2">{roadmap.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">{Math.round(roadmap.progress)}% Complete</span>
                    <button className="text-brand-600 font-bold text-sm">View Path</button>
                  </div>
                </div>
             </div>
           </div>
        ) : <EmptyState icon={BookMarked} title="No Roadmaps Found" description="Start your journey by generating your first personalized learning path." onAction={() => setView('generator')} actionLabel="Generate Now" />;
      case '/profile':
        return <EmptyState icon={User} title="Student Profile" description="Customize your learning preferences, notification settings, and public profile." onAction={() => setCurrentPath('/dashboard')} actionLabel="Back to Dashboard" />;
      default:
        return <EmptyState icon={LayoutDashboard} title="Dashboard" description="Select a roadmap or generate a new one to see your dashboard results." onAction={() => setView('generator')} actionLabel="Get Started" />;
    }
  };

  if (view === 'landing') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LandingPage 
            onStart={user ? () => setView('generator') : handleLogin} 
            isAuthenticating={isAuthenticating}
            authError={authError}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (view === 'generator') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col pt-12 pb-20 px-6">
        <div className="max-w-2xl mx-auto w-full mb-12 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-display font-bold">L</div>
            <span className="font-display text-xl font-bold tracking-tight">LearnFlow</span>
          </div>
          <button 
            onClick={() => setView('landing')}
            className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Cancel
          </button>
        </div>
        <RoadmapGenerator onGenerate={handleGenerate} isGenerating={isGenerating} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar 
        currentPath={currentPath} 
        onNavigate={(path) => {
          setCurrentPath(path);
          setSidebarOpen(false);
        }} 
        isOpen={sidebarOpen}
      />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <TopNav 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          title={currentPath.replace('/', '').toUpperCase()}
          user={user}
        />

        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
        
        <div className="fixed bottom-6 right-6 lg:left-[calc(16rem+1.5rem)] lg:right-auto z-50">
            <div className="flex gap-2">
                <button 
                    onClick={() => {}} 
                    className="p-3 bg-white border border-slate-200 rounded-full shadow-lg text-slate-500 hover:text-slate-900 transition-colors group cursor-not-allowed"
                >
                    <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                </button>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-lg text-rose-500 font-bold text-sm hover:bg-brand-50 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Reset
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}


const StatCard: React.FC<{ icon: any, label: string, value: string, color: string }> = ({ icon: Icon, label, value, color }) => {
    const colors: Record<string, string> = {
        brand: "bg-brand-50 text-brand-600 border-brand-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm premium-shadow transition-transform hover:-translate-y-1">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 border", colors[color])}>
                <Icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-lg font-display font-bold text-slate-900 truncate">{value}</p>
        </div>
    );
};
