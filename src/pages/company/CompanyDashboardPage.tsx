import { useEffect, useState } from "react";
import { CheckCircle2, CircleDot, FileText, FolderKanban, Hourglass } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Surface } from "@/components/common";
import { notificationService } from "@/services/notificationService";
import { useStore } from "@/store/useStore";
import { toast } from "@/store/useToastStore";
import { orderService } from "@/services/orderService";

export function CompanyDashboardPage() {
  const {
    companyOrders,
    setCompanyOrders,
    notifications,
    setNotifications,
    markAllNotificationsRead,
  } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const orders = await orderService.getCompanyOrders();
        if (isMounted) setCompanyOrders(orders);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load dashboard orders.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadOrders();

    return () => {
      isMounted = false;
    };
  }, [setCompanyOrders]);

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      try {
        const liveNotifications = await notificationService.getNotifications();
        if (isMounted) setNotifications(liveNotifications);
      } catch (error) {
        if (isMounted) {
          toast.error(error instanceof Error ? error.message : "Unable to load notifications.");
        }
      }
    };

    void loadNotifications();

    return () => {
      isMounted = false;
    };
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

  const activityItems = notifications.map((act) => {
    let Icon = FileText;
    let tone: "brand" | "warning" | "success" = "brand";
    if (act.type === "order") {
      Icon = CircleDot;
      tone = "brand";
    } else if (act.type === "document") {
      Icon = Hourglass;
      tone = "warning";
    } else if (act.type === "user") {
      Icon = CheckCircle2;
      tone = "success";
    }
    return {
      ...act,
      icon: Icon,
      tone,
    };
  });

  const dashboardStats = [
    { title: "Total Orders", value: companyOrders.length.toString(), icon: FileText, tone: "brand" },
    { title: "Active Orders", value: companyOrders.filter(o => ["Assigned", "Under Review", "Received"].includes(o.status)).length.toString(), icon: FolderKanban, tone: "brand" },
    { title: "Pending Review", value: companyOrders.filter(o => o.status === "Under Review").length.toString(), icon: Hourglass, tone: "warning" },
    { title: "Completed Orders", value: companyOrders.filter(o => ["Completed", "Approved"].includes(o.status)).length.toString(), icon: CheckCircle2, tone: "success" },
  ] as const;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Stats Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Surface key={i} className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
              <div className="mb-9 h-12 w-12 rounded-[14px] bg-slate-100" />
              <div className="h-4 w-24 rounded bg-slate-100" />
              <div className="mt-3 h-10 w-16 rounded bg-slate-100" />
            </Surface>
          ))}
        </div>

        {/* Table & Status Skeleton */}
        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.7fr]">
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-7 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="flex items-center justify-between pb-6">
              <div className="h-8 w-48 rounded bg-slate-100" />
              <div className="h-5 w-24 rounded bg-slate-100" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 rounded-[14px] bg-slate-50" />
              ))}
            </div>
          </Surface>
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-7 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="h-8 w-32 rounded bg-slate-100 mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-12 rounded-[14px] bg-slate-50" />
              ))}
            </div>
          </Surface>
        </div>
      </div>
    );
  }

  const total = companyOrders.length || 1;
  const getPercent = (count: number) => `${Math.round((count / total) * 100)}%`;

  const statusRows = [
    { label: "Received", value: getPercent(companyOrders.filter(o => o.status === "Received").length), width: getPercent(companyOrders.filter(o => o.status === "Received").length) },
    { label: "Assigned", value: getPercent(companyOrders.filter(o => o.status === "Assigned").length), width: getPercent(companyOrders.filter(o => o.status === "Assigned").length) },
    { label: "Under Review", value: getPercent(companyOrders.filter(o => o.status === "Under Review").length), width: getPercent(companyOrders.filter(o => o.status === "Under Review").length) },
    { label: "Approved", value: getPercent(companyOrders.filter(o => o.status === "Approved").length), width: getPercent(companyOrders.filter(o => o.status === "Approved").length) },
    { label: "Completed", value: getPercent(companyOrders.filter(o => o.status === "Completed").length), width: getPercent(companyOrders.filter(o => o.status === "Completed").length) },
  ];

  const notaryAccent: Record<string, string> = {
    "David Miller": "from-[#7a6458] to-[#d6b08e]",
    "Robert Vance": "from-[#23314a] to-[#9d6d5f]",
    "Elena Wright": "from-[#6a4b63] to-[#d0ab8b]",
    "Gordon Cole": "from-[#165466] to-[#4eb3af]",
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map(({ title, value, icon: Icon, tone }) => (
          <Surface
            key={title}
            className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30_rgba(20,48,112,0.05)]"
          >
            <div
              className={`mb-9 flex h-12 w-12 items-center justify-center rounded-[14px] ${
                tone === "warning"
                  ? "bg-[#fff5e8] text-[#f0a11d]"
                  : tone === "success"
                    ? "bg-[#edf9f2] text-[#3ab86b]"
                    : "bg-[#eef4ff] text-brand-600"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-[13px] font-semibold text-ink-400">{title}</div>
            <div className="mt-2 text-[28px] font-bold tracking-tight text-ink-900">
              {value}
            </div>
          </Surface>
        ))}
      </div>

      <Surface className="overflow-hidden rounded-[18px] border border-[#e4ebf5] bg-white shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <div className="flex items-center justify-between px-7 py-4">
          <h2 className="text-[18px] font-bold tracking-tight text-ink-900">Recent Orders</h2>
          <Link to="/company/orders" className="text-sm font-semibold text-brand-600">
            View All Orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-t border-[#edf1f7] text-left text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-300">
                {["Order ID", "Client Name", "Notary", "Status", "Date", "Action"].map((header) => (
                  <th key={header} className="px-7 py-4">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companyOrders.slice(0, 3).map((order) => (
                <tr key={order.id} className="border-t border-[#edf1f7] hover:bg-slate-50/50 transition-colors">
                  <td className="px-7 py-5 text-[15px] font-bold text-ink-900">{order.id}</td>
                  <td className="px-7 py-5 text-[15px] font-bold text-brand-600">{order.clientName}</td>
                  <td className="px-7 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${notaryAccent[order.notary] || "from-slate-400 to-slate-500"} text-[10px] font-bold text-white shadow-sm`}>
                        {order.notary === "--" ? "?" : order.notary.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-[15px] font-semibold text-ink-700">{order.notary === "--" ? "Not Assigned" : order.notary}</span>
                    </div>
                  </td>
                  <td className="px-7 py-5">
                    <Badge status={order.status as any} />
                  </td>
                  <td className="px-7 py-5 text-[15px] font-medium text-ink-500">{order.date}</td>
                  <td className="px-7 py-5">
                    <Link
                      to={`/company/orders/${order.id.replace("#", "")}`}
                      className="inline-flex h-9 items-center justify-center rounded-[10px] bg-[#eef1ff] px-4 text-[13px] font-bold text-brand-600 transition-colors hover:bg-[#e7ecff]"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.7fr]">
        <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-7 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold tracking-tight text-ink-900">Order Status Overview</h2>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-300">Monthly Progress</div>
          </div>
          <div className="mt-9 space-y-7">
            {statusRows.map((row) => (
              <div key={row.label}>
                <div className="mb-2.5 flex items-center justify-between text-[14px] font-semibold text-ink-600">
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
                <div className="h-[9px] rounded-full bg-[#eef2f8]">
                  <div className="h-[9px] rounded-full bg-brand-600" style={{ width: row.width }} />
                </div>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-7 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
          <h2 className="text-[18px] font-bold tracking-tight text-ink-900">Recent Notifications</h2>
          <div className="mt-7 min-h-[300px] flex flex-col justify-center">
            {activityItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in duration-500">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f9f4] text-[#34c759] border border-[#d2f3dc] shadow-sm mb-4">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="text-[17px] font-bold text-ink-900">All caught up!</div>
                <p className="mt-2 max-w-[200px] text-[13px] text-ink-400 leading-relaxed">There are no new notifications or activities to display.</p>
              </div>
            ) : (
              <div className={`space-y-6 flex-1 flex flex-col justify-start transition-all duration-500 ease-in-out ${isMarkingAllRead ? "opacity-70" : "opacity-100 translate-y-0 scale-100"}`}>
                {activityItems.map(({ id, title, message, time, icon: Icon, tone, read }) => (
                  <div key={id} className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        tone === "warning"
                          ? "bg-[#fff7ea] text-[#f0a11d]"
                          : tone === "success"
                            ? "bg-[#edf9f2] text-[#38b36b]"
                            : "bg-[#eef4ff] text-brand-600"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-[15px] font-bold leading-[1.45] text-ink-900">{title}</div>
                        {!read ? <span className="h-2 w-2 rounded-full bg-brand-600" /> : null}
                      </div>
                      <div className="mt-1 text-[14px] leading-[1.6] text-ink-500">{message}</div>
                      <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">{time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button 
            type="button"
            onClick={() => void handleMarkAllRead()}
            disabled={notifications.length === 0 || isMarkingAllRead}
            className="mt-9 h-[48px] w-full rounded-[12px] border border-[#e4ebf5] bg-white text-[14px] font-semibold text-ink-500 transition-colors hover:bg-[#f8fafe] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isMarkingAllRead ? "Updating..." : "Mark All Read"}
          </button>
        </Surface>
      </div>
    </div>
  );
}
