import type { DocumentRecord, Order } from "@/types/models";
import { portalAuthService } from "./portalAuthService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface SignedDocumentUrl {
  url: string;
  expiresInSeconds: number;
  fileName: string;
  mode: "download" | "preview";
}

interface CreateOrderPayload {
  title: string;
  clientName: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  date?: string;
  loanType?: string;
  scanbacks: string;
  preferredNotary?: string;
  specialInstructions?: string;
  priority: string;
}

type RawOrder = Order & {
  _id?: string;
  orderNumber?: string;
  signingDate?: string;
  signingTime?: string;
  assignedNotaryName?: string;
  assignedNotaryId?: string;
  openForAll?: boolean;
  notaryAvatarUrl?: string;
  specialInstructions?: string;
  notaryNotes?: string;
  notaryPrintedConfirmed?: boolean;
  meeting?: {
    status: "scheduled" | "confirmed";
    date: string;
    time: string;
    scheduledByRole: "admin" | "company" | "notary";
    scheduledAt: string;
    confirmedByRole?: "admin" | "company" | "notary";
    confirmedAt?: string;
  } | null;
};

export type OrderDetail = Order & {
  specialInstructions: string;
  notaryNotes: string;
  notaryPrintedConfirmed?: boolean;
  timeline?: Array<{
    title: string;
    date: string;
    tone: "blue" | "slate" | "green" | "red";
  }>;
};

export interface DocumentDetail {
  id: string;
  fileName: string;
  name: string;
  orderId: string;
  orderNumber: string;
  uploadDate: string;
  uploadedAt: string;
  size: string;
  fileSize: number;
  mimeType: string;
  status: string;
  displayStatus: DocumentRecord["status"];
  uploadedBy: string;
  uploaderRole: "admin" | "company" | "notary" | "buyer" | "title-company";
  comments?: string;
}

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = portalAuthService.getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const result = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Request failed");
  }

  return result.data;
};

const requestBinary = async <T>(path: string, file: File): Promise<T> => {
  const token = portalAuthService.getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: file,
  });
  const result = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "File upload failed");
  }

  return result.data;
};

const requestFileObjectUrl = async (path: string): Promise<string> => {
  const token = portalAuthService.getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as ApiEnvelope<unknown> | null;
    throw new Error(result?.message || "Document file could not be loaded");
  }

  return URL.createObjectURL(await response.blob());
};

const formatSize = (bytes: number): string => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const todayDisplayDate = (): string =>
  new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const normalizeOrder = (order: RawOrder): Order => ({
  id: order.id || order.orderNumber || "",
  clientName: order.clientName || "",
  propertyAddress: order.propertyAddress || order.location || "",
  notary: order.notary || (order.assignedNotaryName === "Unassigned" ? "--" : order.assignedNotaryName) || "--",
  notaryAvatarUrl: order.notaryAvatarUrl || "",
  assignedNotaryId: order.assignedNotaryId || "",
  status: order.status || "Received",
  date: order.date || order.signingDate || "",
  time: order.time || order.signingTime || "",
  location: order.location || order.propertyAddress || "",
  meeting: order.meeting || null,
});

const isDirectlyAssignedNotaryOrder = (order: RawOrder) =>
  order.openForAll !== true && order.assignedNotaryName !== "Open for All";

const normalizeOrderDetail = (order: RawOrder): OrderDetail => ({
  ...normalizeOrder(order),
  specialInstructions: order.specialInstructions || "",
  notaryNotes: order.notaryNotes || "",
  notaryPrintedConfirmed: order.notaryPrintedConfirmed ?? false,
  timeline:
    order && typeof order === "object" && "timeline" in order && Array.isArray((order as { timeline?: unknown[] }).timeline)
      ? ((order as { timeline?: OrderDetail["timeline"] }).timeline ?? [])
      : [],
});

export const orderService = {
  async getCompanyOrders(): Promise<Order[]> {
    const orders = await request<RawOrder[]>("/orders");
    return orders.map(normalizeOrder);
  },

  async getAssignedOrders(): Promise<Order[]> {
    const orders = await request<RawOrder[]>("/orders");
    return orders.filter(isDirectlyAssignedNotaryOrder).map(normalizeOrder);
  },

  async getCompanyOrder(id: string): Promise<OrderDetail> {
    const order = await request<RawOrder>(`/orders/${encodeURIComponent(id)}`);
    return normalizeOrderDetail(order);
  },

  async getOrderDetail(id: string): Promise<OrderDetail> {
    const order = await request<RawOrder>(`/orders/${encodeURIComponent(id)}`);
    return normalizeOrderDetail(order);
  },

  async updateCompanyOrder(
    id: string,
    payload: Partial<Pick<Order, "clientName" | "propertyAddress" | "date">> & { specialInstructions?: string },
  ): Promise<OrderDetail> {
    const order = await request<RawOrder>(`/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        clientName: payload.clientName,
        propertyAddress: payload.propertyAddress,
        signingDate: payload.date,
        specialInstructions: payload.specialInstructions,
      }),
    });
    return normalizeOrderDetail(order);
  },

  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
    const role = portalAuthService.getRole();
    const endpoint =
      role === "notary"
        ? `/orders/${encodeURIComponent(id)}/notary-status`
        : `/orders/${encodeURIComponent(id)}/status`;

    const order = await request<RawOrder>(endpoint, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return normalizeOrder(order);
  },

  async updateNotaryOrderStatus(id: string, status: Order["status"]): Promise<Order> {
    const order = await request<RawOrder>(`/orders/${encodeURIComponent(id)}/notary-status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return normalizeOrder(order);
  },

  async scheduleOrder(id: string, signingDate: string, signingTime: string): Promise<OrderDetail> {
    const order = await request<RawOrder>(`/orders/${encodeURIComponent(id)}/meeting`, {
      method: "PATCH",
      body: JSON.stringify({ signingDate, signingTime }),
    });
    return normalizeOrderDetail(order);
  },

  async confirmOrderMeeting(id: string): Promise<OrderDetail> {
    const order = await request<RawOrder>(`/orders/${encodeURIComponent(id)}/meeting/confirm`, {
      method: "PATCH",
    });
    return normalizeOrderDetail(order);
  },

  async updateNotaryNotes(id: string, notaryNotes: string): Promise<OrderDetail> {
    const order = await request<RawOrder>(`/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ notaryNotes }),
    });
    return normalizeOrderDetail(order);
  },

  async confirmPrintedByNotary(id: string): Promise<OrderDetail> {
    const order = await request<RawOrder>(`/orders/${encodeURIComponent(id)}/printed-confirmation`, {
      method: "PATCH",
    });
    return normalizeOrderDetail(order);
  },

  async createCompanyOrder(payload: CreateOrderPayload): Promise<Order> {
    const order = await request<RawOrder>("/orders", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        date: payload.date || todayDisplayDate(),
        loanType: payload.loanType && payload.loanType !== "Select a loan type" ? payload.loanType : undefined,
        state: payload.state && payload.state !== "Select State" ? payload.state : undefined,
        preferredNotary: payload.preferredNotary || "No preference",
        scanbacksRequired: payload.scanbacks === "Yes",
      }),
    });

    return normalizeOrder(order);
  },

  async uploadCompanyDocuments(order: Order, files: File[]): Promise<DocumentRecord[]> {
    const uploadedDocuments: DocumentRecord[] = [];

    for (const file of files) {
      const query = new URLSearchParams({
        orderNumber: order.id,
        fileName: file.name,
        fileSize: String(file.size),
        size: formatSize(file.size),
        mimeType: file.type || "application/octet-stream",
        status: "Submitted",
      });
      const document = await requestBinary<{
        id: string;
        name: string;
        orderId: string;
        uploadDate: string;
        size: string;
        displayStatus?: DocumentRecord["status"];
        status?: string;
        uploadedBy?: string;
      }>(`/documents/upload?${query.toString()}`, file);

      uploadedDocuments.push({
        id: document.id,
        name: document.name,
        orderId: document.orderId,
        uploadDate: document.uploadDate,
        size: document.size,
        status: document.displayStatus || "Submitted",
        uploadedBy: document.uploadedBy || "Title Company",
        uploaderRole: "notary",
      });
    }

    return uploadedDocuments;
  },

  async uploadNotaryDocuments(order: Order, files: File[]): Promise<DocumentRecord[]> {
    return this.uploadCompanyDocuments(order, files);
  },

  async getCompanyDocuments(): Promise<DocumentRecord[]> {
    return request<DocumentRecord[]>("/documents?shape=portal");
  },

  async getDocumentDetails(): Promise<DocumentDetail[]> {
    return request<DocumentDetail[]>("/documents?shape=detail");
  },

  async getDocumentPreviewUrl(id: string): Promise<string> {
    const result = await request<SignedDocumentUrl>(`/documents/${encodeURIComponent(id)}/preview-url`);
    return result.url;
  },

  async getDocumentDownloadUrl(id: string): Promise<string> {
    return requestFileObjectUrl(`/documents/${encodeURIComponent(id)}/content?mode=download`);
  },

  async resubmitDocument(id: string): Promise<DocumentDetail> {
    return request<DocumentDetail>(`/documents/${encodeURIComponent(id)}/resubmit`, {
      method: "POST",
    });
  },

  async deleteDocument(id: string): Promise<boolean> {
    await request<Record<string, never>>(`/documents/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return true;
  },
};
