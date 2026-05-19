import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, FileText, UserRound } from "lucide-react";
import { Button, FooterBand, Input, Surface } from "@/components/common";
import { portalAuthService } from "@/services/portalAuthService";
import { useStore } from "@/store/useStore";
import { toast } from "@/store/useToastStore";

interface NotarySessionUser {
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  license?: string;
  expiry?: string;
  serviceArea?: string;
  specialty?: string;
}

const mapSessionToProfile = (user: unknown) => {
  const notary = user as NotarySessionUser | null;
  if (!notary) return null;

  return {
    fullName: notary.fullName || notary.name || "",
    email: notary.email || "",
    phone: notary.phone || "",
    licenseNumber: notary.license || "",
    commissionExpiry: notary.expiry || "",
    serviceArea: notary.serviceArea || "",
  };
};

export function NotarySettingsPage() {
  const { notaryProfile, updateNotaryProfile, addActivity } = useStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  // Profile Draft States
  const [fullName, setFullName] = useState(notaryProfile.fullName);
  const [email, setEmail] = useState(notaryProfile.email);
  const [phone, setPhone] = useState(notaryProfile.phone);
  
  const [licenseNumber, setLicenseNumber] = useState(notaryProfile.licenseNumber);
  const [commissionExpiry, setCommissionExpiry] = useState(notaryProfile.commissionExpiry);
  const [serviceArea, setServiceArea] = useState(notaryProfile.serviceArea);
  const [avatarUrl, setAvatarUrl] = useState(notaryProfile.avatarUrl || "");

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState([
    { id: "email", label: "Email Notifications", body: "Receive global summary emails", active: notaryProfile.notifications.email },
    { id: "orders", label: "Order Updates", body: "Real-time alerts for escrow changes", active: notaryProfile.notifications.orders },
    { id: "documents", label: "Document Updates", body: "Alerts when new documents are signed", active: notaryProfile.notifications.documents },
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state if store updates or edit mode is toggled (revert)
  useEffect(() => {
    setFullName(notaryProfile.fullName);
    setEmail(notaryProfile.email);
    setPhone(notaryProfile.phone);
    setLicenseNumber(notaryProfile.licenseNumber);
    setCommissionExpiry(notaryProfile.commissionExpiry);
    setServiceArea(notaryProfile.serviceArea);
    setAvatarUrl(notaryProfile.avatarUrl || "");
    setNotifications([
      { id: "email", label: "Email Notifications", body: "Receive global summary emails", active: notaryProfile.notifications.email },
      { id: "orders", label: "Order Updates", body: "Real-time alerts for escrow changes", active: notaryProfile.notifications.orders },
      { id: "documents", label: "Document Updates", body: "Alerts when new documents are signed", active: notaryProfile.notifications.documents },
    ]);
  }, [notaryProfile, isEditMode]);

  useEffect(() => {
    const hydrateProfile = async () => {
      try {
        const cachedUser = portalAuthService.getUser();
        const cachedProfile = mapSessionToProfile(cachedUser);
        if (cachedProfile) {
          updateNotaryProfile(cachedProfile);
        }

        const user = await portalAuthService.fetchMe("notary");
        const profile = mapSessionToProfile(user);
        if (profile) {
          updateNotaryProfile(profile);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load notary profile.");
      }
    };

    void hydrateProfile();
  }, [updateNotaryProfile]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      if (!isEditMode) {
        updateNotaryProfile({ avatarUrl: url });
        addActivity({
          title: "Avatar Updated",
          description: "You successfully updated your profile picture.",
          time: "Just Now",
        });
        toast.success("Profile avatar updated successfully!");
      }
    }
  };

  const toggleNotification = (id: string) => {
    if (!isEditMode) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, active: !n.active } : n))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const user = await portalAuthService.updateNotaryProfile({
        fullName,
        email,
        phone,
        license: licenseNumber,
        expiry: commissionExpiry,
        serviceArea,
      });

      const profile = mapSessionToProfile(user);
      updateNotaryProfile({
        ...(profile || {
          fullName,
          email,
          phone,
          licenseNumber,
          commissionExpiry,
          serviceArea,
        }),
        avatarUrl,
        notifications: {
          email: notifications.find((n) => n.id === "email")?.active ?? true,
          orders: notifications.find((n) => n.id === "orders")?.active ?? true,
          documents: notifications.find((n) => n.id === "documents")?.active ?? false,
        },
      });

      addActivity({
        title: "Profile Updated",
        description: "You successfully updated your notary profile settings.",
        time: "Just Now",
      });

      toast.success("Profile settings saved successfully!");
      setIsEditMode(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save notary settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsPasswordSaving(true);
    try {
      await portalAuthService.updateNotaryPassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm,
      });

      addActivity({
        title: "Password Updated",
        description: "Your security credentials have been updated.",
        time: "Just Now",
      });

      toast.success("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update password.");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-start gap-6">
        <div className="relative flex h-[92px] w-[92px] items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#101622,#2a3449)] text-white shadow-[0_18px_38px_rgba(20,48,112,0.14)] overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[28px] font-bold">
              {fullName.split(" ").map((n) => n[0]).join("")}
            </span>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white shadow-[0_5px_12px_rgba(24,90,188,0.3)] hover:bg-brand-700 transition-colors"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-[26px] font-bold tracking-tight text-ink-900">
              {fullName}
            </h1>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#d9f8e7] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#138e59]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified Notary
            </div>
          </div>
          <div className="mt-3 text-[16px] text-ink-500">{email}</div>
          <Button
            variant={isEditMode ? "ghost" : "outline"}
            className={`mt-4 h-[44px] rounded-[12px] px-5 text-[14px] font-semibold ${isEditMode ? "text-danger-600 hover:bg-[#fff5f5]" : "border-[#dfe6f2] text-brand-600"}`}
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? "Discard Changes" : "Edit Profile"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.48fr]">
        <div className="space-y-6">
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-5 flex items-center gap-2.5">
              <UserRound className="h-4.5 w-4.5 text-brand-600" />
              <div className="text-[17px] font-bold tracking-tight text-ink-900">Personal Information</div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Input 
                label="FULL NAME" 
                disabled={!isEditMode}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="PHONE NUMBER" 
                disabled={!isEditMode}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="EMAIL ADDRESS" 
                disabled={!isEditMode}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] md:col-span-2 ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
            </div>
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-6 flex items-center gap-3">
              <FileText className="h-5 w-5 text-brand-600" />
              <div className="text-[17px] font-bold tracking-tight text-ink-900">Professional Details</div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Input 
                label="LICENSE NUMBER" 
                disabled={!isEditMode}
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="COMMISSION EXPIRY" 
                disabled={!isEditMode}
                value={commissionExpiry}
                onChange={(e) => setCommissionExpiry(e.target.value)}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="SERVICE AREA" 
                disabled={!isEditMode}
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] md:col-span-2 ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
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
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="NEW PASSWORD" 
                placeholder="••••••••" 
                type="password" 
                disabled={!isEditMode || isPasswordSaving}
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="CONFIRM NEW PASSWORD" 
                placeholder="••••••••" 
                type="password" 
                disabled={!isEditMode || isPasswordSaving}
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
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
                    disabled={!isEditMode}
                    onClick={() => toggleNotification(n.id)}
                    className={`flex h-7 w-12 shrink-0 rounded-full p-1 transition-colors ${n.active ? "bg-brand-600" : "bg-[#dbe2ec]"} ${!isEditMode ? "cursor-not-allowed opacity-60" : ""}`}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${n.active ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 rounded-[18px] border border-[#e4ebf5] bg-white p-5 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <Button
          variant="outline"
          className="h-[46px] rounded-[12px] border-[#dfe6f2] px-6 text-[15px] font-semibold text-ink-700"
          onClick={() => {
            setIsEditMode(false);
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={!isEditMode || isSaving}
          className="h-[46px] rounded-[12px] px-8 text-[15px] font-semibold disabled:opacity-50"
          onClick={handleSave}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      <FooterBand />
    </div>
  );
}
