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

export interface NotaryProfile {
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  commissionExpiry: string;
  serviceArea: string;
  avatarUrl?: string;
  notifications: {
    email: boolean;
    orders: boolean;
    documents: boolean;
  };
}

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
  updateNotaryOrder: (id: string, updates: Partial<Order>) => void;
  notaryAssignedOrders: Order[];
  recentActivities: ActivityItem[];
  addActivity: (activity: ActivityItem) => void;
  clearActivities: () => void;
  notaryProfile: NotaryProfile;
  updateNotaryProfile: (updates: Partial<NotaryProfile>) => void;
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
  updateNotaryOrder: (id, updates) =>
    set((state) => ({
      notaryOrders: state.notaryOrders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    })),
  notaryAssignedOrders: [...notaryAssignedOrders],
  recentActivities: [...recentActivities],
  addActivity: (activity) => set((state) => ({ recentActivities: [activity, ...state.recentActivities] })),
  clearActivities: () => set({ recentActivities: [] }),
  notaryProfile: {
    fullName: "Sarah Miller",
    email: "sarah.miller@title-experts.com",
    phone: "+1 (512) 555-0123",
    licenseNumber: "TX-992031-NM",
    commissionExpiry: "08/14/2026",
    serviceArea: "Austin, TX & surrounding Travis County",
    avatarUrl: "",
    notifications: {
      email: true,
      orders: true,
      documents: false,
    },
  },
  updateNotaryProfile: (updates) =>
    set((state) => ({
      notaryProfile: {
        ...state.notaryProfile,
        ...updates,
      },
    })),
}));
