/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, Menu, Search, Zap } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface TopNavProps {
  onToggleSidebar: () => void;
  title: string;
  user: FirebaseUser | null;
}

export const TopNav: React.FC<TopNavProps> = ({ onToggleSidebar, title, user }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleSidebar}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold font-display text-slate-900 hidden sm:block">{title}</h1>
        </div>

        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search topics, resources..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold">4 Day Streak</span>
          </div>
          
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>
          
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-100 border border-brand-200 rounded-xl flex items-center justify-center text-brand-700 font-bold overflow-hidden cursor-pointer hover:border-brand-300 transition-all">
            <img 
              src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'student'}`} 
              alt="User" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
