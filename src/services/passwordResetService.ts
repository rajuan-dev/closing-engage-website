const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:5000/api/v1";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
}

const parseResponse = async <T>(response: Response): Promise<ApiEnvelope<T>> => {
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload;
};

const post = async <T>(path: string, body: unknown): Promise<ApiEnvelope<T>> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return parseResponse<T>(response);
};

export const passwordResetService = {
  forgotPassword(email: string) {
    return post<Record<string, never>>("/auth/forgot-password", { email });
  },

  verifyOtp(email: string, otp: string) {
    return post<Record<string, never>>("/auth/verify-otp", { email, otp });
  },

  resetPassword(email: string, otp: string, newPassword: string, confirmPassword: string) {
    return post<Record<string, never>>("/auth/reset-password", {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
  },
};
