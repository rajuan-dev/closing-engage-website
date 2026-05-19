import { useEffect, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, FileText, Hourglass, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Button, Select, Surface } from "@/components/common";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { hasPortalPermission } from "@/utils/portalPermissions";

export function CompanyOrdersPage() {
  const { companyOrders } = useStore();
  const canCreateOrders = hasPortalPermission("createOrders");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("Date: Any time");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, statusFilter, dateFilter]);

  const filteredOrders = companyOrders.filter((order) => {
    const matchesSearch =
      searchValue.trim() === "" ||
      order.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    
    // Mock date filtering logic
    let matchesDate = true;
    if (dateFilter === "Last 7 Days") matchesDate = order.date.includes("Mar"); // Simple mock
    if (dateFilter === "Last 30 Days") matchesDate = true; // All mock data is within 30 days
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = [
    { title: "Total Orders", value: companyOrders.length.toString(), icon: FileText, tone: "brand" },
    { title: "Pending Review", value: companyOrders.filter(o => o.status === "Under Review").length.toString(), icon: Hourglass, tone: "warning" },
    { title: "Completed Today", value: companyOrders.filter(o => o.status === "Completed").length.toString(), icon: CheckCircle2, tone: "success" },
  ] as const;

  const notaryAccent: Record<string, string> = {
    "David Miller": "from-[#7a6458] to-[#d6b08e]",
    "Robert Vance": "from-[#23314a] to-[#9d6d5f]",
    "Elena Wright": "from-[#6a4b63] to-[#d0ab8b]",
    "Gordon Cole": "from-[#165466] to-[#4eb3af]",
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-ink-900">
            Orders
          </h1>
          <p className="mt-1 text-[13px] text-ink-500">
            Manage and track all your closing orders
          </p>
        </div>
        {canCreateOrders ? (
          <Link to="/company/orders/new">
            <Button className="h-[48px] rounded-[14px] px-5 text-[15px] font-semibold shadow-[0_14px_32px_rgba(24,90,188,0.18)]">
              <Plus className="mr-2 h-4 w-4" />
              Create New Order
            </Button>
          </Link>
        ) : null}
      </div>

      <Surface className="rounded-[18px] border border-[#e4ebf5] bg-[#f9fbff] p-4 shadow-[0_12px_30px_rgba(20,48,112,0.04)]">
        <div className="grid gap-4 lg:grid-cols-[1.55fr_0.4fr_0.4fr_54px]">
          <div className="flex h-[50px] items-center gap-3 rounded-[14px] border border-[#e5ebf5] bg-white px-4 text-sm text-ink-700">
            <Search className="h-4 w-4 shrink-0 text-ink-300" />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by Order ID or Client Name"
              className="w-full bg-transparent outline-none"
            />
          </div>
          <Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={["All", "Received", "Assigned", "Under Review", "Approved", "Completed"]} 
            className="h-[50px] rounded-[14px] border-[#e5ebf5] bg-white" 
          />
          <Select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            options={["Date: Any time", "Last 7 Days", "Last 30 Days", "This Year"]} 
            className="h-[50px] rounded-[14px] border-[#e5ebf5] bg-white" 
          />
          <button onClick={() => { setSearchValue(""); setStatusFilter("All"); setDateFilter("Date: Any time"); }} className="flex h-[50px] items-center justify-center rounded-[14px] border border-[#e5ebf5] bg-white text-brand-600 transition-colors hover:bg-[#f5f8ff]">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </Surface>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map(({ title, value, icon: Icon, tone }) => (
          <Surface
            key={title}
            className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]"
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
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-300">
                {["Order ID", "Client Name", "Property Address", "Notary", "Status", "Date", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-4">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="border-t border-[#edf1f7] hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 text-[15px] font-bold text-brand-600">{order.id}</td>
                  <td className="px-6 py-5 text-[15px] font-bold text-ink-900">{order.clientName}</td>
                  <td className="px-6 py-5 text-[14px] text-ink-500">{order.propertyAddress}</td>
                  <td className="px-6 py-5">
                    {order.notary === "--" ? (
                      <span className="text-ink-300">--</span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${notaryAccent[order.notary] || "from-slate-400 to-slate-500"} text-[10px] font-bold text-white shadow-sm`}>
                          {order.notary.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-[14px] font-semibold text-ink-700">{order.notary}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <Badge status={order.status as any} />
                  </td>
                  <td className="px-6 py-5 text-[14px] font-medium text-ink-500">{order.date}</td>
                  <td className="px-6 py-5">
                    <Link 
                      to={`/company/orders/${order.id.replace("#", "")}`} 
                      className="text-[14px] font-bold text-ink-900 hover:text-brand-600 transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#edf1f7] px-6 py-5 text-sm text-ink-500">
          <span>
            Showing <span className="font-bold text-ink-900">{Math.min(filteredOrders.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredOrders.length, currentPage * itemsPerPage)}</span> of <span className="font-bold text-ink-900">{filteredOrders.length}</span> orders
          </span>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#dfe6f2] text-ink-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-[10px] text-[14px] font-bold transition-all",
                  currentPage === i + 1 
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-100" 
                    : "text-ink-500 hover:bg-slate-50"
                )}
              >
                {i + 1}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#dfe6f2] text-ink-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Surface>
    </div>
  );
}
