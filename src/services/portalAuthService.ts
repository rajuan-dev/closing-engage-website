const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:5000/api/v1";

const ACTIVE_ROLE_KEY = "portal_auth_active_role";
const roleTokenKey = (role: PortalRole) => `portal_auth_token_${role}`;
const roleUserKey = (role: PortalRole) => `portal_auth_user_${role}`;

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
  avatarUrl?: string;
}

interface NotaryProfilePayload {
  fullName?: string;
  specialty?: string;
  email?: string;
  phone?: string;
  license?: string;
  expiry?: string;
  serviceArea?: string;
  avatarUrl?: string;
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
  tokenKey: ACTIVE_ROLE_KEY,
  roleKey: ACTIVE_ROLE_KEY,

  inferRole(preferredRole?: PortalRole): PortalRole | null {
    if (preferredRole) return preferredRole;

    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/company/")) return "company";
      if (path.startsWith("/notary/")) return "notary";
    }

    const activeRole = localStorage.getItem(ACTIVE_ROLE_KEY);
    return activeRole === "company" || activeRole === "notary" ? activeRole : null;
  },

  getToken(role?: PortalRole): string | null {
    const resolvedRole = this.inferRole(role);
    return resolvedRole ? localStorage.getItem(roleTokenKey(resolvedRole)) : null;
  },

  getRole(preferredRole?: PortalRole): PortalRole | null {
    return this.inferRole(preferredRole);
  },

  getUser(role?: PortalRole): unknown | null {
    const resolvedRole = this.inferRole(role);
    if (!resolvedRole) return null;

    const saved = localStorage.getItem(roleUserKey(resolvedRole));
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  },

  setSession(session: PortalLoginResponse): void {
    localStorage.setItem(roleTokenKey(session.role), session.token);
    localStorage.setItem(roleUserKey(session.role), JSON.stringify(session.user));
    localStorage.setItem(ACTIVE_ROLE_KEY, session.role);
  },

  setUser(user: unknown, role?: PortalRole): void {
    const resolvedRole = this.inferRole(role);
    if (!resolvedRole) return;

    localStorage.setItem(roleUserKey(resolvedRole), JSON.stringify(user));
  },

  clearSession(role?: PortalRole): void {
    const resolvedRole = this.inferRole(role);
    if (!resolvedRole) {
      localStorage.removeItem(ACTIVE_ROLE_KEY);
      return;
    }

    localStorage.removeItem(roleTokenKey(resolvedRole));
    localStorage.removeItem(roleUserKey(resolvedRole));

    const otherRole: PortalRole = resolvedRole === "company" ? "notary" : "company";
    const nextRole = localStorage.getItem(roleTokenKey(otherRole)) ? otherRole : null;

    if (nextRole) {
      localStorage.setItem(ACTIVE_ROLE_KEY, nextRole);
    } else {
      localStorage.removeItem(ACTIVE_ROLE_KEY);
    }
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
    const token = this.getToken(role);
    if (!token) throw new Error("Missing portal token");

    const response = await fetch(`${API_BASE_URL}/auth/${role}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await parseResponse<Record<PortalRole, unknown>>(response);
    const user = data[role];
    this.setUser(user, role);
    return user;
  },

  async updateCompanyProfile(payload: CompanyProfilePayload): Promise<unknown> {
    const token = this.getToken("company");
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
    this.setUser(data.company, "company");
    return data.company;
  },

  async updateNotaryProfile(payload: NotaryProfilePayload): Promise<unknown> {
    const token = this.getToken("notary");
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
    this.setUser(data.notary, "notary");
    return data.notary;
  },

  async updateCompanyPassword(payload: PasswordPayload): Promise<void> {
    const token = this.getToken("company");
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
    const token = this.getToken("notary");
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
