const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:5000/api/v1';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ContactMessagePayload {
  fullName: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

export const contactService = {
  async sendMessage(payload: ContactMessagePayload) {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => null)) as ApiEnvelope<{ deliveredTo: string[] }> | null;

    if (!response.ok || !result?.success) {
      throw new Error(result?.message || 'Failed to send message');
    }

    return result.data;
  },
};
