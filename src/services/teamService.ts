import type { TeamMember } from "@/types/models";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export const teamService = {
  async getMembers(): Promise<TeamMember[]> {
    const response = await fetch(`${API_BASE_URL}/team`);
    const result = await response.json();
    return result.data;
  },

  async createMember(member: TeamMember): Promise<TeamMember> {
    const response = await fetch(`${API_BASE_URL}/team`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    });
    const result = await response.json();
    return result.data;
  },

  async updateMember(email: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    const response = await fetch(`${API_BASE_URL}/team/${email}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const result = await response.json();
    return result.data;
  },

  async deleteMember(email: string): Promise<void> {
    await fetch(`${API_BASE_URL}/team/${email}`, {
      method: "DELETE",
    });
  },
};
