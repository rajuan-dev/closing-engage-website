import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Plus, User, LogOut, CheckCircle2, Hourglass, CircleDot, FileText, Trash2, CheckCheck } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, SearchField, SidebarNav } from "@/components/common";
import { companyNav, notaryNav } from "@/data/mock-data";
import { notificationService } from "@/services/notificationService";
import { useStore } from "@/store/useStore";
import { toast } from "@/store/useToastStore";
import { portalAuthService } from "@/services/portalAuthService";

export function DashboardLayout({ variant }: { variant: "company" | "notary" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const items = variant === "company" ? companyNav : notaryNav;
  const {
    notaryProfile,
    companyProfile,
    notifications,
    setNotifications,
    upsertNotification,
    markNotificationRead,
    markAllNotificationsRead,
    removeNotification,
    clearNotifications,
    updateNotaryProfile,
    updateCompanyProfile,
  } = useStore();
  const [sessionUser, setSessionUser] = useState((portalAuthService.getUser(variant) as {
    name?: string;
    fullName?: string;
    email?: string;
    avatarUrl?: string;
    memberRole?: "Admin" | "Member";
    accountType?: string;
    contactPerson?: string;
  } | null) ?? null);
  const userName =
    sessionUser?.fullName ||
    sessionUser?.name ||
    sessionUser?.contactPerson ||
    (variant === "company" ? companyProfile.fullName : notaryProfile.fullName) ||
    "";
  const userEmail =
    sessionUser?.email ||
    (variant === "company" ? companyProfile.email : notaryProfile.email) ||
    "";
  const userAvatarUrl =
    sessionUser?.avatarUrl ||
    (variant === "company" ? companyProfile.avatarUrl : notaryProfile.avatarUrl) ||
    "";
  const userRole =
    variant === "company"
      ? sessionUser?.memberRole || (sessionUser?.accountType === "team-member" ? "Member" : "Administrator")
      : "Notary Partner";
  const userInitials = userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const notificationSocketRef = useRef<ReturnType<typeof notificationService.createSocket> | null>(null);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);

  const loadNotifications = useCallback(async (showErrorToast = true) => {
    try {
      const liveNotifications = await notificationService.getNotifications();
      setNotifications(liveNotifications);
    } catch (error) {
      if (showErrorToast) {
        toast.error(error instanceof Error ? error.message : "Unable to load notifications.");
      }
    }
  }, [setNotifications]);

  const handleMarkAllRead = async () => {
    try {
      setIsMarkingAllRead(true);
      await notificationService.markAllRead();
      markAllNotificationsRead();
      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update notifications.");
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      setIsClearingNotifications(true);
      await notificationService.clearAll();
      clearNotifications();
      toast.success("All notifications cleared.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to clear notifications.");
    } finally {
      setIsClearingNotifications(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      removeNotification(id);
      toast.success("Notification removed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove notification.");
    }
  };

  const handleNotificationClick = async (notification: typeof activityItems[number]) => {
    try {
      if (!notification.read) {
        await notificationService.markRead(notification.id);
        markNotificationRead(notification.id);
      }

      const normalizedLinkId = notification.linkId?.replace(/^#/, "").trim();
      if (!normalizedLinkId) {
        setNotifOpen(false);
        return;
      }

      if (notification.type === "order") {
        if (variant === "notary") {
          navigate(`/notary/orders/${normalizedLinkId}`);
        } else {
          navigate(`/company/orders/${normalizedLinkId}`);
        }
      }

      setNotifOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to open notification.");
    }
  };

  const activityItems = notifications.map((notification) => {
    let Icon = FileText;
    let tone: "brand" | "warning" | "success" = "brand";
    if (notification.type === "order") {
      Icon = CircleDot;
      tone = "brand";
    } else if (notification.type === "document") {
      Icon = Hourglass;
      tone = "warning";
    } else if (notification.type === "user") {
      Icon = CheckCircle2;
      tone = "success";
    }
    return {
      ...notification,
      key: notification.id,
      icon: Icon,
      tone,
    };
  });
  const unreadCount = activityItems.filter((act) => !act.read).length;
  const profilePath = variant === "company" ? "/company/settings" : "/notary/settings";

  useEffect(() => {
    setSessionUser(portalAuthService.getUser(variant) as typeof sessionUser);
  }, [location.pathname, variant]);

  useEffect(() => {
    const hydratePortalUser = async () => {
      try {
        const user = await portalAuthService.fetchMe(variant);
        const typedUser = user as {
          name?: string;
          fullName?: string;
          email?: string;
          avatarUrl?: string;
          phone?: string;
          companyName?: string;
          businessEmail?: string;
          contactEmail?: string;
          address?: string;
          license?: string;
          expiry?: string;
          serviceArea?: string;
          contactPerson?: string;
        } | null;

        setSessionUser(typedUser);

        if (variant === "company" && typedUser) {
          updateCompanyProfile({
            fullName: typedUser.fullName || typedUser.contactPerson || typedUser.name || "",
            email: typedUser.contactEmail || typedUser.email || typedUser.businessEmail || "",
            phone: typedUser.phone || "",
            companyName: typedUser.companyName || "",
            companyEmail: typedUser.businessEmail || typedUser.email || "",
            contactNumber: typedUser.phone || "",
            businessAddress: typedUser.address || "",
            avatarUrl: typedUser.avatarUrl || "",
          });
        }

        if (variant === "notary" && typedUser) {
          updateNotaryProfile({
            fullName: typedUser.fullName || typedUser.name || "",
            email: typedUser.email || "",
            phone: typedUser.phone || "",
            licenseNumber: typedUser.license || "",
            commissionExpiry: typedUser.expiry || "",
            serviceArea: typedUser.serviceArea || "",
            avatarUrl: typedUser.avatarUrl || "",
          });
        }
      } catch {
        setSessionUser(portalAuthService.getUser(variant) as typeof sessionUser);
      }
    };

    void hydratePortalUser();
  }, [
    updateCompanyProfile,
    updateNotaryProfile,
    variant,
  ]);

  useEffect(() => {
    void loadNotifications(false);
    const socket = notificationService.createSocket();
    notificationSocketRef.current = socket;

    socket?.on("notifications:new", (payload) => {
      upsertNotification(payload);
    });

    socket?.on("notifications:read", ({ id }) => {
      markNotificationRead(id);
    });

    socket?.on("notifications:read-all", () => {
      markAllNotificationsRead();
    });

    socket?.on("notifications:deleted", ({ id }) => {
      removeNotification(id);
    });

    socket?.on("notifications:cleared", () => {
      clearNotifications();
    });

    const handleFocus = () => {
      void loadNotifications(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadNotifications(false);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      socket?.disconnect();
      notificationSocketRef.current = null;
    };
  }, [clearNotifications, loadNotifications, markAllNotificationsRead, markNotificationRead, removeNotification, upsertNotification]);

  useEffect(() => {
    if (!notifOpen) return;
    void loadNotifications(false);
  }, [notifOpen, loadNotifications]);

  useEffect(() => {
    if (!menuOpen && !notifOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (!notifRef.current?.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen, notifOpen]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-[#f8f8fe]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] border-r border-[#e5ebf5] bg-white lg:flex lg:flex-col">
        <div className="border-b border-[#d9e7da] px-6 py-5">
          <img
            src="/branding/closing-engage-logo.svg"
            alt="Closing Engage"
            className="h-12 w-auto object-contain"
          />
        </div>
        <div className="flex-1 px-4 py-5">
          <SidebarNav items={items} />
        </div>
        {variant === "company" ? (
          <div className="px-5 pb-6">
            <Link to="/company/orders/new" className="block">
              <Button className="h-[48px] w-full rounded-[12px] text-[14px] font-semibold shadow-[0_14px_32px_rgba(24,90,188,0.18)]">
                <Plus className="mr-2 h-4 w-4" />
                Create New Order
              </Button>
            </Link>
          </div>
        ) : null}
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-[272px]">
        <header className="sticky top-0 z-20 border-b border-[#e5ebf5] bg-white/96 backdrop-blur">
          <div className="flex items-center justify-between gap-5 px-5 py-4 md:px-8">
            <div className="min-w-0 flex-1 max-w-[880px]">
              <SearchField />
            </div>
            <div className="flex shrink-0 items-center gap-5 border-l border-[#e5ebf5] pl-5">
              <div ref={notifRef} className="relative">
                <button 
                  onClick={() => setNotifOpen((open) => !open)}
                  className={`relative rounded-lg p-2 transition focus:outline-none ${
                    unreadCount > 0
                      ? "text-danger-500 hover:bg-[#fff1f1]"
                      : "text-ink-600 hover:bg-[#f8fafe]"
                  }`}
                  aria-label="Open notifications"
                >
                  <Bell className="h-[18px] w-[18px]" />
                  {unreadCount > 0 && !notifOpen ? (
                    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-danger-200 bg-white px-1 text-[10px] font-bold leading-none text-danger-600 shadow-sm">
                      {unreadCount}
                    </span>
                  ) : null}
                </button>

                {notifOpen ? (
                  <div className="absolute right-0 top-full z-50 mt-3 w-[min(420px,calc(100vw-24px))] overflow-hidden rounded-[24px] border border-[#dfe7f4] bg-white shadow-[0_28px_70px_rgba(15,23,42,0.16)] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="border-b border-[#edf1f7] bg-[linear-gradient(180deg,#fbfdff_0%,#f6f9ff_100%)] px-5 py-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-[18px] font-bold tracking-tight text-ink-900">Notifications</h3>
                          <p className="mt-1 text-[12px] font-medium text-ink-400">
                            {unreadCount > 0
                              ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
                              : "All notifications are up to date"}
                          </p>
                        </div>
                        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap">
                          <button
                            type="button"
                            onClick={() => void handleMarkAllRead()}
                            disabled={unreadCount === 0 || isMarkingAllRead}
                            className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-[12px] border border-[#dbe5f3] bg-white px-3 py-2 text-[12px] font-semibold text-brand-600 transition hover:border-brand-200 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-45 sm:h-9 sm:flex-none"
                          >
                            <CheckCheck className="h-3.5 w-3.5 shrink-0" />
                            {isMarkingAllRead ? "Updating..." : "Mark All Read"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleClearAllNotifications()}
                            disabled={activityItems.length === 0 || isClearingNotifications}
                            className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-[12px] border border-[#f2d7d5] bg-[#fff7f7] px-3 py-2 text-[12px] font-semibold text-danger-600 transition hover:bg-[#fff1f1] disabled:cursor-not-allowed disabled:opacity-45 sm:h-9 sm:flex-none"
                          >
                            <Trash2 className="h-3.5 w-3.5 shrink-0" />
                            {isClearingNotifications ? "Clearing..." : "Clear All"}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="max-h-[420px] overflow-y-auto bg-[#fcfdff] px-3 py-3">
                      {activityItems.length === 0 ? (
                        <div className="px-5 py-10 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#edf9f2] text-[#38b36b] shadow-[0_10px_24px_rgba(56,179,107,0.12)]">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div className="mt-4 text-[15px] font-bold text-ink-900">All caught up</div>
                          <p className="mt-1 text-[12px] leading-5 text-ink-400">There are no new notifications or activities to display.</p>
                        </div>
                      ) : (
                        activityItems.map((act) => (
                          <div
                            key={act.key}
                            className={`group mb-3 rounded-[20px] border px-4 py-4 shadow-[0_14px_34px_rgba(20,48,112,0.05)] transition ${
                              !act.read
                                ? "border-brand-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] hover:border-brand-200"
                                : "border-[#ebf0f7] bg-white hover:border-[#dfe7f4] hover:shadow-[0_16px_38px_rgba(20,48,112,0.07)]"
                            }`}
                          >
                            <div className="flex items-start gap-3.5">
                              <button
                                type="button"
                                onClick={() => {
                                  void handleNotificationClick(act);
                                }}
                                className="flex min-w-0 flex-1 items-start gap-3.5 rounded-[16px] text-left focus:outline-none"
                              >
                                <div
                                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border ${
                                    act.tone === "warning"
                                      ? "border-[#ffe3bf] bg-[#fff4e8] text-[#f08e24]"
                                      : act.tone === "success"
                                        ? "border-[#d7f3e3] bg-[#edf9f2] text-[#38b36b]"
                                        : "border-[#d9e5ff] bg-[#eef4ff] text-brand-600"
                                  }`}
                                >
                                  <act.icon className="h-[18px] w-[18px]" />
                                </div>
                                <div className="min-w-0 flex-1 pt-0.5">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="text-[14px] font-bold leading-5 text-ink-900">{act.title}</div>
                                      <div className="mt-1 text-[12px] font-medium tracking-[0.01em] text-ink-500">{act.message}</div>
                                    </div>
                                    {!act.read ? (
                                      <span className="shrink-0 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-danger-600">
                                        New
                                      </span>
                                    ) : null}
                                  </div>
                                  <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-ink-300">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#d4ddea]" />
                                    {act.time}
                                  </div>
                                </div>
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDeleteNotification(act.id)}
                                className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border border-transparent text-ink-300 opacity-0 transition hover:border-[#f4d8d8] hover:bg-[#fff6f6] hover:text-danger-600 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
                                aria-label={`Delete ${act.title}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="border-t border-[#edf1f7] bg-white px-5 py-3 text-[11px] font-medium text-ink-300">
                      Notifications update in real time for your current portal session.
                    </div>
                  </div>
                ) : null}
              </div>
              <div ref={menuRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors hover:bg-[#f6f8fd]"
              >
                <div className="text-right w-[140px] hidden md:block truncate">
                  <div className="text-sm font-extrabold text-ink-900 truncate">{userName}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">{userRole}</div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#18253f,#68506a)] text-xs font-bold text-white">
                  {userAvatarUrl ? (
                    <img src={userAvatarUrl} alt={`${userName} avatar`} className="h-full w-full object-cover" />
                  ) : (
                    userInitials
                  )}
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-ink-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen ? (
                <div className="absolute right-0 top-full z-50 mt-2 w-[220px] overflow-hidden rounded-2xl border border-[#e2e8f3] bg-white py-2 shadow-[0_20px_60px_rgba(15,23,42,0.15)] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="border-b border-[#edf1f7] bg-[#fbfcff] px-4 py-3">
                    <p className="truncate text-[13px] font-bold text-ink-900">{userName}</p>
                    <p className="truncate text-[11px] font-medium text-ink-400">{userEmail}</p>
                  </div>
                  <div className="space-y-0.5 px-1.5 py-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate(profilePath);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-semibold text-ink-700 transition hover:bg-[#f6f8fd] focus:outline-none"
                    >
                      <User className="h-[15px] w-[15px] text-ink-400" />
                      My Profile
                    </button>
                  </div>
                  <div className="border-t border-[#edf1f7] px-1.5 pb-0.5 pt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        portalAuthService.clearSession(variant);
                        setMenuOpen(false);
                        navigate("/login", { replace: true });
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-semibold text-danger-600 transition hover:bg-[#fff5f5] focus:outline-none"
                    >
                      <LogOut className="h-[15px] w-[15px] text-danger-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : null}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-8">
          <div className="mx-auto max-w-[1520px]">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}
