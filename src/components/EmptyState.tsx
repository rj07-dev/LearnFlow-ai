/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, onAction, actionLabel }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-sm mx-auto px-6">
      <div className="w-24 h-24 bg-brand-50 text-brand-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 mb-8 leading-relaxed">{description}</p>
      {onAction && (
        <button 
          onClick={onAction}
          className="px-8 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
