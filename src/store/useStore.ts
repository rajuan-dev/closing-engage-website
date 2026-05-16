import { create } from "zustand";
import {
  companyOrders,
  companyDocuments,
  teamMembers,
  notaryOrders,
  notaryAssignedOrders,
  recentActivities,
} from "@/data/mock-data";
import type { Order, DocumentRecord, TeamMember, ActivityItem } from "@/types/models";

interface AppState {
  companyOrders: Order[];
  addCompanyOrder: (order: Order) => void;
  updateCompanyOrder: (id: string, updates: Partial<Order>) => void;
  companyDocuments: DocumentRecord[];
  addCompanyDocument: (doc: DocumentRecord) => void;
  teamMembers: TeamMember[];
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (email: string, updates: Partial<TeamMember>) => void;
  removeTeamMember: (email: string) => void;
  notaryOrders: Order[];
  notaryAssignedOrders: Order[];
  recentActivities: ActivityItem[];
  addActivity: (activity: ActivityItem) => void;
  clearActivities: () => void;
}

export const useStore = create<AppState>((set) => ({
  companyOrders: [...companyOrders],
  addCompanyOrder: (order) => set((state) => ({ companyOrders: [order, ...state.companyOrders] })),
  updateCompanyOrder: (id, updates) =>
    set((state) => ({
      companyOrders: state.companyOrders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    })),
  companyDocuments: [...companyDocuments],
  addCompanyDocument: (doc) => set((state) => ({ companyDocuments: [doc, ...state.companyDocuments] })),
  teamMembers: [...teamMembers],
  addTeamMember: (member) => set((state) => ({ teamMembers: [member, ...state.teamMembers] })),
  updateTeamMember: (email, updates) =>
    set((state) => ({
      teamMembers: state.teamMembers.map((m) => (m.email === email ? { ...m, ...updates } : m)),
    })),
  removeTeamMember: (email) =>
    set((state) => ({
      teamMembers: state.teamMembers.filter((m) => m.email !== email),
    })),
  notaryOrders: [...notaryOrders],
  notaryAssignedOrders: [...notaryAssignedOrders],
  recentActivities: [...recentActivities],
  addActivity: (activity) => set((state) => ({ recentActivities: [activity, ...state.recentActivities] })),
  clearActivities: () => set({ recentActivities: [] }),
}));
