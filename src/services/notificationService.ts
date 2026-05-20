import type { NotificationItem } from "@/types/models";
import { portalAuthService } from "./portalAuthService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
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
};
