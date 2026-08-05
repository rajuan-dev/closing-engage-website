import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export interface MetricCard {
  title: string;
  value: string;
  tone?: "brand" | "warning" | "success";
  helper?: string;
}

export interface Order {
  id: string;
  clientName: string;
  propertyAddress: string;
  notary: string;
  notaryAvatarUrl?: string;
  assignedNotaryId?: string;
  openForAll?: boolean;
  state?: string;
  price?: number | null;
  status:
    | "Received"
    | "Assigned"
    | "Under Review"
    | "Approved"
    | "Completed"
    | "In Progress"
    | "Pending Upload"
    | "Submitted";
  date: string;
  time?: string;
  location?: string;
  meeting?: {
    status: "scheduled" | "confirmed" | "rejected";
    date: string;
    time: string;
    scheduledByRole: "admin" | "company" | "notary";
    scheduledAt: string;
    confirmedByRole?: "admin" | "company" | "notary";
    confirmedAt?: string;
    rejectedByRole?: "company" | "notary" | "admin";
    rejectedAt?: string;
    rejectionNote?: string;
    preferredDate?: string;
    preferredTime?: string;
  } | null;
}

export interface DocumentRecord {
  id: string;
  name: string;
  orderId: string;
  uploadDate: string;
  size: string;
  status: "Approved" | "Submitted" | "Pending" | "Verified" | "Rejected";
  uploadedBy?: string;
  uploaderRole?: string;
}

export interface ActivityItem {
  title: string;
  description: string;
  time: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "order" | "document" | "user" | "system";
  linkId?: string;
  recipientRole?: "admin" | "company" | "notary";
}

export interface TeamMember {
  name: string;
  email: string;
  role: "Admin" | "Member";
  status: "Active" | "Pending Invite";
  joinedDate: string;
  phone?: string;
  permissions?: {
    createOrders: boolean;
    viewOrders: boolean;
    downloadDocuments: boolean;
  };
}

export interface CredentialRecord {
  documentName: string;
  issuer: string;
  uploadDate: string;
  action: string;
}

export interface ChatMessage {
  sender: string;
  role: "admin" | "you";
  time: string;
  body: string;
}
