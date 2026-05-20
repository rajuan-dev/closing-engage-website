import { io, type Socket } from "socket.io-client";

import { portalAuthService } from "./portalAuthService";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "http://localhost:5000/api/v1";
const SOCKET_BASE_URL = API_BASE_URL.replace(/\/api\/v\d+$/, "");

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CommunicationThread {
  id: string;
  orderNumber: string;
  companyId: string;
  notaryId: string;
  lastMessage: string;
  lastMessageAt: string;
  lastSenderRole: "admin" | "notary" | "";
  unreadCount: number;
}

export interface CommunicationMessage {
  id: string;
  threadId: string;
  orderNumber: string;
  senderId: string;
  senderRole: "admin" | "notary";
  senderName: string;
  body: string;
  createdAt: string;
  time: string;
  readByAdmin: boolean;
  readByNotary: boolean;
}

export interface CommunicationConversation {
  thread: CommunicationThread;
  messages: CommunicationMessage[];
}

export interface CommunicationSendResult {
  thread: CommunicationThread;
  message: CommunicationMessage;
}

interface ServerToClientEvents {
  "communications:message": (payload: CommunicationSendResult) => void;
}

interface ClientToServerEvents {
  "communications:join-order": (
    orderNumber: string,
    ack?: (payload: { success: boolean; data?: CommunicationConversation; message?: string }) => void,
  ) => void;
  "communications:send-message": (
    payload: { orderNumber: string; body: string },
    ack?: (payload: { success: boolean; data?: CommunicationSendResult; message?: string }) => void,
  ) => void;
}

export type CommunicationSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

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

const orderChatPath = (orderNumber: string, suffix = "") =>
  `/communications/orders/${encodeURIComponent(orderNumber)}${suffix}`;

export const communicationService = {
  getThreads(): Promise<CommunicationThread[]> {
    return request<CommunicationThread[]>("/communications/threads");
  },

  getOrderThread(orderNumber: string): Promise<CommunicationThread> {
    return request<CommunicationThread>(orderChatPath(orderNumber, "/thread"));
  },

  getOrderMessages(orderNumber: string): Promise<CommunicationConversation> {
    return request<CommunicationConversation>(orderChatPath(orderNumber, "/messages"));
  },

  sendOrderMessage(orderNumber: string, body: string): Promise<CommunicationSendResult> {
    return request<CommunicationSendResult>(orderChatPath(orderNumber, "/messages"), {
      method: "POST",
      body: JSON.stringify({ body }),
    });
  },

  createSocket(): CommunicationSocket | null {
    const token = portalAuthService.getToken();
    if (!token) return null;

    return io(SOCKET_BASE_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
  },
};
