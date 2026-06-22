import { portalAuthService } from "./portalAuthService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export type NotaryScreeningStatus = "Pending" | "Verified" | "Failed";
export type NotaryCredentialVerification = "Auto-Verified" | "Manual Review";

export interface NotaryCredentialRecord {
  id: string;
  documentName: string;
  issuer: string;
  uploadDate: string;
  verification: NotaryCredentialVerification;
}

export interface NotaryCredentials {
  licenseNumber: string;
  commissionAuthority: string;
  commissionExpiry: string;
  eoCoverage: string;
  verified: boolean;
  backgroundScreeningStatus: NotaryScreeningStatus;
  backgroundScreeningDetail: string;
  credentials: NotaryCredentialRecord[];
}

export interface CommissionUpdatePayload {
  licenseNumber?: string;
  commissionAuthority?: string;
  commissionExpiry?: string;
  eoCoverage?: string;
  backgroundScreeningStatus?: NotaryScreeningStatus;
  backgroundScreeningDetail?: string;
}

export interface CredentialUploadPayload {
  documentName: string;
  issuer: string;
  verification?: NotaryCredentialVerification;
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

export const notaryService = {
  async getCredentials(): Promise<NotaryCredentials> {
    return request<NotaryCredentials>("/notary/credentials");
  },

  async updateCommission(payload: CommissionUpdatePayload): Promise<NotaryCredentials> {
    return request<NotaryCredentials>("/notary/credentials", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async addCredential(payload: CredentialUploadPayload): Promise<NotaryCredentials> {
    return request<NotaryCredentials>("/notary/credentials", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
