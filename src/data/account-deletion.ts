export interface AccountDeletionAppOption {
  name: string;
  developerName: string;
  identifier?: string;
}

export interface AccountDeletionPageConfig {
  seoTitle: string;
  seoDescription: string;
  supportEmail: string;
  privacyPolicyHref: string;
  applications: AccountDeletionAppOption[];
}

export const accountDeletionPageConfig: AccountDeletionPageConfig = {
  seoTitle: "Account Deletion Request",
  seoDescription: "Request deletion of your account and associated data from our applications using this public-facing account deletion request page.",
  supportEmail: "admin@closingengage.com",
  privacyPolicyHref: "/privacy-policy",
  applications: [
    {
      name: "Closing Engage",
      developerName: "Closing Engage",
      identifier: "com.closingengage.app",
    },
    {
      name: "Another App",
      developerName: "Your Company Name",
    },
    {
      name: "Future Applications",
      developerName: "Your Company Name",
    },
  ],
};
