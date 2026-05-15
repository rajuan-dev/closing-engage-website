import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  AboutPage,
  ContactPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  OtpVerificationPage,
  PrivacyPolicyPage,
  RoleSelectionPage,
  ServicesPage,
  SignupPage,
} from "@/pages/public";
import {
  CompanyDashboardPage,
  CompanyDocumentsDetailPage,
  CompanyDocumentsPage,
  CompanyOrderDetailsPage,
  CompanyOrdersNewPage,
  CompanyOrdersPage,
  CompanySettingsPage,
  CompanyTeamNewPage,
  CompanyTeamPage,
} from "@/pages/company";
import {
  NotaryCommunicationsPage,
  NotaryCredentialsPage,
  NotaryDashboardPage,
  NotaryOrderDetailPage,
  NotaryOrdersPage,
  NotarySettingsPage,
  NotaryUploadDocumentsPage,
} from "@/pages/notary";

import { ToastContainer } from "@/components/ToastContainer";
import { GlobalConfirmModal } from "@/components/GlobalConfirmModal";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email-otp" element={<OtpVerificationPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/role-selection" element={<RoleSelectionPage />} />

        <Route element={<DashboardLayout variant="company" />}>
          <Route path="/company/dashboard" element={<CompanyDashboardPage />} />
          <Route path="/company/orders" element={<CompanyOrdersPage />} />
          <Route path="/company/orders/new" element={<CompanyOrdersNewPage />} />
          <Route path="/company/orders/:id" element={<CompanyOrderDetailsPage />} />
          <Route path="/company/documents" element={<CompanyDocumentsPage />} />
          <Route path="/company/documents/:id" element={<CompanyDocumentsDetailPage />} />
          <Route path="/company/team" element={<CompanyTeamPage />} />
          <Route path="/company/team/new" element={<CompanyTeamNewPage />} />
          <Route path="/company/settings" element={<CompanySettingsPage />} />
        </Route>

        <Route element={<DashboardLayout variant="notary" />}>
          <Route path="/notary/dashboard" element={<NotaryDashboardPage />} />
          <Route path="/notary/orders" element={<NotaryOrdersPage />} />
          <Route path="/notary/orders/:id" element={<NotaryOrderDetailPage />} />
          <Route path="/notary/upload-documents" element={<NotaryUploadDocumentsPage />} />
          <Route path="/notary/settings" element={<NotarySettingsPage />} />
          <Route path="/notary/credentials" element={<NotaryCredentialsPage />} />
          <Route path="/notary/communications" element={<NotaryCommunicationsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
      <GlobalConfirmModal />
    </>
  );
}
