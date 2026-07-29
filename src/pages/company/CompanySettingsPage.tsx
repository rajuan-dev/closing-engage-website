import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Button, Input, Surface } from "@/components/common";
import { portalAuthService } from "@/services/portalAuthService";
import { useStore } from "@/store/useStore";
import { toast } from "@/store/useToastStore";
import { prepareAvatarDataUrl } from "@/utils/avatarImage";

interface CompanySessionUser {
  contactPerson?: string;
  businessEmail?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  contactEmail?: string;
  address?: string;
  avatarUrl?: string;
  notifications?: {
    email: boolean;
    orders: boolean;
    documents: boolean;
  };
}

const mapSessionToProfile = (user: unknown) => {
  const company = user as CompanySessionUser | null;
  if (!company) return null;

  return {
    fullName: company.contactPerson || "",
    email: company.contactEmail || company.email || company.businessEmail || "",
    phone: company.phone || "",
    companyName: company.companyName || "",
    companyEmail: company.businessEmail || company.email || "",
    contactNumber: company.phone || "",
    businessAddress: company.address || "",
    avatarUrl: company.avatarUrl || "",
    notifications: company.notifications || { email: true, orders: true, documents: false },
  };
};

export function CompanySettingsPage() {
  const { companyProfile, updateCompanyProfile } = useStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    fullName: companyProfile.fullName,
    email: companyProfile.email,
    phone: companyProfile.phone,
  });

  const [companyInfo, setCompanyInfo] = useState({
    companyName: companyProfile.companyName,
    companyEmail: companyProfile.companyEmail,
    contactNumber: companyProfile.contactNumber,
    businessAddress: companyProfile.businessAddress,
  });
  const [avatarUrl, setAvatarUrl] = useState(companyProfile.avatarUrl || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notifications, setNotifications] = useState([
    { id: "email", label: "Email Notifications", body: "Receive global summary emails", active: companyProfile.notifications?.email ?? true },
    { id: "orders", label: "Order Updates", body: "Real-time alerts for escrow changes", active: companyProfile.notifications?.orders ?? true },
    { id: "documents", label: "Document Updates", body: "Alerts when new documents are signed", active: companyProfile.notifications?.documents ?? false },
  ]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setPersonalInfo({
      fullName: companyProfile.fullName,
      email: companyProfile.email,
      phone: companyProfile.phone,
    });
    setCompanyInfo({
      companyName: companyProfile.companyName,
      companyEmail: companyProfile.companyEmail,
      contactNumber: companyProfile.contactNumber,
      businessAddress: companyProfile.businessAddress,
    });
    setAvatarUrl(companyProfile.avatarUrl || "");
    setNotifications([
      { id: "email", label: "Email Notifications", body: "Receive global summary emails", active: companyProfile.notifications?.email ?? true },
      { id: "orders", label: "Order Updates", body: "Real-time alerts for escrow changes", active: companyProfile.notifications?.orders ?? true },
      { id: "documents", label: "Document Updates", body: "Alerts when new documents are signed", active: companyProfile.notifications?.documents ?? false },
    ]);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    resetForm();
  }, [companyProfile, isEditMode]);

  useEffect(() => {
    const hydrateProfile = async () => {
      try {
        const cachedUser = portalAuthService.getUser();
        const cachedProfile = mapSessionToProfile(cachedUser);
        if (cachedProfile) {
          updateCompanyProfile(cachedProfile);
        }

        const user = await portalAuthService.fetchMe("company");
        const profile = mapSessionToProfile(user);
        if (profile) {
          updateCompanyProfile(profile);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load company profile.");
      }
    };

    void hydrateProfile();
  }, [updateCompanyProfile]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!isEditMode) {
      toast.error("Click Edit Profile before updating your profile photo.");
      return;
    }

    try {
      const nextAvatarUrl = await prepareAvatarDataUrl(file);
      setAvatarUrl(nextAvatarUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to process the selected image.");
    }
  };

  const toggleNotification = (id: string) => {
    if (isSavingNotifications || isSaving) return;

    const nextNotifications = notifications.map((n) =>
      n.id === id ? { ...n, active: !n.active } : n,
    );

    const previousNotifications = notifications;
    setNotifications(nextNotifications);

    const updatedNotifications = {
      email: nextNotifications.find((n) => n.id === "email")?.active ?? true,
      orders: nextNotifications.find((n) => n.id === "orders")?.active ?? true,
      documents: nextNotifications.find((n) => n.id === "documents")?.active ?? false,
    };

    void (async () => {
      try {
        setIsSavingNotifications(true);
        const user = await portalAuthService.updateCompanyProfile({
          notifications: updatedNotifications,
        });

        const profile = mapSessionToProfile(user);
        updateCompanyProfile({
          ...(profile || companyProfile),
          notifications: updatedNotifications,
        });
        toast.success("Notification preferences updated.");
      } catch (error) {
        setNotifications(previousNotifications);
        toast.error(error instanceof Error ? error.message : "Unable to update notification preferences.");
      } finally {
        setIsSavingNotifications(false);
      }
    })();
  };

  const handleSaveSettings = async () => {
    const selectedPhone =
      companyInfo.contactNumber !== companyProfile.contactNumber
        ? companyInfo.contactNumber
        : personalInfo.phone;

    const updatedNotifications = {
      email: notifications.find((n) => n.id === "email")?.active ?? true,
      orders: notifications.find((n) => n.id === "orders")?.active ?? true,
      documents: notifications.find((n) => n.id === "documents")?.active ?? false,
    };

    setIsSaving(true);
    try {
      const user = await portalAuthService.updateCompanyProfile({
        contactPerson: personalInfo.fullName,
        contactEmail: personalInfo.email,
        phone: selectedPhone,
        companyName: companyInfo.companyName,
        businessEmail: companyInfo.companyEmail,
        address: companyInfo.businessAddress,
        avatarUrl,
        notifications: updatedNotifications,
      });

      const profile = mapSessionToProfile(user);
      updateCompanyProfile({
        ...(profile || {
          fullName: personalInfo.fullName,
          email: personalInfo.email,
          phone: selectedPhone,
          companyName: companyInfo.companyName,
          companyEmail: companyInfo.companyEmail,
          contactNumber: selectedPhone,
          businessAddress: companyInfo.businessAddress,
          avatarUrl,
        }),
        avatarUrl: (profile as { avatarUrl?: string } | null)?.avatarUrl || avatarUrl,
        notifications: updatedNotifications,
      });
      toast.success("Company settings saved successfully!");
      setIsEditMode(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save company settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsPasswordSaving(true);
    try {
      await portalAuthService.updateCompanyPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update password.");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-7">
      <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="relative flex h-[76px] w-[76px] items-center justify-center overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#17263e,#7a5361)] text-xl font-bold text-white shadow-[0_14px_30px_rgba(20,48,112,0.12)]">
              {avatarUrl ? (
                <img src={avatarUrl} alt={`${personalInfo.fullName} avatar`} className="h-full w-full object-cover" />
              ) : (
                personalInfo.fullName.split(" ").map((n) => n[0]).join("")
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                onClick={() => {
                  if (!isEditMode) {
                    toast.error("Click Edit Profile before updating your profile photo.");
                    return;
                  }

                  fileInputRef.current?.click();
                }}
                className={`absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full text-white shadow-[0_5px_12px_rgba(24,90,188,0.3)] transition-colors ${
                  isEditMode ? "bg-brand-600 hover:bg-brand-700" : "cursor-not-allowed bg-[#9eb8e8]"
                }`}
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/12" />
            </div>
            <div>
              <div className="text-[20px] font-bold tracking-tight text-ink-900">{personalInfo.fullName}</div>
              <div className="mt-1.5 text-[13px] text-ink-500">{personalInfo.email}</div>
              <div className="mt-1 text-[15px] text-ink-500">{companyInfo.companyName}</div>
            </div>
          </div>
          <Button
            variant={isEditMode ? "ghost" : "outline"}
            className={`h-[44px] rounded-[12px] px-5 text-[14px] font-semibold ${isEditMode ? "text-danger-600 hover:bg-[#fff5f5]" : "border-[#dfe6f2] text-brand-600"}`}
            onClick={() => {
              if (isEditMode) {
                resetForm();
              }
              setIsEditMode(!isEditMode);
            }}
          >
            {isEditMode ? "Discard Changes" : "Edit Profile"}
          </Button>
        </div>
      </Surface>

      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.56fr]">
        <div className="space-y-6">
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30_rgba(20,48,112,0.05)]">
            <div className="text-[17px] font-bold tracking-tight text-ink-900">Personal Information</div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Input 
                label="FULL NAME" 
                disabled={!isEditMode}
                value={personalInfo.fullName} 
                onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="EMAIL ADDRESS" 
                disabled={!isEditMode}
                value={personalInfo.email} 
                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="PHONE NUMBER" 
                disabled={!isEditMode}
                value={personalInfo.phone} 
                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] md:col-span-2 ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
            </div>
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[17px] font-bold tracking-tight text-ink-900">Company Information</div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Input 
                label="COMPANY NAME" 
                disabled={!isEditMode}
                value={companyInfo.companyName} 
                onChange={(e) => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="COMPANY EMAIL" 
                disabled={!isEditMode}
                value={companyInfo.companyEmail} 
                onChange={(e) => setCompanyInfo({ ...companyInfo, companyEmail: e.target.value })}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="CONTACT NUMBER" 
                disabled={!isEditMode}
                value={companyInfo.contactNumber} 
                onChange={(e) => setCompanyInfo({ ...companyInfo, contactNumber: e.target.value })}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="BUSINESS ADDRESS" 
                disabled={!isEditMode}
                value={companyInfo.businessAddress} 
                onChange={(e) => setCompanyInfo({ ...companyInfo, businessAddress: e.target.value })}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
            </div>
          </Surface>
        </div>

        <div className="space-y-6">
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[17px] font-bold tracking-tight text-ink-900">Security Settings</div>
            <div className="mt-6 space-y-5">
              <Input 
                label="CURRENT PASSWORD" 
                placeholder="••••••••" 
                type="password" 
                disabled={!isEditMode || isPasswordSaving}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="NEW PASSWORD" 
                placeholder="••••••••" 
                type="password" 
                disabled={!isEditMode || isPasswordSaving}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="CONFIRM NEW PASSWORD" 
                placeholder="••••••••" 
                type="password" 
                disabled={!isEditMode || isPasswordSaving}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Button
                variant="outline"
                disabled={!isEditMode || isPasswordSaving}
                className="h-[44px] w-full rounded-[12px] border-[#dfe6f2] text-[14px] font-semibold text-brand-600 disabled:opacity-50"
                onClick={handleUpdatePassword}
              >
                {isPasswordSaving ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[17px] font-bold tracking-tight text-ink-900">Notification Preferences</div>
            <div className="mt-6 space-y-6">
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[15px] font-semibold text-ink-900">{n.label}</div>
                      <div className="mt-1 text-[13px] leading-[1.6] text-ink-500">{n.body}</div>
                    </div>
                    <button
                      type="button"
                      disabled={isSavingNotifications || isSaving}
                      onClick={() => toggleNotification(n.id)}
                      className={`flex h-7 w-12 shrink-0 rounded-full p-1 transition-colors ${n.active ? "bg-brand-600" : "bg-[#dbe2ec]"} ${isSavingNotifications || isSaving ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <div className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${n.active ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
              ))}
            </div>
          </Surface>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-[#e7ecf4] pt-7">
        <Button
          variant="outline"
          className="h-[46px] rounded-[12px] border-[#dfe6f2] px-6 text-[15px] font-semibold text-ink-700"
          onClick={() => {
             setIsEditMode(false);
             resetForm();
          }}
        >
          Cancel
        </Button>
        <Button 
          disabled={!isEditMode || isSaving}
          className="h-[46px] rounded-[12px] px-8 text-[15px] font-semibold disabled:opacity-50" 
          onClick={handleSaveSettings}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
