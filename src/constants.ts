/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookOpen, Calendar, LayoutDashboard, Library, LineChart, User } from "lucide-react";

export const NAV_LINKS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'My Roadmaps', icon: BookOpen, path: '/roadmaps' },
  { name: 'Planner', icon: Calendar, path: '/planner' },
  { name: 'Resources', icon: Library, path: '/resources' },
  { name: 'Progress', icon: LineChart, path: '/progress' },
  { name: 'Profile', icon: User, path: '/profile' },
];

export const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
export const LEARNING_STYLES = ['Visual', 'Hands-on', 'Academic', 'Mixed'];
export const PLAN_MODES = [
  { id: 'Skill', label: 'New Skill', description: 'Master a specific topic or technology' },
  { id: 'Career', label: 'Career Growth', description: 'Prepare for a job or career transition' },
  { id: 'Exam', label: 'Exam Prep', description: 'Intensive study for tests and certifications' },
  { id: 'Project', label: 'Project-Based', description: 'Build something real while learning' },
];

export const APP_THEME = {
  accent: '#6366f1', // Indigo 500
  accentDark: '#4f46e5', // Indigo 600
  bg: '#f8fafc',
  card: '#ffffff',
  text: '#0f172a',
  textMuted: '#64748b',
};
