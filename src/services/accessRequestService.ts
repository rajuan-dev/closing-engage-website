const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:5000/api/v1";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

const post = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Request failed");
  }

  return result.data;
};

export const accessRequestService = {
  async createCompanyRequest(payload: {
    role: "company";
    fullName: string;
    email: string;
    phone: string;
    companyName: string;
    contactType: string;
    requestType: string;
    coverageArea: string;
    message: string;
  }) {
    return post("/access-requests/company", payload);
  },
  async createNotaryRequest(payload: {
    role: "notary";
    fullName: string;
    email: string;
    phone: string;
    commissionNumber: string;
    commissionExpiration: string;
    eoInsurance: string;
    certifications: string;
    coverageArea: string;
    message: string;
  }) {
    return post("/access-requests/notary", payload);
  },
};
