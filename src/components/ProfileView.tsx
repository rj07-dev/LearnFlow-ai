/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User as FirebaseUser, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { User, Mail, Shield, Bell, LogOut, ChevronRight, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProfileViewProps {
  user: FirebaseUser | null;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] bg-brand-100 border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
              <img 
                src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 p-3 bg-brand-600 text-white rounded-2xl shadow-lg border-2 border-white">
              <Settings className="w-5 h-5" />
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-1">{user?.displayName || 'Scholar'}</h2>
            <p className="text-slate-500 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {user?.email}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold border border-brand-100">Pro Student</span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold border border-emerald-100 italic">verified</span>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="px-6 py-3 bg-white border border-rose-100 text-rose-500 rounded-2xl font-bold flex items-center gap-2 hover:bg-rose-50 transition-all shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold text-slate-900 px-2">Account Settings</h3>
          <div className="space-y-3">
            <ProfileOption icon={User} label="Personal Information" />
            <ProfileOption icon={Bell} label="Notification Settings" />
            <ProfileOption icon={Shield} label="Privacy & Security" />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold text-slate-900 px-2">Learning Defaults</h3>
          <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
             <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Weekly Goal</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none transition-all">
                  <option>10 Hours / Week</option>
                  <option>20 Hours / Week</option>
                  <option>Daily 1 Hour</option>
                </select>
             </div>
             <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Skill Level</label>
                <div className="flex gap-2">
                  {['Beginner', 'Intermediate', 'Expert'].map(level => (
                    <button key={level} className={cn(
                      "flex-1 py-2 rounded-xl text-xs font-bold border transition-all",
                      level === 'Intermediate' ? "bg-brand-600 text-white border-brand-600 shadow-md" : "bg-white text-slate-600 border-slate-200"
                    )}>
                      {level}
                    </button>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileOption: React.FC<{ icon: any, label: string }> = ({ icon: Icon, label }) => (
  <button className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-100 hover:border-brand-200 hover:shadow-md transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <span className="font-bold text-slate-700">{label}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
  </button>
);
