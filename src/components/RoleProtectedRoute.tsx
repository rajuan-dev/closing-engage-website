import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { portalAuthService } from "@/services/portalAuthService";

export function RoleProtectedRoute({ role }: { role: "company" | "notary" }) {
  const location = useLocation();
  const token = portalAuthService.getToken();
  const currentRole = portalAuthService.getRole();
  const [isCheckingSession, setIsCheckingSession] = useState(Boolean(token && currentRole === role));
  const [isSessionValid, setIsSessionValid] = useState(false);

  useEffect(() => {
    let mounted = true;

    const verifySession = async () => {
      if (!token || currentRole !== role) {
        setIsCheckingSession(false);
        setIsSessionValid(false);
        return;
      }

      try {
        await portalAuthService.fetchMe(role);
        if (!mounted) return;
        setIsSessionValid(true);
      } catch {
        portalAuthService.clearSession();
        if (!mounted) return;
        setIsSessionValid(false);
      } finally {
        if (mounted) setIsCheckingSession(false);
      }
    };

    void verifySession();

    return () => {
      mounted = false;
    };
  }, [currentRole, role, token]);

  if (!token || !currentRole) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (currentRole !== role) {
    return <Navigate to={currentRole === "company" ? "/company/dashboard" : "/notary/dashboard"} replace />;
  }

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8fe]">
        <div className="flex items-center gap-3 rounded-2xl border border-[#e5ebf5] bg-white px-5 py-4 text-[14px] font-semibold text-ink-500 shadow-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#c7d2e5] border-t-brand-600" />
          Verifying account access...
        </div>
      </div>
    );
  }

  if (!isSessionValid) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
