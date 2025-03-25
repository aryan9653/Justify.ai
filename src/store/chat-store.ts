"use client";

import { create } from "zustand";

export interface Message {
  id: string;
  caseId: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
}

interface ChatStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  deleteMessage: (id: string) => void;
  clearCaseMessages: (caseId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
    })),
  clearCaseMessages: (caseId) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.caseId !== caseId),
    })),
}));
