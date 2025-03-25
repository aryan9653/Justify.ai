"use client";

import { create } from "zustand";

export interface Case {
  id: string;
  title: string;
  caseType: string;
  description: string;
  createdAt: string;
  status: "new" | "in-progress" | "resolved";
}

interface CaseStore {
  cases: Case[];
  addCase: (caseData: Case) => void;
  updateCase: (id: string, caseData: Partial<Case>) => void;
  deleteCase: (id: string) => void;
}

export const useCaseStore = create<CaseStore>((set) => ({
  cases: [],
  addCase: (caseData) =>
    set((state) => ({ cases: [...state.cases, caseData] })),
  updateCase: (id, caseData) =>
    set((state) => ({
      cases: state.cases.map((c) => (c.id === id ? { ...c, ...caseData } : c)),
    })),
  deleteCase: (id) =>
    set((state) => ({
      cases: state.cases.filter((c) => c.id !== id),
    })),
}));
