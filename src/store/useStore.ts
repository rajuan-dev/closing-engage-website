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
  eoCoverage: string;
  backgroundScreeningStatus: "Pending" | "Verified" | "Failed";
  backgroundScreeningDetail: string;
  notifications: {
    email: boolean;
    orders: boolean;
    documents: boolean;
  };
}

export interface CompanyProfile {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  companyEmail: string;
  contactNumber: string;
  businessAddress: string;
  notifications: {
    email: boolean;
    orders: boolean;
    documents: boolean;
  };
}

export interface CredentialRecord {
  documentName: string;
  issuer: string;
  uploadDate: string;
  action: "Auto-Verified" | "Manual Review";
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
  notaryCredentials: CredentialRecord[];
  addNotaryCredential: (credential: CredentialRecord) => void;
  companyProfile: CompanyProfile;
  updateCompanyProfile: (updates: Partial<CompanyProfile>) => void;
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
    licenseNumber: "CA-8829-2024",
    commissionExpiry: "2027-11-14",
    serviceArea: "Austin, TX & surrounding Travis County",
    avatarUrl: "",
    eoCoverage: "$100,000.00",
    backgroundScreeningStatus: "Pending",
    backgroundScreeningDetail: "Under review by the compliance department. Estimated completion: 48 hours.",
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
  notaryCredentials: [
    { documentName: "NNA Certification", issuer: "Nat. Notary Assoc.", uploadDate: "Oct 24, 2024", action: "Auto-Verified" },
    { documentName: "Federal Ledger", issuer: "Identity Verification", uploadDate: "Sep 12, 2024", action: "Manual Review" },
  ],
  addNotaryCredential: (credential) =>
    set((state) => ({
      notaryCredentials: [credential, ...state.notaryCredentials],
    })),
  companyProfile: {
    fullName: "Alex Sterling",
    email: "alex.s@estateflux.com",
    phone: "+1 (555) 902-4412",
    companyName: "Estate Flux Title",
    companyEmail: "ops@estateflux.com",
    contactNumber: "+1 (555) 200-1100",
    businessAddress: "782 Commerce Blvd, Austin TX",
    notifications: {
      email: true,
      orders: true,
      documents: false,
    },
  },
  updateCompanyProfile: (updates) =>
    set((state) => ({
      companyProfile: {
        ...state.companyProfile,
        ...updates,
      },
    })),
}));
