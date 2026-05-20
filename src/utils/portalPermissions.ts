import { portalAuthService } from "@/services/portalAuthService";

type PermissionKey = "createOrders" | "viewOrders" | "downloadDocuments";

type PermissionedUser = {
  accountType?: string;
  permissions?: Record<PermissionKey, boolean>;
};

export const hasPortalPermission = (permission: PermissionKey): boolean => {
  const user = portalAuthService.getUser("company") as PermissionedUser | null;

  if (!user?.permissions) return true;
  return user.permissions[permission] !== false;
};
