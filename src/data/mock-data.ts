import {
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  FolderOpen,
  Landmark,
  Mail,
  Shield,
  Users,
} from "lucide-react";
import type {
  ActivityItem,
  ChatMessage,
  CredentialRecord,
  DocumentRecord,
  MetricCard,
  NavItem,
  Order,
  TeamMember,
} from "@/types/models";

export const publicNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const companyNav: NavItem[] = [
  { label: "Dashboard", href: "/company/dashboard", icon: ClipboardList },
  { label: "Orders", href: "/company/orders", icon: BriefcaseBusiness },
  { label: "Documents", href: "/company/documents", icon: FileText },
  { label: "Team Management", href: "/company/team", icon: Users },
  { label: "Settings", href: "/company/settings", icon: Shield },
];

export const notaryNav: NavItem[] = [
  { label: "Dashboard", href: "/notary/dashboard", icon: ClipboardList },
  { label: "Assigned Orders", href: "/notary/orders", icon: BriefcaseBusiness },
  { label: "Upload Documents", href: "/notary/upload-documents", icon: FolderOpen },
  { label: "Communications", href: "/notary/communications", icon: Mail },
  { label: "Notary Credentials", href: "/notary/credentials", icon: CheckCircle2 },
  { label: "Settings", href: "/notary/settings", icon: Shield },
];

export const companyMetrics: MetricCard[] = [];

export const companyOrders: Order[] = [];

export const recentActivities: ActivityItem[] = [];

export const companyDocuments: DocumentRecord[] = [];

export const teamMembers: TeamMember[] = [];

export const notaryMetrics: MetricCard[] = [];

export const notaryOrders: Order[] = [];

export const notaryAssignedOrders: Order[] = [];

export const credentialHistory: CredentialRecord[] = [];

export const chatMessages: ChatMessage[] = [];

export const serviceCards = [
  { title: "Closing Order Management", body: "Streamline the creation and tracking of every closing order with precision and ease.", icon: ClipboardList },
  { title: "Notary Assignment System", body: "Efficiently match and assign vetted notaries to orders based on location and availability.", icon: Landmark },
  { title: "Secure Document Upload", body: "End-to-end encrypted uploads for sensitive closing packets, ensuring total privacy.", icon: FileCheck2 },
  { title: "Scanback Review & Approval", body: "Real-time review and feedback loops for uploaded documents to catch errors instantly.", icon: FileText },
  { title: "Real-Time Order Tracking", body: "Monitor every stage of the closing process from a single, high-clarity dashboard.", icon: Bell },
  { title: "Email Notifications", body: "Automated alerts for all stakeholders throughout the order lifecycle to keep everyone informed.", icon: Mail },
];

export const reliabilityCards = [
  { title: "Secure Document Management", body: "Securely store and manage closing documents with encrypted access and controlled permissions", icon: FileCheck2 },
  { title: "Efficient Notary Assignment", body: "Connect title companies with qualified notaries while helping notaries receive consistent, relevant assignments", icon: Users },
  { title: "Real-Time Order Tracking", body: "Provide full visibility for all parties with live updates throughout the closing process", icon: ClipboardList },
  { title: "High-Volume Document Handling", body: "Handle large closing packages efficiently for both title teams and signing professionals", icon: FolderOpen },
];
