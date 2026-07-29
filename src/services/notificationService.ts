import { io, type Socket } from "socket.io-client";

import type { NotificationItem } from "@/types/models";
import { portalAuthService } from "./portalAuthService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
const SOCKET_BASE_URL = API_BASE_URL.replace(/\/api\/v\d+$/, "");

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface NotificationServerToClientEvents {
  "notifications:new": (payload: NotificationItem) => void;
  "notifications:read": (payload: { id: string }) => void;
  "notifications:read-all": () => void;
  "notifications:deleted": (payload: { id: string }) => void;
  "notifications:cleared": () => void;
}

interface NotificationClientToServerEvents {}

export type NotificationSocket = Socket<NotificationServerToClientEvents, NotificationClientToServerEvents>;

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

export const notificationService = {
  getNotifications(): Promise<NotificationItem[]> {
    return request<NotificationItem[]>("/notifications");
  },

  markRead(id: string): Promise<NotificationItem> {
    return request<NotificationItem>(`/notifications/${encodeURIComponent(id)}/read`, {
      method: "PATCH",
    });
  },

  markAllRead(): Promise<void> {
    return request<Record<string, never>>("/notifications/read-all", {
      method: "PATCH",
    }).then(() => undefined);
  },

  deleteNotification(id: string): Promise<void> {
    return request<Record<string, never>>(`/notifications/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).then(() => undefined);
  },

  clearAll(): Promise<void> {
    return request<Record<string, never>>("/notifications/clear-all", {
      method: "DELETE",
    }).then(() => undefined);
  },

  createSocket(): NotificationSocket | null {
    const token = portalAuthService.getToken();
    if (!token) return null;

    return io(SOCKET_BASE_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
  },
};
