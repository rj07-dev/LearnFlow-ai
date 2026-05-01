/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type LearningStyle = 'Visual' | 'Hands-on' | 'Academic' | 'Mixed';

export type PlanMode = 'Exam' | 'Career' | 'Project' | 'Skill';

export interface UserPreferences {
  goal: string;
  level: SkillLevel;
  deadline: string;
  hoursPerWeek: number;
  style: LearningStyle;
  mode: PlanMode;
}

export interface Resource {
  id: string;
  title: string;
  type: 'Video' | 'Article' | 'Exercise' | 'Project' | 'Book';
  url: string;
  duration?: string;
  difficulty?: SkillLevel;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  duration?: string;
  completed: boolean;
  type: 'Theory' | 'Practice' | 'Quiz' | 'Project';
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  duration: string;
  tasks: Task[];
  resources: Resource[];
  completed: boolean;
  milestone?: string;
}

export interface Roadmap {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetGoal: string;
  difficulty: SkillLevel;
  estimatedTotalWeeks: number;
  phases: Phase[];
  createdAt: string;
  progress: number;
  streakCount: number;
}
