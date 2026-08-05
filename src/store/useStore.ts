import { create } from "zustand";
import {
  teamMembers,
  recentActivities,
  chatMessages,
} from "@/data/mock-data";
import type { Order, DocumentRecord, TeamMember, ActivityItem, ChatMessage, NotificationItem } from "@/types/models";

const ROLE_USER_KEY = {
  company: "portal_auth_user_company",
  notary: "portal_auth_user_notary",
} as const;

const getScopedProfileStorageKey = (role: "company" | "notary", email?: string) => {
  const normalizedEmail = email?.trim().toLowerCase();
  return normalizedEmail ? `website_${role}_profile_${normalizedEmail}` : `website_${role}_profile`;
};

const getSessionUserEmail = (role: "company" | "notary") => {
  const saved = localStorage.getItem(ROLE_USER_KEY[role]);
  if (!saved) return "";

  try {
    const parsed = JSON.parse(saved) as { email?: string } | null;
    return parsed?.email?.trim().toLowerCase() || "";
  } catch {
    return "";
  }
};

const readScopedProfile = <T>(role: "company" | "notary", fallback: T): T => {
  const email = getSessionUserEmail(role);
  const storageKey = getScopedProfileStorageKey(role, email);
  const saved = localStorage.getItem(storageKey);

  try {
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const writeScopedProfile = (role: "company" | "notary", profile: unknown, email?: string) => {
  const normalizedEmail = email?.trim().toLowerCase() || getSessionUserEmail(role);
  localStorage.setItem(getScopedProfileStorageKey(role, normalizedEmail), JSON.stringify(profile));
  localStorage.removeItem(`website_${role}_profile`);
};

export interface NotaryProfile {
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  commissionExpiry: string;
  serviceArea: string;
  state?: string;
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
  state?: string;
  avatarUrl?: string;
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
  setCompanyOrders: (orders: Order[]) => void;
  addCompanyOrder: (order: Order) => void;
  updateCompanyOrder: (id: string, updates: Partial<Order>) => void;
  companyDocuments: DocumentRecord[];
  setCompanyDocuments: (documents: DocumentRecord[]) => void;
  addCompanyDocument: (doc: DocumentRecord) => void;
  teamMembers: TeamMember[];
  teamMembersLoaded: boolean;
  setTeamMembers: (members: TeamMember[]) => void;
  setTeamMembersLoaded: (loaded: boolean) => void;
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (email: string, updates: Partial<TeamMember>) => void;
  removeTeamMember: (email: string) => void;
  notaryOrders: Order[];
  setNotaryOrders: (orders: Order[]) => void;
  updateNotaryOrder: (id: string, updates: Partial<Order>) => void;
  notaryAssignedOrders: Order[];
  setNotaryAssignedOrders: (orders: Order[]) => void;
  notifications: NotificationItem[];
  setNotifications: (notifications: NotificationItem[]) => void;
  upsertNotification: (notification: NotificationItem) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  recentActivities: ActivityItem[];
  addActivity: (activity: ActivityItem) => void;
  clearActivities: () => void;
  notaryProfile: NotaryProfile;
  updateNotaryProfile: (updates: Partial<NotaryProfile>) => void;
  notaryCredentials: CredentialRecord[];
  addNotaryCredential: (credential: CredentialRecord) => void;
  companyProfile: CompanyProfile;
  updateCompanyProfile: (updates: Partial<CompanyProfile>) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
}

export const useStore = create<AppState>((set) => ({
  companyOrders: [],
  setCompanyOrders: (orders) => set({ companyOrders: orders }),
  addCompanyOrder: (order) => set((state) => ({ companyOrders: [order, ...state.companyOrders] })),
  updateCompanyOrder: (id, updates) =>
    set((state) => ({
      companyOrders: state.companyOrders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    })),
  companyDocuments: [],
  setCompanyDocuments: (documents) => set({ companyDocuments: documents }),
  addCompanyDocument: (doc) => set((state) => ({ companyDocuments: [doc, ...state.companyDocuments] })),
  teamMembers: [...teamMembers],
  teamMembersLoaded: false,
  setTeamMembers: (members) => set({ teamMembers: members, teamMembersLoaded: true }),
  setTeamMembersLoaded: (loaded) => set({ teamMembersLoaded: loaded }),
  addTeamMember: (member) => set((state) => ({ teamMembers: [member, ...state.teamMembers] })),
  updateTeamMember: (email, updates) =>
    set((state) => ({
      teamMembers: state.teamMembers.map((m) => (m.email === email ? { ...m, ...updates } : m)),
    })),
  removeTeamMember: (email) =>
    set((state) => ({
      teamMembers: state.teamMembers.filter((m) => m.email !== email),
    })),
  notaryOrders: [],
  setNotaryOrders: (orders) => set({ notaryOrders: orders }),
  updateNotaryOrder: (id, updates) =>
    set((state) => ({
      notaryOrders: state.notaryOrders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
      notaryAssignedOrders: state.notaryAssignedOrders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    })),
  notaryAssignedOrders: [],
  setNotaryAssignedOrders: (orders) => set({ notaryAssignedOrders: orders }),
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
  upsertNotification: (notification) =>
    set((state) => {
      const existing = state.notifications.find((item) => item.id === notification.id);
      if (existing) {
        return {
          notifications: state.notifications.map((item) =>
            item.id === notification.id ? { ...item, ...notification } : item,
          ),
        };
      }

      return {
        notifications: [notification, ...state.notifications],
      };
    }),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    })),
  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
  recentActivities: [...recentActivities],
  addActivity: (activity) => set((state) => ({ recentActivities: [activity, ...state.recentActivities] })),
  clearActivities: () => set({ recentActivities: [] }),
  notaryProfile: readScopedProfile("notary", {
    fullName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    commissionExpiry: "",
    serviceArea: "",
    avatarUrl: "",
    eoCoverage: "$100,000.00",
    backgroundScreeningStatus: "Pending",
    backgroundScreeningDetail: "Under review by the compliance department. Estimated completion: 48 hours.",
    notifications: {
      email: true,
      orders: true,
      documents: false,
    },
  }),
  updateNotaryProfile: (updates) =>
    set((state) => {
      const newProfile = { ...state.notaryProfile, ...updates };
      writeScopedProfile("notary", newProfile, newProfile.email);
      return { notaryProfile: newProfile };
    }),
  notaryCredentials: [],
  addNotaryCredential: (credential) =>
    set((state) => ({
      notaryCredentials: [credential, ...state.notaryCredentials],
    })),
  companyProfile: readScopedProfile("company", {
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    companyEmail: "",
    contactNumber: "",
    businessAddress: "",
    avatarUrl: "",
    notifications: {
      email: true,
      orders: true,
      documents: false,
    },
  }),
  updateCompanyProfile: (updates) =>
    set((state) => {
      const newProfile = { ...state.companyProfile, ...updates };
      writeScopedProfile("company", newProfile, newProfile.email);
      return { companyProfile: newProfile };
    }),
  chatMessages: [...chatMessages],
  addChatMessage: (msg) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, msg],
    })),
}));
