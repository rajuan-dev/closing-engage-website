import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Plus, Repeat2, X, CheckCircle2, Hourglass, CircleDot, FileText } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button, SearchField, SidebarNav } from "@/components/common";
import { companyNav, notaryNav } from "@/data/mock-data";
import { themeTokens } from "@/theme/tokens";
import { useStore } from "@/store/useStore";
import { toast } from "@/store/useToastStore";

export function DashboardLayout({ variant }: { variant: "company" | "notary" }) {
  const location = useLocation();
  const items = variant === "company" ? companyNav : notaryNav;
  const profile = themeTokens[variant];
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const switchTarget = variant === "company"
    ? { href: "/notary/dashboard", label: "Switch to Notary Dashboard", helper: "Open your notary workspace" }
    : { href: "/company/dashboard", label: "Switch to Title Company Dashboard", helper: "Open your company workspace" };

  const { recentActivities, clearActivities } = useStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClear = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearActivities();
      setIsClearing(false);
      toast.success("Notifications cleared successfully!");
    }, 500);
  };

  const activityItems = recentActivities.map((act) => {
    let Icon = FileText;
    let tone: "brand" | "warning" | "success" = "brand";
    if (act.title.toLowerCase().includes("assign")) {
      Icon = CircleDot;
      tone = "brand";
    } else if (act.title.toLowerCase().includes("status") || act.title.toLowerCase().includes("review")) {
      Icon = Hourglass;
      tone = "warning";
    } else if (act.title.toLowerCase().includes("approve") || act.title.toLowerCase().includes("complete")) {
      Icon = CheckCircle2;
      tone = "success";
    }
    return {
      ...act,
      icon: Icon,
      tone,
    };
  });

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

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
              <button 
                onClick={() => setIsNotificationsOpen(true)}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#e5ebf5] bg-white text-ink-500 hover:bg-[#f8fafe] transition-colors"
              >
                <Bell className="h-4 w-4" />
                {recentActivities.length > 0 && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-danger-500"></span>
                  </span>
                )}
              </button>
              <div ref={menuRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors hover:bg-[#f6f8fd]"
              >
                <div className="text-right">
                  <div className="text-sm font-extrabold text-ink-900">{profile.name}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">{profile.label}</div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#18253f,#68506a)] text-xs font-bold text-white">
                  AS
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-ink-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen ? (
                <div className="absolute right-0 top-[calc(100%+10px)] z-30 w-[252px] overflow-hidden rounded-[18px] border border-[#dfe6f2] bg-white p-2.5 shadow-[0_18px_38px_rgba(20,48,112,0.11)]">
                  <div className="mb-2 rounded-[14px] bg-[#f7f9fe] px-3.5 py-3">
                    <div className="text-[13px] font-extrabold text-ink-900">{profile.name}</div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400">
                      {profile.label}
                    </div>
                  </div>
                  <Link
                    to={switchTarget.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-start gap-3 rounded-[14px] px-3.5 py-3 text-left transition-colors hover:bg-[#f6f8fd]"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[#eef4ff] text-brand-600">
                      <Repeat2 className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold leading-[1.4] text-ink-900">{switchTarget.label}</div>
                      <div className="mt-1 text-[12px] leading-[1.55] text-ink-500">{switchTarget.helper}</div>
                    </div>
                  </Link>
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

      {/* Notifications Side Drawer */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setIsNotificationsOpen(false)}
            className="fixed inset-0 bg-black/35 backdrop-blur-[2px] transition-opacity duration-300 animate-in fade-in"
          />
          
          {/* Drawer Body */}
          <aside className="relative z-50 flex h-full w-[380px] sm:w-[420px] flex-col border-l border-[#e5ebf5] bg-white shadow-[0_0_50px_rgba(0,0,0,0.12)] animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e5ebf5] px-6 py-5">
              <div className="flex items-center gap-3">
                <h2 className="text-[20px] font-extrabold text-ink-900">Notifications</h2>
                {recentActivities.length > 0 && (
                  <span className="flex h-5 px-2 items-center justify-center rounded-full bg-[#fff0f0] text-[11px] font-extrabold text-danger-600 border border-[#ffe0e0]">
                    {recentActivities.length}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setIsNotificationsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-ink-400 hover:text-ink-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {activityItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500 h-full">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f9f4] text-[#34c759] border border-[#d2f3dc] shadow-sm mb-4">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div className="text-[18px] font-bold text-ink-900">All caught up!</div>
                  <p className="mt-2 max-w-[220px] text-[13px] text-ink-400 leading-relaxed">There are no new notifications or activities to display.</p>
                </div>
              ) : (
                <div className={`space-y-5 transition-all duration-500 ease-in-out ${isClearing ? "opacity-0 -translate-y-4 scale-95 blur-[2px]" : "opacity-100 translate-y-0 scale-100"}`}>
                  {activityItems.map((act, index) => (
                    <div key={`${act.title}-${index}`} className="flex items-start gap-4 border-b border-[#f7fafe] pb-4 last:border-0 last:pb-0">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          act.tone === "warning"
                            ? "bg-[#fff7ea] text-[#f0a11d]"
                            : act.tone === "success"
                              ? "bg-[#edf9f2] text-[#38b36b]"
                              : "bg-[#eef4ff] text-brand-600"
                        }`}
                      >
                        <act.icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[14px] font-bold leading-[1.4] text-ink-900">{act.title}</div>
                        <div className="mt-1 text-[13px] leading-[1.6] text-ink-500">{act.description}</div>
                        <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-300">{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {recentActivities.length > 0 && (
              <div className="border-t border-[#e5ebf5] p-5 bg-[#fcfdff]">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isClearing}
                  className="flex h-[48px] w-full items-center justify-center rounded-[12px] border border-[#e4ebf5] bg-white text-[14px] font-semibold text-ink-600 transition-colors hover:bg-[#f8fafe] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  {isClearing ? "Clearing..." : "Clear All Notifications"}
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
