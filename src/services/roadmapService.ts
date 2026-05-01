/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Roadmap, UserPreferences } from "../types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestoreUtils";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ROADMAP_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Catchy title for the roadmap" },
    description: { type: Type.STRING, description: "A brief, motivating overview" },
    estimatedTotalWeeks: { type: Type.NUMBER, description: "Total weeks to complete" },
    phases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          duration: { type: Type.STRING, description: "e.g., 'Week 1', 'Days 1-3'" },
          milestone: { type: Type.STRING, description: "The big goal for this phase" },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['Theory', 'Practice', 'Quiz', 'Project'] },
              },
              required: ['title', 'description', 'type']
            }
          },
          resources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['Video', 'Article', 'Exercise', 'Project', 'Book'] },
                url: { type: Type.STRING },
              },
              required: ['title', 'type', 'url']
            }
          }
        },
        required: ['title', 'description', 'duration', 'tasks', 'resources']
      }
    }
  },
  required: ['title', 'description', 'estimatedTotalWeeks', 'phases']
};

export async function generateRoadmap(prefs: UserPreferences, userId: string, skipFirestore = false): Promise<Roadmap> {
  const prompt = `
    Generate a detailed learning roadmap for a student with the following goal and constraints:
    Goal: ${prefs.goal}
    Current Level: ${prefs.level}
    Deadline: ${prefs.deadline}
    Hours available per week: ${prefs.hoursPerWeek}
    Preferred Learning Style: ${prefs.style}
    Mode: ${prefs.mode}

    The roadmap should be structured into logical phases with specific tasks and resources.
    Ensure tasks are actionable and resources are descriptive.
    Make it feel premium, professional, and highly motivating.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: ROADMAP_SCHEMA,
      },
    });

    const data = JSON.parse(response.text || '{}');
    
    // Add IDs and structural metadata
    const roadmap: Roadmap = {
      ...data,
      id: crypto.randomUUID(),
      userId,
      targetGoal: prefs.goal,
      difficulty: prefs.level,
      createdAt: new Date().toISOString(),
      progress: 0,
      streakCount: 0,
      phases: data.phases.map((phase: any) => ({
        ...phase,
        id: crypto.randomUUID(),
        completed: false,
        tasks: phase.tasks.map((task: any) => ({
          ...task,
          id: crypto.randomUUID(),
          completed: false
        })),
        resources: phase.resources.map((res: any) => ({
          ...res,
          id: crypto.randomUUID()
        }))
      }))
    };

    if (!skipFirestore) {
      try {
        await setDoc(doc(db, "roadmaps", roadmap.id), roadmap);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `roadmaps/${roadmap.id}`);
      }
    }

    return roadmap;
  } catch (error) {
    console.error("Failed to generate roadmap:", error);
    throw error;
  }
}
