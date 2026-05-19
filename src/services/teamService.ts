import type { TeamMember } from "@/types/models";
import { portalAuthService } from "./portalAuthService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CreateTeamMemberResponse {
  member: TeamMember;
  temporaryPassword: string;
  inviteDelivered: boolean;
}

type RawTeamMember = TeamMember & {
  _id?: string;
  id?: string;
  permissions?: TeamMember["permissions"];
};

const normalizeTeamMember = (member: RawTeamMember): TeamMember => ({
  name: member.name,
  email: member.email,
  phone: member.phone || "",
  role: member.role,
  status: member.status,
  joinedDate: member.joinedDate || "—",
  permissions: member.permissions || {
    createOrders: true,
    viewOrders: true,
    downloadDocuments: false,
  },
});

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

export const teamService = {
  async getMembers(): Promise<TeamMember[]> {
    const members = await request<RawTeamMember[]>("/team");
    return members.map(normalizeTeamMember);
  },

  async createMember(member: TeamMember & { sendInvite?: boolean }): Promise<CreateTeamMemberResponse> {
    const result = await request<CreateTeamMemberResponse>("/team", {
      method: "POST",
      body: JSON.stringify(member),
    });
    return {
      ...result,
      member: normalizeTeamMember(result.member),
    };
  },

  async updateMember(email: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    const member = await request<RawTeamMember>(`/team/${encodeURIComponent(email)}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    return normalizeTeamMember(member);
  },

  async deleteMember(email: string): Promise<void> {
    await request<Record<string, never>>(`/team/${encodeURIComponent(email)}`, {
      method: "DELETE",
    });
  },
};
