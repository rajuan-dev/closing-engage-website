const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:5000/api/v1";

const TOKEN_KEY = "portal_auth_token";
const ROLE_KEY = "portal_auth_role";
const USER_KEY = "portal_auth_user";

type PortalRole = "company" | "notary";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PortalLoginResponse {
  token: string;
  role: PortalRole;
  user: unknown;
  redirectTo: string;
}

interface CompanyProfilePayload {
  contactPerson?: string;
  businessEmail?: string;
  phone?: string;
  companyName?: string;
  contactEmail?: string;
  address?: string;
}

interface NotaryProfilePayload {
  fullName?: string;
  specialty?: string;
  email?: string;
  phone?: string;
  license?: string;
  expiry?: string;
  serviceArea?: string;
}

interface PasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export class PortalApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PortalApiError";
    this.status = status;
  }
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.success) {
    throw new PortalApiError(payload?.message || "Request failed", response.status);
  }

  return payload.data;
};

export const portalAuthService = {
  tokenKey: TOKEN_KEY,
  roleKey: ROLE_KEY,

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRole(): PortalRole | null {
    const role = localStorage.getItem(ROLE_KEY);
    return role === "company" || role === "notary" ? role : null;
  },

  getUser(): unknown | null {
    const saved = localStorage.getItem(USER_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  },

  setSession(session: PortalLoginResponse): void {
    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(ROLE_KEY, session.role);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  },

  setUser(user: unknown): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async login(email: string, password: string): Promise<PortalLoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/portal/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const session = await parseResponse<PortalLoginResponse>(response);
    this.setSession(session);
    return session;
  },

  async fetchMe(role: PortalRole): Promise<unknown> {
    const token = this.getToken();
    if (!token) throw new Error("Missing portal token");

    const response = await fetch(`${API_BASE_URL}/auth/${role}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await parseResponse<Record<PortalRole, unknown>>(response);
    const user = data[role];
    this.setUser(user);
    return user;
  },

  async updateCompanyProfile(payload: CompanyProfilePayload): Promise<unknown> {
    const token = this.getToken();
    if (!token) throw new Error("Missing portal token");

    const response = await fetch(`${API_BASE_URL}/auth/company/profile`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<{ company: unknown }>(response);
    this.setUser(data.company);
    return data.company;
  },

  async updateNotaryProfile(payload: NotaryProfilePayload): Promise<unknown> {
    const token = this.getToken();
    if (!token) throw new Error("Missing portal token");

    const response = await fetch(`${API_BASE_URL}/auth/notary/profile`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse<{ notary: unknown }>(response);
    this.setUser(data.notary);
    return data.notary;
  },

  async updateCompanyPassword(payload: PasswordPayload): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error("Missing portal token");

    const response = await fetch(`${API_BASE_URL}/auth/company/password`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    await parseResponse<unknown>(response);
  },

  async updateNotaryPassword(payload: PasswordPayload): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error("Missing portal token");

    const response = await fetch(`${API_BASE_URL}/auth/notary/password`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    await parseResponse<unknown>(response);
  },
};
