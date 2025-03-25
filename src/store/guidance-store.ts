"use client";

import { create } from "zustand";

export interface GuidanceStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface GuidanceStore {
  guidanceSteps: Record<string, GuidanceStep[]>;
  updateGuidance: (caseId: string, steps: GuidanceStep[]) => void;
  markStepCompleted: (
    caseId: string,
    stepId: string,
    completed: boolean
  ) => void;
  clearGuidance: (caseId: string) => void;
}

export const useGuidanceStore = create<GuidanceStore>((set) => ({
  guidanceSteps: {},
  updateGuidance: (caseId, steps) =>
    set((state) => ({
      guidanceSteps: {
        ...state.guidanceSteps,
        [caseId]: steps,
      },
    })),
  markStepCompleted: (caseId, stepId, completed) =>
    set((state) => {
      const caseSteps = state.guidanceSteps[caseId] || [];
      return {
        guidanceSteps: {
          ...state.guidanceSteps,
          [caseId]: caseSteps.map((step) =>
            step.id === stepId ? { ...step, completed } : step
          ),
        },
      };
    }),
  clearGuidance: (caseId) =>
    set((state) => {
      const { [caseId]: _, ...rest } = state.guidanceSteps;
      return { guidanceSteps: rest };
    }),
}));
