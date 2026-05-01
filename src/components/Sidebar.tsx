/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate, isOpen }) => {
  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0",
        !isOpen && "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-display font-bold">L</div>
            <span className="font-display text-xl font-bold tracking-tight">LearnFlow</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path;
            
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={cn(
                  "flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-brand-50 text-brand-600" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"
                )} />
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-brand-50 rounded-2xl p-4">
            <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">Weekly Goal</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-brand-900">12 / 20 hours</span>
              <span className="text-xs font-medium text-brand-600">60%</span>
            </div>
            <div className="h-1.5 bg-brand-200 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                className="h-full bg-brand-500"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
