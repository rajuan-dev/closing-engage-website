import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Plus, User, LogOut, CheckCircle2, Hourglass, CircleDot, FileText } from "lucide-react";
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
    markNotificationRead,
    markAllNotificationsRead,
  } = useStore();
  const sessionUser = portalAuthService.getUser(variant) as {
    name?: string;
    fullName?: string;
    email?: string;
    memberRole?: "Admin" | "Member";
    accountType?: string;
  } | null;
  const userName = sessionUser?.fullName || sessionUser?.name || (variant === "company" ? companyProfile.fullName : notaryProfile.fullName);
  const userEmail = sessionUser?.email || (variant === "company" ? companyProfile.email : notaryProfile.email);
  const userRole =
    variant === "company"
      ? sessionUser?.memberRole || (sessionUser?.accountType === "team-member" ? "Member" : "Administrator")
      : "Notary Partner";
  const userInitials = userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

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
    void loadNotifications(false);

    const intervalId = window.setInterval(() => {
      void loadNotifications(false);
    }, 5000);

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
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadNotifications]);

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
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-danger-200 bg-white px-1 text-[10px] font-bold leading-none text-danger-600 shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen ? (
                  <div className="absolute right-0 top-full z-50 mt-2 w-[380px] overflow-hidden rounded-2xl border border-[#e2e8f3] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.15)] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between border-b border-[#edf1f7] px-5 py-4">
                      <h3 className="text-[15px] font-semibold text-ink-900">Notifications</h3>
                      {unreadCount > 0 ? (
                        <button
                          type="button"
                          onClick={() => void handleMarkAllRead()}
                          className="text-[12px] font-semibold text-brand-600 transition hover:text-brand-700 focus:outline-none"
                        >
                          Mark all read
                        </button>
                      ) : null}
                    </div>
                    <div className="max-h-[360px] overflow-y-auto divide-y divide-[#f2f5fa]">
                      {activityItems.length === 0 ? (
                        <div className="px-5 py-8 text-center">
                          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#edf9f2] text-[#38b36b]">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div className="mt-3 text-[14px] font-bold text-ink-900">All caught up</div>
                          <p className="mt-1 text-[12px] leading-5 text-ink-400">There are no new notifications or activities to display.</p>
                        </div>
                      ) : (
                        activityItems.map((act) => (
                          <button
                            key={act.key}
                            type="button"
                            onClick={() => {
                              if (!act.read) {
                                void notificationService.markRead(act.id).then(() => {
                                  markNotificationRead(act.id);
                                }).catch((error) => {
                                  toast.error(error instanceof Error ? error.message : "Unable to update notification.");
                                });
                              }
                            }}
                            className={`flex w-full items-start gap-3 px-5 py-3.5 text-left transition hover:bg-[#f8fafd] focus:outline-none ${
                              !act.read ? "bg-[#f5f9ff]/50" : ""
                            }`}
                          >
                            <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${!act.read ? "bg-brand-600" : "bg-transparent"}`} />
                            <div
                              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                act.tone === "warning"
                                  ? "bg-[#fff7ea] text-[#f0a11d]"
                                  : act.tone === "success"
                                    ? "bg-[#edf9f2] text-[#38b36b]"
                                    : "bg-[#eef4ff] text-brand-600"
                              }`}
                            >
                              <act.icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[13px] font-semibold text-ink-900">{act.title}</div>
                              <div className="mt-0.5 text-[12px] leading-5 text-ink-500">{act.message}</div>
                              <div className="mt-1 text-[11px] font-medium text-ink-300">{act.time}</div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                    {activityItems.length > 0 ? (
                      <div className="border-t border-[#edf1f7] bg-[#fbfcff] px-5 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => void handleMarkAllRead()}
                          disabled={isMarkingAllRead}
                          className="w-full text-[13px] font-semibold text-brand-600 transition hover:text-brand-700 disabled:opacity-50 focus:outline-none"
                        >
                          {isMarkingAllRead ? "Updating..." : "Mark All Read"}
                        </button>
                      </div>
                    ) : null}
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
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#18253f,#68506a)] text-xs font-bold text-white">
                  {userInitials}
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
