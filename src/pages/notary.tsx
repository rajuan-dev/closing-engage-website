import { useEffect, useRef, useState } from "react";
import { CalendarDays, Camera, CheckCircle2, ChevronLeft, ChevronRight, CloudUpload, Download, Eye, FileBadge2, FileText, Filter, Flame, Info, MapPin, Paperclip, Pencil, Plus, Printer, Search, SendHorizontal, ShieldCheck, SlidersHorizontal, Trash2, UserRound, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge, Button, FooterBand, Input, Modal, Surface, Textarea } from "@/components/common";
import { DocumentViewer } from "@/components/DocumentViewer";
import { useStore } from "@/store/useStore";
import { useConfirmStore } from "@/store/useConfirmStore";

import { toast } from "@/store/useToastStore";

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
          <h1 className="text-[44px] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink-900">
            Assigned Workload
          </h1>
          <p className="mt-2 max-w-[680px] text-[18px] leading-[1.7] text-ink-500">
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
            <div className="text-[46px] font-extrabold leading-none tracking-[-0.05em] text-ink-900">
              {value}
            </div>
            <div className="mt-2 text-[14px] font-semibold text-ink-500">{title}</div>
          </Surface>
        ))}
      </div>

      <Surface className="overflow-hidden rounded-[18px] border border-[#e4ebf5] bg-white shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="text-[30px] font-extrabold tracking-[-0.04em] text-ink-900">Assigned Orders</div>
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

export function NotaryOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { notaryOrders, notaryAssignedOrders } = useStore();
  const confirm = useConfirmStore(state => state.confirm);

  const allOrders = [...notaryOrders, ...notaryAssignedOrders];
  const order = allOrders.find(o => o.id.replace("#", "") === id) || allOrders[0];

  const [orderStatus, setOrderStatus] = useState(order.status);
  const [printedConfirmed, setPrintedConfirmed] = useState(false);
  const [scanbacksConfirmed, setScanbacksConfirmed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(order.date);
  const [scheduledTime, setScheduledTime] = useState(order.time || "14:00");
  const [notaryNotes, setNotaryNotes] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [viewingFile, setViewingFile] = useState<{ name: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (viewingFile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [viewingFile]);

  const appendFiles = (files: FileList | File[]) => {
    const accepted = Array.from(files).filter((file) => file.name.toLowerCase().endsWith(".pdf"));
    if (accepted.length === 0) return;
    setUploadedFiles((current) => [...current, ...accepted]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (event.dataTransfer.files?.length) appendFiles(event.dataTransfer.files);
  };

  return (
    <div className="space-y-7">
      <Link to="/notary/orders" className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand-600">
        <ChevronLeft className="h-4 w-4" />
        Back to Orders
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-[46px] font-extrabold tracking-[-0.045em] text-ink-900">Order ID {order.id}</h1>
          <Badge status={orderStatus as any} />
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-[44px] rounded-[12px] border-[#dfe6f2] px-5 text-[14px] font-semibold"
            onClick={() => setShowScheduleModal(true)}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Schedule Closing
          </Button>
          <Button
            variant="outline"
            className="h-[44px] rounded-[12px] border-[#dfe6f2] px-5 text-[14px] font-semibold"
            onClick={() => {
              confirm({
                title: "Mark as In Progress?",
                message: "This will update the order status and notify the title company that you have begun the signing process.",
                confirmLabel: "Update Status",
                type: "warning",
                onConfirm: () => {
                  setOrderStatus("In Progress");
                  toast.success("Order is now In Progress");
                }
              });
            }}
          >
            Mark as In Progress
          </Button>
          <Button
            className="h-[44px] rounded-[12px] px-5 text-[14px] font-semibold"
            onClick={() => {
              confirm({
                title: "Mark as Completed?",
                message: "Please ensure all documents have been signed and uploaded before marking as completed.",
                confirmLabel: "Yes, Completed",
                type: "info",
                onConfirm: () => {
                  setOrderStatus("Completed");
                  toast.success("Order marked as Completed");
                }
              });
            }}
          >
            Mark as Completed
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule Closing"
        subtitle="Select the preferred date and time for this closing appointment"
        maxWidth="520px"
      >
        <div className="space-y-6 px-7 pb-8">
          <div className="grid gap-5">
            <Input
              label="Select Date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="bg-[#f7f9fd]"
            />
            <Input
              label="Select Time"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="bg-[#f7f9fd]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowScheduleModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.info(`Closing scheduled for ${scheduledDate} at ${scheduledTime}`);
                setShowScheduleModal(false);
              }}
              className="flex-1"
            >
              Confirm Schedule
            </Button>
          </div>
        </div>
      </Modal>

      <Surface className="rounded-[18px] border border-[#e4ebf5] bg-[#f4f8ff] p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <div className="text-[14px] font-extrabold uppercase tracking-[0.16em] text-ink-500">Order Lifecycle</div>
        <div className="mt-8 grid gap-8 md:grid-cols-3 text-center">
          <div>
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] bg-brand-600 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="mt-4 text-[16px] font-semibold text-ink-900">Docs Ready to Print</div>
            <div className="mt-2 text-[13px] font-semibold text-brand-600">Completed</div>
          </div>
          <div>
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] border-2 border-brand-600 bg-white text-brand-600">
              <Printer className="h-5 w-5" />
            </div>
            <div className="mt-4 text-[16px] font-semibold text-ink-900">Docs Printed by Notary</div>
            <button
              type="button"
              onClick={() => setPrintedConfirmed((current) => !current)}
              className={`mt-4 rounded-full px-5 py-2 text-[13px] font-semibold ${
                printedConfirmed
                  ? "bg-brand-600 text-white"
                  : "border border-brand-600 bg-white text-brand-600"
              }`}
            >
              {printedConfirmed ? "Confirmed" : "Confirm"}
            </button>
          </div>
          <div>
            <div className={`mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] ${scanbacksConfirmed ? "bg-brand-600 text-white" : uploadedFiles.length > 0 ? "border-2 border-brand-600 bg-white text-brand-600" : "border-2 border-[#d8dee9] bg-white text-ink-300"}`}>
              {scanbacksConfirmed ? <CheckCircle2 className="h-5 w-5" /> : <CloudUpload className="h-5 w-5" />}
            </div>
            <div className={`mt-4 text-[16px] font-semibold ${uploadedFiles.length > 0 ? "text-ink-700" : "text-ink-400"}`}>Scanbacks Uploaded</div>
            <button
              type="button"
              disabled={uploadedFiles.length === 0}
              onClick={() => setScanbacksConfirmed(prev => !prev)}
              className={`mt-4 rounded-full px-5 py-2 text-[13px] font-semibold transition-all ${
                scanbacksConfirmed
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-100"
                  : uploadedFiles.length > 0
                    ? "border border-brand-600 bg-white text-brand-600 hover:bg-brand-50"
                    : "bg-[#eef2f7] text-ink-300 cursor-not-allowed"
              }`}
            >
              {scanbacksConfirmed ? "Confirmed" : "Confirm"}
            </button>
          </div>
        </div>
      </Surface>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.68fr]">
        <div className="space-y-6">
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-7 flex items-center justify-between">
              <div className="text-[28px] font-extrabold tracking-[-0.03em] text-ink-900">Order Information</div>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <Detail label="CLIENT" value={order.clientName} />
              <Detail label="SIGNING DATE & TIME" value={`${order.date}, ${order.time}`} />
              <div className="md:col-span-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400">
                  PROPERTY ADDRESS
                </div>
                <div className="mt-3 flex items-center gap-2 text-[16px] font-semibold text-ink-900">
                  <MapPin className="h-4 w-4 text-brand-600" />
                  {order.location}
                </div>
              </div>
            </div>
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[20px] font-extrabold text-ink-900">Special Instructions</div>
            <div className="mt-4 text-[14px] italic leading-[1.75] text-ink-500">
              "Please ensure all signatures are in blue ink. Scan and upload the full package once completed."
            </div>
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[20px] font-extrabold text-ink-900">Provided Documents</div>
            <div className="mt-6 space-y-4">
              {[
                { name: "Closing_Instructions.pdf", size: "1.2 MB" },
                { name: "Signature_Package.pdf", size: "5.4 MB" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between rounded-[14px] bg-[#f7f9fd] px-4 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff3f3] text-danger-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-ink-900">{doc.name}</div>
                      <div className="text-sm text-ink-400">{doc.size}</div>
                    </div>
                  </div>
                   <div className="flex gap-5 text-brand-600">
                     <Eye 
                       className="h-4 w-4 cursor-pointer" 
                       onClick={() => setViewingFile({ name: doc.name, url: "#" })}
                     />
                     <Download className="h-4 w-4 cursor-pointer" />
                   </div>
                </div>
              ))}
            </div>
          </Surface>
        </div>
        <div className="space-y-6">
          <Surface className="rounded-[18px] border border-dashed border-[#d8e0ec] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[16px] font-extrabold uppercase tracking-[0.16em] text-ink-700">Upload Scanbacks</div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              className="hidden"
              onChange={(event) => {
                if (event.target.files?.length) appendFiles(event.target.files);
                event.target.value = "";
              }}
            />
            <div
              className={`mt-5 rounded-[16px] border border-dashed px-6 py-10 text-center transition-colors ${
                isDragActive ? "border-brand-300 bg-[#f5f9ff]" : "border-[#d8e0ec] bg-[#fcfdff]"
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragActive(false);
              }}
              onDrop={handleDrop}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#eaf0ff] text-brand-600">
                <CloudUpload className="h-7 w-7" />
              </div>
              <div className="mt-5 text-[18px] font-semibold text-ink-900">Drag and drop scanbacks here</div>
              <div className="mt-2 text-[14px] text-ink-400">Supports PDF up to 50MB</div>
              <Button
                type="button"
                variant="outline"
                className="mt-6 h-[40px] rounded-[10px] border-[#dfe6f2] px-5 text-[14px] font-semibold"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
            </div>
            {uploadedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="mt-5 flex items-center justify-between rounded-[14px] bg-[#f3f4f7] px-4 py-4 text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff3f3] text-danger-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-ink-900">{file.name}</div>
                    <div className="text-ink-400">{(file.size / (1024 * 1024)).toFixed(1)} MB • Uploaded just now</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    type="button" 
                    onClick={() => setViewingFile({ name: file.name, url: URL.createObjectURL(file) })}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm hover:bg-brand-50"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setUploadedFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-danger-600 shadow-sm hover:bg-danger-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </Surface>
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[16px] font-extrabold uppercase tracking-[0.16em] text-ink-700">Notary Notes</div>
            <Textarea
              className="mt-5 min-h-[160px] rounded-[12px] border-[#e2e8f3] bg-[#f7f9fd] px-4 py-3 text-[14px]"
              placeholder="Add any specific details about the signing here..."
              value={notaryNotes}
              onChange={(event) => setNotaryNotes(event.target.value)}
            />
          </Surface>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="w-full max-w-[520px]">
          <Button 
            className="h-[52px] w-full rounded-[12px] text-[18px] font-semibold"
            onClick={() => {
              if (uploadedFiles.length === 0) {
                toast.error("Please upload at least one document.");
                return;
              }
              toast.success("Documents successfully submitted!");
              setUploadedFiles([]);
            }}
          >
            Submit Documents
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <div className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">Required fields must be completed before submission</div>
        </div>
      </div>
      <DocumentViewer 
        isOpen={!!viewingFile}
        onClose={() => setViewingFile(null)}
        fileName={viewingFile?.name || ""}
        fileUrl={viewingFile?.url || ""}
      />
      <FooterBand />
    </div>
  );
}

export function NotaryUploadDocumentsPage() {
  const navigate = useNavigate();
  const { notaryOrders, addCompanyDocument, addActivity, updateCompanyOrder, updateNotaryOrder } = useStore();
  const [selectedOrder, setSelectedOrder] = useState(
    notaryOrders.length > 0 ? `${notaryOrders[0].id} - ${notaryOrders[0].clientName}` : "#CE-94012 - Jonathan Harker"
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([
    new File(["temporary"], "scanback_signed_final.pdf", { type: "application/pdf" }),
  ]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [viewingFile, setViewingFile] = useState<{ name: string; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const appendFiles = (files: FileList | File[]) => {
    const accepted = Array.from(files).filter((file) => file.name.toLowerCase().endsWith(".pdf"));
    if (accepted.length === 0) return;
    setUploadedFiles((current) => [...current, ...accepted]);
  };

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles((current) => current.filter((_, index) => index !== indexToRemove));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (event.dataTransfer.files?.length) appendFiles(event.dataTransfer.files);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[44px] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink-900">
          Upload Documents
        </h1>
        <p className="mt-2 max-w-[760px] text-[18px] leading-[1.7] text-ink-500">
          Upload scanback documents for your assigned orders. Ensure all pages are legible and included in a single PDF file where possible.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_280px] xl:items-start">
        <div className="space-y-6">
          <div>
            <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-500">
              Select Assigned Order
            </div>
            <label className="flex h-[50px] items-center rounded-[12px] border border-[#dfe6f2] bg-white px-4">
              <select
                value={selectedOrder}
                onChange={(event) => setSelectedOrder(event.target.value)}
                className="h-full w-full bg-transparent text-[15px] text-ink-700 outline-none"
              >
                {notaryOrders.map((o) => (
                  <option key={o.id} value={`${o.id} - ${o.clientName}`}>
                    {o.id} - {o.clientName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files?.length) appendFiles(event.target.files);
              event.target.value = "";
            }}
          />

          <div
            className={`rounded-[20px] border border-dashed px-8 py-12 text-center transition-colors ${
              isDragActive ? "border-brand-300 bg-[#f5f9ff]" : "border-[#dfe6f2] bg-white"
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragActive(false);
            }}
            onDrop={handleDrop}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#eaf0ff] text-brand-600">
              <CloudUpload className="h-7 w-7" />
            </div>
            <div className="mt-6 text-[34px] font-extrabold tracking-[-0.04em] text-ink-900">
              Drag & Drop Scanbacks
            </div>
            <div className="mx-auto mt-3 max-w-[420px] text-[16px] leading-[1.7] text-ink-500">
              Drop your PDF files here or click to browse your computer.
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-7 h-[42px] rounded-[12px] border-[#dfe6f2] px-5 text-[15px] font-semibold text-brand-600"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
          </div>

          {uploadedFiles.map((file, index) => (
            <Surface
              key={`${file.name}-${index}`}
              className="rounded-[18px] border border-[#e4ebf5] bg-white p-5 shadow-[0_12px_30px_rgba(20,48,112,0.05)]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff3f3] text-danger-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-ink-900">{file.name}</div>
                    <div className="mt-1 text-[13px] text-ink-500">4.2 MB • Ready to Submit</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    type="button" 
                    onClick={() => setViewingFile({ name: file.name, url: URL.createObjectURL(file) })}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm hover:bg-brand-50"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => removeFile(index)} className="text-ink-400 hover:text-danger-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-5 h-[4px] rounded-full bg-[#dff3e8]">
                <div className="h-[4px] w-full rounded-full bg-[#1fc27e]" />
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1fc27e]">
                <span>Verification Complete</span>
                <span>100%</span>
              </div>
            </Surface>
          ))}
        </div>

        <Surface className="h-fit rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
          <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-ink-500">Submission Guide</div>
          <div className="mt-5 space-y-5 text-[14px] leading-[1.7] text-ink-500">
            {[
              ["Legibility", "Ensure all text is sharp and readable for the title officer."],
              ["Order of Pages", "Keep the stack in the original order provided in the packet."],
              ["Full Stack", "Include all pages, even if they only contain boilerplate text."],
            ].map(([title, body]) => (
              <div key={title} className="flex gap-3">
                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-brand-200 text-brand-600">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                <div>
                  <strong className="block text-ink-900">{title}</strong>
                  {body}
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-[14px] font-medium text-[#1aa468]">
          <CheckCircle2 className="h-4 w-4" />
          All systems operational
        </div>
        <Button 
          className="h-[52px] rounded-[12px] px-7 text-[16px] font-semibold"
          onClick={() => {
            if (uploadedFiles.length === 0) {
              toast.error("Please upload at least one document.");
              return;
            }

            const orderId = selectedOrder.split(" - ")[0].replace("#", "");

            // Save uploaded files to the global documents list
            uploadedFiles.forEach((file) => {
              const docRecord = {
                id: "DOC-" + (Math.floor(Math.random() * 90000) + 10000),
                name: file.name,
                orderId: orderId,
                uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
                status: "Submitted" as const,
                uploadedBy: "You (Notary)"
              };
              addCompanyDocument(docRecord);
            });

            // Update status of the notary order and company order
            updateNotaryOrder("#" + orderId, { status: "Submitted" });
            updateCompanyOrder("#" + orderId, { status: "Under Review" });

            // Dispatch dynamic activity update
            addActivity({
              title: "Scanback Uploaded",
              description: `Notary uploaded ${uploadedFiles.length} file(s) for Order #${orderId}.`,
              time: "Just now"
            });

            toast.success("Documents successfully uploaded and submitted!");
            setUploadedFiles([]);
            navigate("/notary/dashboard");
          }}
        >
          Upload & Submit
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
      <DocumentViewer 
        isOpen={!!viewingFile}
        onClose={() => setViewingFile(null)}
        fileName={viewingFile?.name || ""}
        fileUrl={viewingFile?.url || ""}
      />
      <FooterBand />
    </div>
  );
}

export function NotarySettingsPage() {
  const { notaryProfile, updateNotaryProfile, addActivity } = useStore();
  const [isEditMode, setIsEditMode] = useState(false);

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

  const handleSave = () => {
    updateNotaryProfile({
      fullName,
      email,
      phone,
      licenseNumber,
      commissionExpiry,
      serviceArea,
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
  };

  const handleUpdatePassword = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }

    addActivity({
      title: "Password Updated",
      description: "Your security credentials have been updated.",
      time: "Just Now",
    });

    toast.success("Password updated successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
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
            <h1 className="text-[44px] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink-900">
              {fullName}
            </h1>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#d9f8e7] px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#138e59]">
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
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-6 flex items-center gap-3">
              <UserRound className="h-5 w-5 text-brand-600" />
              <div className="text-[24px] font-extrabold tracking-[-0.03em] text-ink-900">Personal Information</div>
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
              <div className="text-[24px] font-extrabold tracking-[-0.03em] text-ink-900">Professional Details</div>
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
            <div className="text-[24px] font-extrabold tracking-[-0.03em] text-ink-900">Security Settings</div>
            <div className="mt-6 space-y-5">
              <Input 
                label="CURRENT PASSWORD" 
                placeholder="••••••••" 
                type="password" 
                disabled={!isEditMode}
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="NEW PASSWORD" 
                placeholder="••••••••" 
                type="password" 
                disabled={!isEditMode}
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="CONFIRM NEW PASSWORD" 
                placeholder="••••••••" 
                type="password" 
                disabled={!isEditMode}
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Button
                variant="outline"
                disabled={!isEditMode}
                className="h-[44px] w-full rounded-[12px] border-[#dfe6f2] text-[14px] font-semibold text-brand-600 disabled:opacity-50"
                onClick={handleUpdatePassword}
              >
                Update Password
              </Button>
            </div>
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[24px] font-extrabold tracking-[-0.03em] text-ink-900">Notification Preferences</div>
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
          disabled={!isEditMode}
          className="h-[46px] rounded-[12px] px-8 text-[15px] font-semibold disabled:opacity-50"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
      <FooterBand />
    </div>
  );
}

export function NotaryCredentialsPage() {
  const { notaryProfile, updateNotaryProfile, notaryCredentials, addNotaryCredential, addActivity } = useStore();
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [viewingFile, setViewingFile] = useState<{ name: string; url: string } | null>(null);

  const convertToUSDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes("-")) return dateStr;
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  };

  const convertToISODate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes("/")) return dateStr;
    const [month, day, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Modal controls
  const [isUpdateInfoModalOpen, setIsUpdateInfoModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Update info form state
  const [updateForm, setUpdateForm] = useState({
    licenseNumber: notaryProfile.licenseNumber,
    commissionExpiry: convertToUSDate(notaryProfile.commissionExpiry),
    eoCoverage: notaryProfile.eoCoverage,
    backgroundScreeningStatus: notaryProfile.backgroundScreeningStatus,
    backgroundScreeningDetail: notaryProfile.backgroundScreeningDetail,
  });

  // Sync update form when profile changes
  useEffect(() => {
    setUpdateForm({
      licenseNumber: notaryProfile.licenseNumber,
      commissionExpiry: convertToUSDate(notaryProfile.commissionExpiry),
      eoCoverage: notaryProfile.eoCoverage,
      backgroundScreeningStatus: notaryProfile.backgroundScreeningStatus,
      backgroundScreeningDetail: notaryProfile.backgroundScreeningDetail,
    });
  }, [notaryProfile, isUpdateInfoModalOpen]);

  // Upload new credential form state
  const [uploadForm, setUploadForm] = useState({
    documentName: "",
    issuer: "",
    action: "Auto-Verified" as "Auto-Verified" | "Manual Review",
  });
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleSaveUpdate = () => {
    updateNotaryProfile({
      licenseNumber: updateForm.licenseNumber,
      commissionExpiry: convertToISODate(updateForm.commissionExpiry),
      eoCoverage: updateForm.eoCoverage,
      backgroundScreeningStatus: updateForm.backgroundScreeningStatus,
      backgroundScreeningDetail: updateForm.backgroundScreeningDetail,
    });

    addActivity({
      title: "Credentials Updated",
      description: `You successfully updated your primary commission info.`,
      time: "Just Now",
    });

    toast.success("Primary commission details saved successfully!");
    setIsUpdateInfoModalOpen(false);
  };

  const handleSaveUpload = () => {
    if (!uploadForm.documentName || !uploadForm.issuer) {
      toast.error("Please fill in the document name and issuer.");
      return;
    }

    const todayStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    addNotaryCredential({
      documentName: uploadForm.documentName,
      issuer: uploadForm.issuer,
      uploadDate: todayStr,
      action: uploadForm.action,
    });

    addActivity({
      title: "Credential Uploaded",
      description: `New credential "${uploadForm.documentName}" added to history.`,
      time: "Just Now",
    });

    toast.success(`Credential "${uploadForm.documentName}" successfully added to history ledger!`);
    setIsUploadModalOpen(false);
    
    // Reset form
    setUploadForm({
      documentName: "",
      issuer: "",
      action: "Auto-Verified",
    });
    setSelectedFileName("");
  };

  const formatExpiryDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (!dateStr.includes("-")) return dateStr;
    const [year, month, day] = dateStr.split("-");
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredCredentialHistory = notaryCredentials.filter((row) =>
    showOnlyVerified ? row.action === "Auto-Verified" : true,
  );

  const getScreeningBgColor = (status: "Pending" | "Verified" | "Failed") => {
    if (status === "Verified") return "bg-[#f3faf7] border-[#d1ebd7]";
    if (status === "Failed") return "bg-[#fff7f7] border-[#ecd1d1]";
    return "bg-[#f5f7fb] border-[#e4ebf5]";
  };

  const getScreeningIcon = (status: "Pending" | "Verified" | "Failed") => {
    if (status === "Verified") return <ShieldCheck className="h-5 w-5 text-success-600" />;
    if (status === "Failed") return <X className="h-5 w-5 text-danger-600" />;
    return <FileBadge2 className="h-5 w-5 text-[#b65d18]" />;
  };

  const getScreeningIconBg = (status: "Pending" | "Verified" | "Failed") => {
    if (status === "Verified") return "bg-[#e3fcf0]";
    if (status === "Failed") return "bg-[#ffebee]";
    return "bg-[#fff4eb]";
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="text-[44px] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink-900">
            Notary Credentials
          </h1>
          <p className="mt-2 text-[18px] leading-[1.7] text-ink-500">
            View your license and verification details
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="h-[48px] rounded-[14px] border-[#dfe6f2] px-5 text-[15px] font-semibold text-ink-700"
            onClick={() => setIsUpdateInfoModalOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Update information
          </Button>
          <Button 
            className="h-[48px] rounded-[14px] px-5 text-[15px] font-semibold shadow-[0_14px_32px_rgba(24,90,188,0.18)]"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Upload new credential
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.52fr]">
        <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#eaf0ff] text-brand-600">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <div className="text-[38px] font-extrabold tracking-[-0.04em] text-ink-900">Primary Commission</div>
                <div className="mt-2 text-[18px] text-ink-500">California Secretary of State</div>
              </div>
            </div>
            <Badge status="Verified" />
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Detail label="LICENSE NUMBER" value={notaryProfile.licenseNumber} />
            <Detail label="COMMISSION EXPIRY" value={formatExpiryDate(notaryProfile.commissionExpiry)} />
            <Detail label="E&O COVERAGE" value={notaryProfile.eoCoverage} />
          </div>
        </Surface>

        <Surface className={`rounded-[18px] border p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)] transition-colors duration-300 ${getScreeningBgColor(notaryProfile.backgroundScreeningStatus)}`}>
          <div className="mb-5 flex items-center justify-between">
            <div className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${getScreeningIconBg(notaryProfile.backgroundScreeningStatus)}`}>
              {getScreeningIcon(notaryProfile.backgroundScreeningStatus)}
            </div>
            <Badge status={notaryProfile.backgroundScreeningStatus} />
          </div>
          <div className="text-[30px] font-extrabold tracking-[-0.03em] text-ink-900">Background Screening</div>
          <div className="mt-4 text-[16px] leading-[1.8] text-ink-500 whitespace-pre-line">
            {notaryProfile.backgroundScreeningDetail}
          </div>
        </Surface>
      </div>

      <Surface className="overflow-hidden rounded-[18px] border border-[#e4ebf5] bg-white shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <div className="flex items-center justify-between px-6 py-6">
          <div className="text-[34px] font-extrabold tracking-[-0.04em] text-ink-900">Credential History</div>
          <button
            type="button"
            onClick={() => setShowOnlyVerified((current) => !current)}
            className="inline-flex items-center gap-2 text-[16px] font-medium text-ink-600"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-[#fbfcff] text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-300">
                {["Document Name", "Issuer", "Upload Date", "Verification", "Action"].map((header) => (
                  <th key={header} className="px-6 py-4">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCredentialHistory.map((row) => (
                <tr key={row.documentName} className="border-t border-[#edf1f7]">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#eef4ff] text-brand-600">
                        {row.action === "Auto-Verified" ? <ShieldCheck className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <span className="text-[16px] font-semibold text-ink-900">{row.documentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[15px] text-ink-600">{row.issuer}</td>
                  <td className="px-6 py-5 text-[15px] text-ink-600">{row.uploadDate}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[15px] text-ink-700">
                      <span className={`h-2 w-2 rounded-full ${row.action === "Auto-Verified" ? "bg-brand-600" : "bg-[#b96716]"}`} />
                      {row.action === "Auto-Verified" ? "Auto-Verified" : "Manual Review"}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      type="button"
                      onClick={() => setViewingFile({ name: row.documentName, url: "#" })}
                      className="text-brand-600 hover:text-brand-700"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-6 text-center text-[20px] font-extrabold uppercase tracking-[0.12em] text-brand-600">
          Load More Ledger Entries
        </div>
      </Surface>

      {/* Update Info Modal */}
      <Modal
        isOpen={isUpdateInfoModalOpen}
        onClose={() => setIsUpdateInfoModalOpen(false)}
        title="Update Primary Credentials"
        maxWidth="520px"
      >
        <div className="space-y-5 px-7 pb-7">
          <Input
            label="LICENSE NUMBER"
            value={updateForm.licenseNumber}
            onChange={(e) => setUpdateForm({ ...updateForm, licenseNumber: e.target.value })}
            className="h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] bg-[#f7f9fd]"
          />
          <Input
            label="COMMISSION EXPIRY"
            type="text"
            placeholder="MM/DD/YYYY"
            value={updateForm.commissionExpiry}
            onChange={(e) => setUpdateForm({ ...updateForm, commissionExpiry: e.target.value })}
            className="h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] bg-[#f7f9fd]"
          />
          <Input
            label="E&O COVERAGE"
            value={updateForm.eoCoverage}
            onChange={(e) => setUpdateForm({ ...updateForm, eoCoverage: e.target.value })}
            className="h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] bg-[#f7f9fd]"
          />
          <div>
            <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-500">
              BACKGROUND SCREENING STATUS
            </label>
            <select
              value={updateForm.backgroundScreeningStatus}
              onChange={(e) => setUpdateForm({ ...updateForm, backgroundScreeningStatus: e.target.value as any })}
              className="h-[48px] w-full rounded-[12px] border border-[#e2e8f3] bg-[#f7f9fd] px-4 text-[14px] text-ink-700 outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <Textarea
            label="BACKGROUND SCREENING DETAIL"
            value={updateForm.backgroundScreeningDetail}
            onChange={(e) => setUpdateForm({ ...updateForm, backgroundScreeningDetail: e.target.value })}
            className="rounded-[12px] border-[#e2e8f3] bg-[#f7f9fd] p-4 text-[14px]"
            rows={3}
          />
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="outline" onClick={() => setIsUpdateInfoModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUpdate}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Upload Credential Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload New Credential Document"
        maxWidth="520px"
      >
        <div className="space-y-5 px-7 pb-7">
          <Input
            label="DOCUMENT NAME"
            placeholder="e.g. E&O Policy, NNA Background Check"
            value={uploadForm.documentName}
            onChange={(e) => setUploadForm({ ...uploadForm, documentName: e.target.value })}
            className="h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] bg-[#f7f9fd]"
          />
          <Input
            label="ISSUER"
            placeholder="e.g. National Notary Association"
            value={uploadForm.issuer}
            onChange={(e) => setUploadForm({ ...uploadForm, issuer: e.target.value })}
            className="h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] bg-[#f7f9fd]"
          />
          <div>
            <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-500">
              VERIFICATION METHOD
            </label>
            <select
              value={uploadForm.action}
              onChange={(e) => setUploadForm({ ...uploadForm, action: e.target.value as any })}
              className="h-[48px] w-full rounded-[12px] border border-[#e2e8f3] bg-[#f7f9fd] px-4 text-[14px] text-ink-700 outline-none"
            >
              <option value="Auto-Verified">Auto-Verified</option>
              <option value="Manual Review">Manual Review</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-500">
              CREDENTIAL FILE
            </label>
            <div 
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-[18px] border-2 border-dashed border-[#ccd9f8] bg-[#f8faff] p-7 text-center cursor-pointer hover:bg-[#f0f4ff] transition-colors"
            >
              <CloudUpload className="h-10 w-10 text-brand-500 mb-3" />
              <div className="text-[15px] font-bold text-ink-900">
                {selectedFileName || "Choose document file or drag here"}
              </div>
              <div className="text-[13px] text-ink-500 mt-1">PDF, JPG, PNG up to 10MB</div>
              <input
                type="file"
                ref={fileRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedFileName(file.name);
                }}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUpload}>
              Add to Ledger
            </Button>
          </div>
        </div>
      </Modal>

      <DocumentViewer 
        isOpen={!!viewingFile}
        onClose={() => setViewingFile(null)}
        fileName={viewingFile?.name || ""}
        fileUrl={viewingFile?.url || ""}
      />
      <FooterBand />
    </div>
  );
}

export function NotaryCommunicationsPage() {
  const { chatMessages, addChatMessage } = useStore();
  const [draftMessage, setDraftMessage] = useState("");
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAdminTyping]);

  const sendMessage = () => {
    if (!draftMessage.trim()) return;

    const userMsg = {
      sender: "You (Notary)",
      role: "you" as const,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      body: draftMessage.trim(),
    };

    addChatMessage(userMsg);
    setDraftMessage("");

    // Simulate reactive, backend-ready replies from the Ops/Admin team
    setIsAdminTyping(true);

    setTimeout(() => {
      setIsAdminTyping(false);
      addChatMessage({
        sender: "Sarah Johnson",
        role: "admin" as const,
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        body: "Confirmed. Thanks for the quick update! I have notified the title officer. We will review the signature block and move the file forward. I'll post here as soon as it's completed.",
      });
    }, 2500); // 2.5 second delay
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.28fr_0.34fr] h-[calc(100vh-140px)] min-h-[500px] overflow-hidden">
      <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-0 shadow-[0_12px_30px_rgba(20,48,112,0.05)] flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#edf1f7] px-6 py-4 flex-shrink-0">
          <div className="text-[20px] font-bold tracking-tight text-ink-900">Communication Center</div>
          <div className="mt-1 text-[13px] text-ink-500">Chat with Closing Engage team regarding active files.</div>
        </div>

        {/* Message body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-slate-50/20">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-[#eef2f8] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-500">
              Today
            </div>
          </div>

          <div className="space-y-6">
            {chatMessages.map((message, idx) => (
              <div 
                key={`${message.sender}-${idx}-${message.body.slice(0, 10)}`} 
                className={message.role === "you" ? "ml-auto max-w-[76%]" : "max-w-[68%]"}
              >
                <div className={`mb-2 flex items-end gap-2.5 ${message.role === "you" ? "justify-end" : ""}`}>
                  {message.role === "admin" ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e6eeff] text-[10px] font-bold text-brand-600">
                      {message.sender.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                  ) : null}
                  <div className={`text-[13px] font-semibold text-ink-900 ${message.role === "you" ? "text-right" : ""}`}>
                    {message.sender}
                    <span className="ml-2 text-[11px] font-normal text-ink-400">{message.time}</span>
                  </div>
                  {message.role === "you" ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6ea8ff] text-[10px] font-bold text-white">
                      ME
                    </div>
                  ) : null}
                </div>
                <div className={`rounded-[16px] px-4 py-3 text-[14px] leading-relaxed ${
                  message.role === "you"
                    ? "bg-brand-600 text-white shadow-[0_8px_20px_rgba(24,90,188,0.12)]"
                    : "bg-[#f3f6fb] text-ink-700"
                }`}>
                  {message.body}
                </div>
              </div>
            ))}
            {isAdminTyping && (
              <div className="flex items-center gap-3 text-[13px] text-ink-500">
                <div className="flex gap-1 items-center justify-center py-1 pl-1">
                  <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce" />
                </div>
                <span className="font-medium text-ink-400">Sarah Johnson is typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input box area */}
        <div className="border-t border-[#edf1f7] px-6 py-4 bg-white flex-shrink-0">
          <div className="flex items-center gap-4 rounded-xl border border-[#dfe6f2] bg-[#f7f9fd] px-4 py-3.5 focus-within:border-brand-300 focus-within:bg-white transition-all duration-200 shadow-sm">
            <Paperclip className="h-4.5 w-4.5 text-ink-500 hover:text-brand-600 cursor-pointer" />
            <input
              value={draftMessage}
              onChange={(event) => setDraftMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
              className="flex-1 bg-transparent text-[14px] text-ink-700 outline-none placeholder:text-ink-400"
              placeholder="Type a message..."
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!draftMessage.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-600 text-white shadow-[0_8px_16px_rgba(24,90,188,0.14)] hover:bg-brand-700 disabled:opacity-40 disabled:hover:translate-y-0 disabled:shadow-none transition-all flex-shrink-0"
              aria-label="Send message"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[12px] text-ink-500">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
            Your messages are encrypted end-to-end.
          </div>
        </div>
      </Surface>

      <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-5 shadow-[0_12px_30px_rgba(20,48,112,0.05)] flex flex-col justify-between h-full">
        <div>
          <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-brand-600">
            Active File Context
          </div>
          <div className="mt-3.5 h-px bg-[#edf1f7]" />
          <div className="mt-4 space-y-4 text-[13px]">
            <div>
              <div className="text-ink-400">File Number</div>
              <div className="mt-1 text-[16px] font-semibold text-ink-900">CE-99283-SL</div>
            </div>
            <div>
              <div className="text-ink-400">Principal Signer</div>
              <div className="mt-1 text-[16px] font-semibold text-ink-900">Robert J. Smith</div>
            </div>
            <div>
              <div className="text-ink-400">Current Status</div>
              <div className="mt-2.5"><Badge status="Pending Review" /></div>
            </div>
          </div>
        </div>
        <Link to="/notary/orders/CE-99283-SL">
          <Button variant="outline" className="mt-6 h-[40px] w-full rounded-[10px] border-[#bfd1f6] text-[13px] font-semibold text-brand-600">
            View Full Dossier
          </Button>
        </Link>
      </Surface>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400">{label}</div>
      <div className="mt-2 text-[16px] font-semibold text-ink-900">{value}</div>
    </div>
  );
}
