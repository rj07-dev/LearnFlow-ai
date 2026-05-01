/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ExternalLink, PlayCircle, FileText, Globe, Filter } from 'lucide-react';
import { Roadmap, Resource } from '../types';
import { cn } from '../lib/utils';

interface ResourcesViewProps {
  roadmaps: Roadmap[];
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ roadmaps }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | 'All'>('All');

  const allResources = roadmaps.flatMap(r => 
    r.phases.flatMap(p => p.resources.map(res => ({ ...res, roadmapTitle: r.title })))
  );

  const filteredResources = allResources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         res.roadmapTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || res.type === selectedType;
    return matchesSearch && matchesType;
  });

  const resourceTypes = ['All', 'Video', 'Article', 'Exercise', 'Book', 'Project'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900">Resource Vault</h2>
          <p className="text-slate-500">Access all learning materials across your roadmaps.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none w-64 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {resourceTypes.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap border",
              selectedType === type 
                ? "bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-100" 
                : "bg-white text-slate-600 border-slate-200 hover:border-brand-200"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Globe className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No resources found matches your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ResourceCard: React.FC<{ resource: Resource & { roadmapTitle: string } }> = ({ resource }) => (
  <a 
    href={resource.url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-brand-300 hover:shadow-md transition-all flex flex-col h-full"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
        resource.type === 'Video' ? "bg-red-50 text-red-600" : 
        resource.type === 'Article' ? "bg-blue-50 text-blue-600" : 
        "bg-slate-50 text-slate-600"
      )}>
        {resource.type === 'Video' ? <PlayCircle className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
      </div>
      <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-brand-500 transition-colors" />
    </div>
    
    <div className="flex-1">
      <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">{resource.title}</h3>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{resource.roadmapTitle}</p>
      <div className="flex items-center gap-2 text-xs text-brand-600 font-bold bg-brand-50 w-fit px-2 py-1 rounded-lg">
        {resource.type}
      </div>
    </div>
  </a>
);
