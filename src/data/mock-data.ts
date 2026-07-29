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

export const companyMetrics: MetricCard[] = [
  { title: "Total Orders", value: "1,248", tone: "brand" },
  { title: "Active Orders", value: "342", tone: "brand" },
  { title: "Pending Review", value: "56", tone: "warning" },
  { title: "Completed Orders", value: "850", tone: "success" },
];

export const companyOrders: Order[] = [
  { id: "#ORD-92831", clientName: "Sarah Jenkins", propertyAddress: "742 Evergreen Terrace, Springfield", notary: "--", status: "Received", date: "Mar 20, 2026" },
  { id: "#ORD-92830", clientName: "Michael Chen", propertyAddress: "1200 Market St, Philadelphia", notary: "David Miller", status: "Assigned", date: "Feb 23, 2026" },
  { id: "#ORD-92829", clientName: "Emily Rodriguez", propertyAddress: "45 Pine Ave, Long Beach", notary: "Robert Vance", status: "Under Review", date: "Feb 22, 2026" },
  { id: "#ORD-92828", clientName: "Jordan Smith", propertyAddress: "880 Oak Lane, Denver", notary: "Elena Wright", status: "Approved", date: "Feb 22, 2026" },
  { id: "#ORD-92827", clientName: "Laura Palmer", propertyAddress: "704 Twin Peaks Dr, Snoqualmie", notary: "Gordon Cole", status: "Completed", date: "Feb 21, 2026" },
  { id: "#ORD-92826", clientName: "David Davidson", propertyAddress: "1428 Elm St, Springwood", notary: "Nancy Thompson", status: "Received", date: "Feb 20, 2026" },
  { id: "#ORD-92825", clientName: "John Connor", propertyAddress: "1000 S Hope St, Los Angeles", notary: "Sarah Connor", status: "Assigned", date: "Feb 19, 2026" },
  { id: "#ORD-92824", clientName: "Bruce Wayne", propertyAddress: "1007 Mountain Drive, Gotham", notary: "Alfred Pennyworth", status: "Under Review", date: "Feb 18, 2026" },
  { id: "#ORD-92823", clientName: "Clark Kent", propertyAddress: "327 Clinton St, Metropolis", notary: "Lois Lane", status: "Approved", date: "Feb 17, 2026" },
  { id: "#ORD-92822", clientName: "Peter Parker", propertyAddress: "20 Ingram St, Queens", notary: "May Parker", status: "Completed", date: "Feb 16, 2026" },
  { id: "#ORD-92821", clientName: "Tony Stark", propertyAddress: "10880 Malibu Point, Malibu", notary: "Pepper Potts", status: "Received", date: "Feb 15, 2026" },
  { id: "#ORD-92820", clientName: "Diana Prince", propertyAddress: "700 Gateway Dr, Washington", notary: "Steve Trevor", status: "Assigned", date: "Feb 14, 2026" },
  { id: "#ORD-92819", clientName: "Arthur Dent", propertyAddress: "155 Country Lane, Cottington", notary: "Ford Prefect", status: "Under Review", date: "Feb 13, 2026" },
  { id: "#ORD-92818", clientName: "Luke Skywalker", propertyAddress: "Lars Homestead, Tatooine", notary: "Obi-Wan Kenobi", status: "Completed", date: "Feb 12, 2026" },
  { id: "#ORD-92817", clientName: "Frodo Baggins", propertyAddress: "3 Bagshot Row, Hobbiton", notary: "Gandalf Grey", status: "Approved", date: "Feb 11, 2026" },
];

export const recentActivities: ActivityItem[] = [
  { title: "Order assigned to notary", description: "Robert Wilson took #89210", time: "2 mins ago" },
  { title: "Status updated for #89210", description: "Moved to 'Under Review'", time: "45 mins ago" },
  { title: "Document approved by client", description: "Sarah Jones verified all files", time: "2 hours ago" },
];

export const companyDocuments: DocumentRecord[] = [
  { id: "1", name: "Closing_Disclosure_Final.pdf", orderId: "ORD-99281", uploadDate: "Mar 18, 2026", size: "2.4 MB", status: "Approved", uploadedBy: "Notary Sarah Jones" },
  { id: "2", name: "Title_Commitment_Schedule_A.pdf", orderId: "ORD-99281", uploadDate: "Mar 17, 2026", size: "1.1 MB", status: "Approved", uploadedBy: "Notary Sarah Jones" },
  { id: "3", name: "Wire_Instructions_Verified.pdf", orderId: "ORD-88210", uploadDate: "Mar 16, 2026", size: "450 KB", status: "Approved", uploadedBy: "Notary Sarah Jones" },
  { id: "4", name: "Warranty_Deed_Draft.pdf", orderId: "ORD-99281", uploadDate: "Mar 15, 2026", size: "3.2 MB", status: "Approved", uploadedBy: "Notary Sarah Jones" },
  { id: "5", name: "Homeowners_Insurance_Proof.pdf", orderId: "ORD-92831", uploadDate: "Mar 14, 2026", size: "1.5 MB", status: "Approved", uploadedBy: "Notary Sarah Jones" },
  { id: "6", name: "Property_Tax_Verification.pdf", orderId: "ORD-92831", uploadDate: "Mar 13, 2026", size: "890 KB", status: "Pending", uploadedBy: "Notary Sarah Jones" },
  { id: "7", name: "Closing_Package_V1.pdf", orderId: "ORD-92830", uploadDate: "Mar 12, 2026", size: "12.4 MB", status: "Approved", uploadedBy: "Notary Sarah Jones" },
  { id: "8", name: "Notary_Acknowledgment.pdf", orderId: "ORD-92830", uploadDate: "Mar 11, 2026", size: "320 KB", status: "Approved", uploadedBy: "Notary Sarah Jones" },
  { id: "9", name: "Buyer_ID_Copy.pdf", orderId: "ORD-92829", uploadDate: "Mar 10, 2026", size: "1.2 MB", status: "Approved", uploadedBy: "Notary Sarah Jones" },
  { id: "10", name: "Seller_Signed_Packet.pdf", orderId: "ORD-92828", uploadDate: "Mar 09, 2026", size: "8.7 MB", status: "Approved", uploadedBy: "Notary Sarah Jones" },
  { id: "11", name: "Escrow_Instruction_Letter.pdf", orderId: "ORD-92827", uploadDate: "Mar 08, 2026", size: "540 KB", status: "Approved", uploadedBy: "Notary Sarah Jones" },
  { id: "12", name: "Final_Settlement_Statement.pdf", orderId: "ORD-99281", uploadDate: "Mar 07, 2026", size: "2.1 MB", status: "Approved", uploadedBy: "Notary Sarah Jones" },
];

export const teamMembers: TeamMember[] = [
  {
    name: "John Doe",
    email: "john.doe@closingengage.com",
    role: "Admin",
    status: "Active",
    joinedDate: "Feb 12, 2026",
    permissions: { createOrders: true, viewOrders: true, downloadDocuments: true },
  },
  {
    name: "Sarah Chen",
    email: "s.chen@legalpartners.com",
    role: "Member",
    status: "Pending Invite",
    joinedDate: "—",
    permissions: { createOrders: true, viewOrders: true, downloadDocuments: false },
  },
  {
    name: "Marcus Bell",
    email: "m.bell@titlepro.net",
    role: "Member",
    status: "Active",
    joinedDate: "Feb 05, 2026",
    permissions: { createOrders: true, viewOrders: true, downloadDocuments: false },
  },
];

export const notaryMetrics: MetricCard[] = [
  { title: "Total Assigned Orders", value: "24", tone: "brand", helper: "Global" },
  { title: "In Progress", value: "08", tone: "warning", helper: "Active" },
  { title: "Completed", value: "13", tone: "success", helper: "History" },
];

export const notaryOrders: Order[] = [
  { id: "#CE-94012", clientName: "Jonathan Harker", propertyAddress: "Denver, CO", notary: "JH", status: "In Progress", date: "Mar 22, 2026", time: "02:30 PM MDT", location: "Denver, CO" },
  { id: "#CE-93882", clientName: "Mina Stewart", propertyAddress: "Boulder, CO", notary: "MS", status: "Assigned", date: "Feb 25, 2026", time: "10:00 AM MDT", location: "Boulder, CO" },
  { id: "#CE-93551", clientName: "Abraham Van Helsing", propertyAddress: "Aurora, CO", notary: "AV", status: "Pending Upload", date: "Feb 23, 2026", time: "09:15 AM MDT", location: "Aurora, CO" },
  { id: "#CE-92119", clientName: "Lucy Crawford", propertyAddress: "Lakewood, CO", notary: "LC", status: "Completed", date: "Feb 22, 2026", time: "04:45 PM MDT", location: "Lakewood, CO" },
];

export const notaryAssignedOrders: Order[] = [
  { id: "#ORD-88219", clientName: "Eleanor Pemberton", propertyAddress: "San Francisco, CA", notary: "Refinance - Single Family", status: "Assigned", date: "Oct 24, 2023", time: "2:30 PM PDT", location: "San Francisco, CA" },
  { id: "#ORD-88242", clientName: "Marcus Thorne", propertyAddress: "Oakland, CA", notary: "Seller Signing - HELOC", status: "In Progress", date: "Oct 25, 2023", time: "10:00 AM PDT", location: "Oakland, CA" },
  { id: "#ORD-88190", clientName: "Sarah Jennings", propertyAddress: "Palo Alto, CA", notary: "Buyer - Conventional", status: "Submitted", date: "Oct 22, 2023", time: "Completed", location: "Palo Alto, CA" },
];

export const credentialHistory: CredentialRecord[] = [
  { documentName: "NNA Certification", issuer: "Nat. Notary Assoc.", uploadDate: "Oct 24, 2024", action: "Auto-Verified" },
  { documentName: "Federal Ledger", issuer: "Identity Verification", uploadDate: "Sep 12, 2024", action: "Manual Review" },
];

export const chatMessages: ChatMessage[] = [
  { sender: "Admin Team", role: "admin", time: "10:45 AM", body: "Hello! We've received the uploaded documents for the Smith-Livingston closing. Could you please verify the witness signature on page 4?" },
  { sender: "You (Notary)", role: "you", time: "10:48 AM", body: "Confirmed. I'm looking at it now. The witness was present and signed in the presence of the signers. Let me send a high-res crop of that specific section for your confirmation." },
  { sender: "Sarah Johnson", role: "admin", time: "10:50 AM", body: 'Perfect, that would be helpful. Once verified, we can move this to the "Ready for Recording" stage. Thanks for the quick response!' },
  { sender: "Sarah Johnson", role: "admin", time: "10:52 AM", body: "Also, do you have the tracking number for the physical copies yet?" },
];

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
