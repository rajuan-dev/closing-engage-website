import { CheckCircle2, ChevronRight, FileText, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Button, FooterBand, Surface } from "@/components/common";
import { useStore } from "@/store/useStore";

export function NotaryDashboardPage() {
  const { notaryOrders } = useStore();

  const stats = [
    { title: "Total Assigned Orders", value: notaryOrders.length.toString().padStart(2, '0'), helper: "Global", icon: FileText, tone: "brand" },
    { title: "In Progress", value: notaryOrders.filter(o => ["In Progress", "Assigned"].includes(o.status)).length.toString().padStart(2, '0'), helper: "Active", icon: Flame, tone: "warning" },
    { title: "Completed", value: notaryOrders.filter(o => o.status === "Completed" || o.status === "Submitted").length.toString().padStart(2, '0'), helper: "History", icon: CheckCircle2, tone: "success" },
  ] as const;

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-ink-900">
            Assigned Workload
          </h1>
          <p className="mt-1 text-[13px] text-ink-500">
            Manage your active signing appointments and document verifications from a central atrium.
          </p>
        </div>
        <Link to="/notary/upload-documents">
          <Button className="h-[48px] rounded-[14px] px-5 text-[15px] font-semibold shadow-[0_14px_32px_rgba(24,90,188,0.18)]">
            <FileText className="mr-2 h-4 w-4" />
            Upload Documents
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map(({ title, value, helper, icon: Icon, tone }) => (
          <Surface
            key={title}
            className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]"
          >
            <div className="mb-8 flex items-start justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${
                  tone === "warning"
                    ? "bg-[#fff5e8] text-[#f08e24]"
                    : tone === "success"
                      ? "bg-[#edf9f2] text-[#38b36b]"
                      : "bg-[#eef4ff] text-brand-600"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink-300">
                {helper}
              </div>
            </div>
            <div className="text-[28px] font-bold tracking-tight text-ink-900">
              {value}
            </div>
            <div className="mt-1.5 text-[13px] font-semibold text-ink-500">{title}</div>
          </Surface>
        ))}
      </div>

      <Surface className="overflow-hidden rounded-[18px] border border-[#e4ebf5] bg-white shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-[17px] font-bold tracking-tight text-ink-900">Assigned Orders</div>
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-600">
            <span className="h-2 w-2 rounded-full bg-brand-600" />
            Live Updates
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-[#fbfcff] text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-300">
                {["Order ID", "Client Name", "Location", "Date & Time", "Status", "Action"].map((header) => (
                  <th key={header} className="px-6 py-4">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notaryOrders.map((order) => (
                <tr key={order.id} className="border-t border-[#edf1f7] hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 text-[15px] font-bold text-brand-600">{order.id}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2f8] text-[10px] font-bold text-brand-600 shadow-sm border border-brand-50">
                        {order.clientName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[15px] font-bold text-ink-900">{order.clientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[15px] text-ink-500">{order.location}</td>
                  <td className="px-6 py-5">
                    <div className="text-[15px] font-semibold text-ink-900">{order.date}</div>
                    <div className="mt-1 text-[12px] text-ink-400">{order.time}</div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge status={order.status as any} />
                  </td>
                  <td className="px-6 py-5">
                    <Link to={`/notary/orders/${order.id.replace("#", "")}`} className="inline-flex items-center gap-2 text-[15px] font-bold text-ink-900 hover:text-brand-600 transition-colors">
                      View
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#edf1f7] px-6 py-5 text-sm text-ink-500">
          <span>Showing {notaryOrders.length} of {notaryOrders.length} results</span>
          <div className="flex items-center gap-5">
            <span className="cursor-not-allowed opacity-30">Previous</span>
            <span className="cursor-not-allowed opacity-30">Next</span>
          </div>
        </div>
      </Surface>
      <FooterBand />
    </div>
  );
}
