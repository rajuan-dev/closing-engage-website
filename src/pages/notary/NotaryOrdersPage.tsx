import { useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Eye, Flame, Info, MapPin, Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Button, FooterBand, Surface } from "@/components/common";
import { useStore } from "@/store/useStore";
import { toast } from "@/store/useToastStore";

export function NotaryOrdersPage() {
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Assigned" | "In Progress" | "Submitted">("All");
  const [dateFilter, setDateFilter] = useState("");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const { notaryAssignedOrders } = useStore();
  const filteredOrders = notaryAssignedOrders.filter((order) => {
    const matchesSearch =
      searchValue.trim() === "" ||
      order.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    const matchesDate = (() => {
      if (dateFilter.trim() === "") return true;
      // Convert browser date picker format (yyyy-mm-dd) to match mock data month/day/year format
      if (dateFilter.includes("-")) {
        const [year, month, day] = dateFilter.split("-");
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        return order.date.toLowerCase().includes(formattedDate.toLowerCase()) ||
               new Date(order.date).toDateString() === dateObj.toDateString();
      }
      return order.date.toLowerCase().includes(dateFilter.toLowerCase());
    })();
    const matchesLocation = locationFilter === "All" || order.location === locationFilter;
    const matchesType = typeFilter === "All" || order.notary.toLowerCase().includes(typeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesDate && matchesLocation && matchesType;
  });

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      toast.error("No orders to export!");
      return;
    }
    const headers = ["Order ID", "Client Name", "Signing Location", "Signing Date", "Status"];
    const rows = filteredOrders.map(o => [o.id, o.clientName, o.location || "", o.date, o.status]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `notary_assigned_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully!");
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-7">
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.56fr_0.7fr_auto_auto] xl:items-end">
        <div>
          <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-500">
            Quick Search
          </div>
          <div className="flex h-[48px] items-center gap-3 rounded-[12px] border border-[#dfe6f2] bg-white px-4 text-[15px] text-ink-400">
            <Search className="h-4 w-4" />
            <input
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Order ID or Client Name"
              className="h-full w-full bg-transparent text-ink-700 outline-none placeholder:text-ink-400"
            />
          </div>
        </div>
        <div>
          <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-500">
            Status
          </div>
          <label className="flex h-[48px] items-center rounded-[12px] border border-[#dfe6f2] bg-white px-4">
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as "All" | "Assigned" | "In Progress" | "Submitted");
                setCurrentPage(1);
              }}
              className="h-full w-full bg-transparent text-[15px] text-ink-700 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Submitted">Submitted</option>
            </select>
          </label>
        </div>
        <div>
          <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-500">
            Date Range
          </div>
          <div 
            onClick={() => {
              try {
                dateInputRef.current?.showPicker();
              } catch (e) {}
            }}
            className="flex h-[48px] items-center gap-3 rounded-[12px] border border-[#dfe6f2] bg-white px-4 text-[15px] text-ink-500 cursor-pointer"
          >
            <CalendarDays className="h-4 w-4 text-ink-400" />
            <input
              ref={dateInputRef}
              type="date"
              value={dateFilter}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => {
                setDateFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="h-full w-full bg-transparent text-ink-700 outline-none cursor-pointer"
            />
          </div>
        </div>
        <Button
          variant="outline"
          className="h-[48px] rounded-[12px] border-[#dfe6f2] px-5 text-[15px] font-semibold text-brand-600"
          onClick={() => setShowMoreFilters((current) => !current)}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          More Filters
        </Button>
        <Button 
          variant="outline" 
          onClick={handleExportCSV}
          className="h-[48px] rounded-[12px] border-[#dfe6f2] px-5 text-[15px] font-semibold text-ink-700"
        >
          Export CSV
        </Button>
      </div>

      {showMoreFilters ? (
        <Surface className="rounded-[18px] border border-[#e4ebf5] bg-[#f8fafd] p-6 shadow-[0_10px_24px_rgba(20,48,112,0.04)]">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-500">
                Signing Location
              </div>
              <label className="flex h-[48px] items-center rounded-[12px] border border-[#dfe6f2] bg-white px-4">
                <select
                  value={locationFilter}
                  onChange={(event) => {
                    setLocationFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-full w-full bg-transparent text-[15px] text-ink-700 outline-none"
                >
                  <option value="All">All Locations</option>
                  <option value="San Francisco, CA">San Francisco, CA</option>
                  <option value="Oakland, CA">Oakland, CA</option>
                  <option value="Palo Alto, CA">Palo Alto, CA</option>
                </select>
              </label>
            </div>
            <div>
              <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-500">
                Signing Type
              </div>
              <label className="flex h-[48px] items-center rounded-[12px] border border-[#dfe6f2] bg-white px-4">
                <select
                  value={typeFilter}
                  onChange={(event) => {
                    setTypeFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-full w-full bg-transparent text-[15px] text-ink-700 outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="Refinance">Refinance</option>
                  <option value="Seller Signing">Seller Signing</option>
                  <option value="Buyer">Buyer</option>
                </select>
              </label>
            </div>
          </div>
        </Surface>
      ) : null}

      <Surface className="overflow-hidden rounded-[18px] border border-[#e4ebf5] bg-white shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-300">
                {["Order ID", "Client Name", "Signing Location", "Signing Date", "Status", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-4">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="border-t border-[#edf1f7]">
                  <td className="px-6 py-5 text-[15px] font-bold text-brand-600">{order.id}</td>
                  <td className="px-6 py-5">
                    <div className="text-[16px] font-semibold text-ink-900">{order.clientName}</div>
                    <div className="mt-1 text-[13px] text-ink-500">{order.notary}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[15px] text-ink-500">
                      <MapPin className="h-4 w-4 text-ink-400" />
                      {order.location}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[15px] font-semibold text-ink-900">{order.date}</div>
                    <div className="mt-1 text-[13px] text-ink-500">{order.time}</div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge status={order.status} />
                  </td>
                  <td className="px-6 py-5">
                    <Link to={`/notary/orders/${order.id.replace("#", "")}`} className="text-brand-600 hover:text-brand-700" aria-label={`View ${order.id}`}>
                      <Eye className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[15px] text-ink-400">
                    No assigned orders found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#edf1f7] px-6 py-5 text-sm text-ink-500">
          <span>Showing {paginatedOrders.length} of {filteredOrders.length} filtered orders ({notaryAssignedOrders.length} total)</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#e4ebf5] text-ink-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[14px] font-semibold text-ink-700 mx-1">Page {currentPage} of {totalPages || 1}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#e4ebf5] text-ink-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Surface>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          ["Status: Assigned", "Order has been dispatched but you haven't started the document package review yet.", "brand"],
          ["Status: In Progress", "You have opened the signing package or marked yourself en route to the client.", "warning"],
          ["Status: Submitted", "The signing is complete and the executed documents have been uploaded for review.", "success"],
        ].map(([title, body, tone]) => (
          <Surface key={title} className="rounded-[18px] border border-[#e4ebf5] bg-white p-5 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="flex items-start gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-[12px] ${
                tone === "warning"
                  ? "bg-[#fff5e8] text-[#f08e24]"
                  : tone === "success"
                    ? "bg-[#edf9f2] text-[#38b36b]"
                    : "bg-[#eef4ff] text-brand-600"
              }`}>
                {tone === "warning" ? <Flame className="h-4 w-4" /> : tone === "success" ? <ShieldCheck className="h-4 w-4" /> : <Info className="h-4 w-4" />}
              </div>
              <div>
                <div className="text-[18px] font-extrabold text-ink-900">{title}</div>
                <div className="mt-2 text-[14px] leading-[1.7] text-ink-500">{body}</div>
              </div>
            </div>
          </Surface>
        ))}
      </div>
      <FooterBand />
    </div>
  );
}
