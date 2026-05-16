import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleDot, Download, Eye, FileText, FolderKanban, Hourglass, Info, MapPin, Pencil, Plus, Printer, RotateCw, Search, ShieldCheck, SlidersHorizontal, Trash2, UserPlus, ZoomIn, ZoomOut } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Input, Modal, Select, Surface, Textarea } from "@/components/common";
import { DocumentViewer } from "@/components/DocumentViewer";
import { useStore } from "@/store/useStore";
import type { TeamMember } from "@/types/models";
import { toast } from "@/store/useToastStore";
import { useConfirmStore } from "@/store/useConfirmStore";
import { cn } from "@/lib/utils";

export function CompanyDashboardPage() {
  const { companyOrders, recentActivities, clearActivities } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    // Simulate high-fidelity REST API fetch delay for backend-readiness
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleClear = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearActivities();
      setIsClearing(false);
      toast.success("Notifications cleared successfully!");
    }, 500); // 500ms matching transition duration
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
            <div className="mt-2 text-[46px] font-extrabold leading-none tracking-[-0.05em] text-ink-900">
              {value}
            </div>
          </Surface>
        ))}
      </div>

      <Surface className="overflow-hidden rounded-[18px] border border-[#e4ebf5] bg-white shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <div className="flex items-center justify-between px-7 py-6">
          <h2 className="text-[30px] font-extrabold tracking-[-0.04em] text-ink-900">Recent Orders</h2>
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
            <h2 className="text-[30px] font-extrabold tracking-[-0.04em] text-ink-900">Order Status Overview</h2>
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
          <h2 className="text-[30px] font-extrabold tracking-[-0.04em] text-ink-900">Recent Activities</h2>
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
              <div className={`space-y-6 flex-1 flex flex-col justify-start transition-all duration-500 ease-in-out ${isClearing ? "opacity-0 -translate-y-4 scale-95 blur-[2px]" : "opacity-100 translate-y-0 scale-100"}`}>
                {activityItems.map(({ title, description, time, icon: Icon, tone }) => (
                  <div key={title} className="flex items-start gap-4">
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
                      <div className="text-[15px] font-bold leading-[1.45] text-ink-900">{title}</div>
                      <div className="mt-1 text-[14px] leading-[1.6] text-ink-500">{description}</div>
                      <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">{time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button 
            type="button"
            onClick={handleClear}
            disabled={recentActivities.length === 0 || isClearing}
            className="mt-9 h-[48px] w-full rounded-[12px] border border-[#e4ebf5] bg-white text-[14px] font-semibold text-ink-500 transition-colors hover:bg-[#f8fafe] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isClearing ? "Clearing..." : "Clear Notifications"}
          </button>
        </Surface>
      </div>
    </div>
  );
}

export function CompanyOrdersPage() {
  const { companyOrders } = useStore();
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
          <h1 className="text-[44px] font-extrabold leading-[1.02] tracking-[-0.045em] text-brand-600">
            Orders
          </h1>
          <p className="mt-2 text-[18px] leading-[1.7] text-ink-500">
            Manage and track all your closing orders
          </p>
        </div>
        <Link to="/company/orders/new">
          <Button className="h-[48px] rounded-[14px] px-5 text-[15px] font-semibold shadow-[0_14px_32px_rgba(24,90,188,0.18)]">
            <Plus className="mr-2 h-4 w-4" />
            Create New Order
          </Button>
        </Link>
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
            <div className="mt-2 text-[46px] font-extrabold leading-none tracking-[-0.05em] text-ink-900">
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

export function CompanyOrdersNewPage() {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    date: "",
    loanType: "",
    scanbacks: "No",
    preferredNotary: "No preference",
    specialInstructions: "",
    priority: "Normal Processing"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const appendFiles = (files: FileList | File[]) => {
    const acceptedFiles = Array.from(files).filter((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return extension === "pdf" || extension === "docx";
    });

    if (acceptedFiles.length === 0) return;

    setUploadedFiles((current) => [...current, ...acceptedFiles]);
  };

  const handleFilePicker = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    appendFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (!event.dataTransfer.files?.length) return;
    appendFiles(event.dataTransfer.files);
  };

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles((current) => current.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.clientName || !formData.address) {
      toast.error("Order Title, Client Name, and Property Address are required.");
      return;
    }

    const newOrder = {
       id: "#ORD-" + (Math.floor(Math.random() * 90000) + 10000),
       clientName: formData.clientName,
       propertyAddress: `${formData.address}${formData.city ? ", " + formData.city : ""}${formData.state ? ", " + formData.state : ""} ${formData.zip}`,
       status: "Received",
       notary: formData.preferredNotary === "No preference" ? "--" : formData.preferredNotary,
       date: formData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    // Add order to global store
    useStore.getState().addCompanyOrder(newOrder as any);

    // Add uploaded files to global documents store
    uploadedFiles.forEach((file) => {
      const docRecord = {
        id: "DOC-" + (Math.floor(Math.random() * 90000) + 10000),
        name: file.name,
        orderId: newOrder.id.replace("#", ""),
        uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        status: "Submitted" as const,
        uploadedBy: "Alex Sterling"
      };
      useStore.getState().addCompanyDocument(docRecord);
    });

    // Push dynamic activity/notification entry
    useStore.getState().addActivity({
      title: "New Order Created",
      description: `Order ${newOrder.id} has been successfully created for ${formData.clientName}.`,
      time: "Just now"
    });

    toast.success("Order created successfully!");
    navigate("/company/orders");
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-300">
            Orders <span className="mx-1 text-ink-200">•</span> Create New Order
          </div>
          <div className="mt-4">
            <h1 className="text-[42px] font-extrabold leading-[1.04] tracking-[-0.045em] text-ink-900">
              Create New Order
            </h1>
            <p className="mt-2 text-[17px] leading-[1.7] text-ink-500">
              Fill in the details below to initiate a new title closing process.
            </p>
          </div>
        </div>
        <Link to="/company/orders">
          <Button
            variant="outline"
            className="h-[46px] rounded-[12px] border-[#dfe6f2] px-5 text-[14px] font-semibold text-ink-700 shadow-[0_10px_24px_rgba(20,48,112,0.04)] hover:border-brand-200 hover:bg-[#f8fbff]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-7 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef4ff] text-brand-600">
              <CircleDot className="h-4 w-4" />
            </div>
            <div className="text-[20px] font-extrabold text-ink-900">Order Information</div>
          </div>
          <div className="grid gap-5">
            <Input 
              label="ORDER TITLE *" 
              placeholder="e.g. 452 Oak Street Refinance" 
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white px-4 text-[14px]" 
            />
            <div className="grid gap-5 md:grid-cols-2">
              <Input 
                label="CLIENT NAME *" 
                placeholder="Full legal name" 
                value={formData.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
                className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white px-4 text-[14px]" 
              />
              <Input 
                label="PROPERTY ADDRESS *" 
                placeholder="Street address" 
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white px-4 text-[14px]" 
              />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <Input 
                label="CITY" 
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white px-4 text-[14px]" 
              />
              <Select 
                label="STATE" 
                options={["Select State", "TX", "CA", "NY"]} 
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white" 
              />
              <Input 
                label="ZIP" 
                value={formData.zip}
                onChange={(e) => handleInputChange("zip", e.target.value)}
                className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white px-4 text-[14px]" 
              />
            </div>
            <Input 
              label="SIGNING DATE & TIME" 
              placeholder="mm/dd/yyyy" 
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white px-4 text-[14px]" 
            />
            <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
              <div>
                <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-500">Loan Details</div>
                <Select 
                  label="LOAN TYPE" 
                  options={["Select a loan type", "Refinance", "Purchase", "HELOC"]} 
                  value={formData.loanType}
                  onChange={(e) => handleInputChange("loanType", e.target.value)}
                  className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-[#f7faff]" 
                />
              </div>
              <div>
                <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-500">Requirements</div>
                <div className="rounded-[16px] border border-[#e4ebf5] bg-white px-5 py-4">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-500">SCAN BACKS REQUIRED</div>
                  <div className="mt-4 flex gap-6 text-[14px] text-ink-700">
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="scanbacks" 
                        checked={formData.scanbacks === "Yes"}
                        onChange={() => handleInputChange("scanbacks", "Yes")}
                      />
                      Yes, required
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="scanbacks" 
                        checked={formData.scanbacks === "No"}
                        onChange={() => handleInputChange("scanbacks", "No")}
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Surface>

        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-7 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef4ff] text-brand-600">
                <FileText className="h-4 w-4" />
              </div>
              <div className="text-[20px] font-extrabold text-ink-900">Instructions</div>
            </div>
            <div className="grid gap-5">
              <Select 
                label="PREFERRED NOTARY (OPTIONAL)" 
                options={["No preference", "David Miller", "Robert Vance", "Elena Wright", "Gordon Cole"]} 
                value={formData.preferredNotary}
                onChange={(e) => handleInputChange("preferredNotary", e.target.value)}
                className="h-[48px] rounded-[12px] border-[#dfe6f2] bg-white" 
              />
              <div className="-mt-2 text-[11px] text-ink-400">
                Leave empty to auto-assign the best available notary in the area.
              </div>
              <Textarea
                label="SPECIAL INSTRUCTIONS"
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                placeholder="Enter any specific requirements, gate codes, or client preferences..."
                className="min-h-[120px] rounded-[12px] border-[#dfe6f2] bg-white px-4 py-3 text-[14px]"
              />
            </div>
          </Surface>

          <div className="rounded-[18px] bg-brand-600 p-6 text-white shadow-[0_18px_38px_rgba(24,90,188,0.18)]">
            <div className="text-[20px] font-extrabold">Order Priority</div>
            <div className="mt-6 space-y-5 text-[14px]">
              <label className="flex items-start gap-3">
                <input 
                  type="radio" 
                  name="priority" 
                  className="mt-1" 
                  checked={formData.priority === "Normal Processing"}
                  onChange={() => handleInputChange("priority", "Normal Processing")}
                />
                <span>
                  <span className="font-semibold">Normal Processing</span>
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input 
                  type="radio" 
                  name="priority" 
                  className="mt-1" 
                  checked={formData.priority === "Urgent Request"}
                  onChange={() => handleInputChange("priority", "Urgent Request")}
                />
                <span>
                  <span className="font-semibold">Urgent Request</span>
                  <br />
                  <span className="text-white/72">Guaranteed 4-hour assignment</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-7 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef4ff] text-brand-600">
              <FileText className="h-4 w-4" />
            </div>
            <div className="text-[20px] font-extrabold text-ink-900">Supporting Documents</div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={handleFilePicker}
          />
          <div
            className={`rounded-[16px] border border-dashed px-6 py-10 text-center transition-colors ${
              isDragActive
                ? "border-brand-300 bg-[#f5f9ff]"
                : "border-[#dfe6f2] bg-[#fcfdff]"
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragActive(true);
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragActive(false);
            }}
            onDrop={handleDrop}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#eef4ff] text-brand-600">
              <Download className="h-5 w-5 rotate-180" />
            </div>
            <div className="mt-5 text-[14px] font-semibold text-ink-900">Drag & drop files here</div>
            <div className="mt-1 text-[12px] leading-[1.7] text-ink-400">Accepts PDF, DOCX up to 25MB</div>
            <Button
              type="button"
              variant="outline"
              className="mt-5 h-[38px] rounded-[10px] px-4 text-[12px] font-bold"
              onClick={() => fileInputRef.current?.click()}
            >
              Or Browse Files
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {uploadedFiles.length === 0 ? (
              <div className="rounded-[14px] border border-dashed border-[#edf1f7] px-4 py-4 text-[13px] text-ink-400">
                No files uploaded yet.
              </div>
            ) : null}
            {uploadedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-[14px] bg-[#fff7f6] px-4 py-4 text-sm">
                <div>
                  <span className="font-semibold text-ink-900">{file.name}</span>
                  <br />
                  <span className="text-ink-400">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB • Uploaded just now
                  </span>
                </div>
                <button type="button" onClick={() => removeFile(index)} aria-label={`Remove ${file.name}`}>
                  <Trash2 className="h-4 w-4 text-danger-600" />
                </button>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-[10px] border border-[#f3d7d7] bg-white px-5 py-2.5 text-[14px] font-semibold text-danger-600 hover:bg-[#fff6f6]">
          Cancel
        </Button>
        <Button
          className="h-[44px] rounded-[10px] px-6 text-[14px] font-semibold"
          onClick={handleSubmit}
        >
          Submit Order
        </Button>
      </div>
    </div>
  );
}

export function CompanyOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { companyOrders, updateCompanyOrder, companyDocuments } = useStore();
  
  const order = companyOrders.find(o => o.id.replace("#", "") === id) || companyOrders[0];
  const docs = companyDocuments.filter(d => d.orderId === order.id.replace("#", ""));

  const notaryInfo = order.notary === "--"
    ? { name: "Not Assigned", email: "support@closingengage.com", phone: "(555) 000-0000", closings: 0, avatar: "?", serviceArea: "N/A", specialty: "N/A" }
    : {
        name: order.notary,
        email: `${order.notary.toLowerCase().replace(" ", ".")}@closingengage.com`,
        phone: "(555) 012-3456",
        closings: 93,
        avatar: order.notary.split(" ").map(n => n[0]).join(""),
        serviceArea: "Dallas, Fort Worth, Arlington",
        specialty: "Purchase, Refinance, HELOC"
      };

  const [showNotaryProfile, setShowNotaryProfile] = useState(false);
  const [viewingFile, setViewingFile] = useState<{ name: string; url: string } | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [clientName, setClientName] = useState("");
  const [signingDate, setSigningDate] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("Client requested an evening signing. Please confirm notary availability for late pickup.");

  useEffect(() => {
    if (order) {
      setClientName(order.clientName);
      setSigningDate(order.date);
      setPropertyAddress(order.propertyAddress);
    }
  }, [order, isEditing]);

  const statuses = ["Received", "Assigned", "Under Review", "Approved", "Completed"];
  const currentIdx = statuses.indexOf(order.status);
  
  const orderTimeline = statuses.map((s, idx) => ({
    title: s,
    body: idx < currentIdx ? "Completed" : idx === currentIdx ? "Current Stage" : "Pending",
    active: idx <= currentIdx,
    current: idx === currentIdx
  }));

  const activityLog = [
    ["Review completed", "Final review by Compliance Team finished.", "Today, 2:45 PM"],
    ["Documents uploaded", "New version of Title Insurance form added.", "Yesterday, 10:15 AM"],
    ["Notary assigned", `${order.notary === "--" ? "A notary" : order.notary} has been assigned to this order.`, order.date],
  ] as const;

  return (
    <>
    <div className="space-y-6">
      <div className="text-[12px] text-ink-400">
        <span>Orders</span>
        <span className="mx-2 text-ink-300">›</span>
        <span className="font-semibold text-brand-600">Order Details</span>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-4">
          <h1 className="text-[46px] font-extrabold leading-none tracking-[-0.05em] text-ink-900">
            Order {order.id}
          </h1>
          <Badge status={order.status as any} />
        </div>
        <Link to="/company/orders">
          <Button
            variant="outline"
            className="h-[46px] rounded-[12px] border-[#dfe6f2] px-5 text-[14px] font-semibold text-ink-700 shadow-[0_10px_24px_rgba(20,48,112,0.04)] hover:border-brand-200 hover:bg-[#f8fbff]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.52fr]">
        <div className="space-y-6">
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-7 flex items-center justify-between">
              <div className="text-[28px] font-extrabold tracking-[-0.03em] text-ink-900">Order Information</div>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-[13px] font-semibold uppercase tracking-[0.08em] text-brand-600 hover:text-brand-700 transition-colors"
                >
                  Edit Info
                </button>
              )}
            </div>
            {isEditing ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  updateCompanyOrder(order.id, {
                    clientName,
                    date: signingDate,
                    propertyAddress,
                  });
                  setIsEditing(false);
                  toast.success("Order information updated successfully!");
                }}
                className="space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400 mb-2">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="h-[48px] w-full rounded-[12px] border border-[#dfe6f2] px-4 text-[15px] text-ink-700 outline-none focus:border-brand-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400 mb-2">
                      Signing Date & Time
                    </label>
                    <input
                      type="text"
                      value={signingDate}
                      onChange={(e) => setSigningDate(e.target.value)}
                      className="h-[48px] w-full rounded-[12px] border border-[#dfe6f2] px-4 text-[15px] text-ink-700 outline-none focus:border-brand-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400 mb-2">
                      Property Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-brand-600" />
                      <input
                        type="text"
                        value={propertyAddress}
                        onChange={(e) => setPropertyAddress(e.target.value)}
                        className="h-[48px] w-full rounded-[12px] border border-[#dfe6f2] pl-11 pr-4 text-[15px] text-ink-700 outline-none focus:border-brand-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-600 mb-2">
                      Special Instructions
                    </label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      rows={3}
                      className="w-full rounded-[12px] border border-[#dfe6f2] p-4 text-[14px] text-ink-700 outline-none focus:border-brand-500 transition-colors bg-[#f5f8fe] italic"
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-3 border-t border-[#e5ebf5] pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-[42px] rounded-[10px]"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-[42px] rounded-[10px]"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                <Detail label="CLIENT NAME" value={order.clientName} />
                <Detail label="SIGNING DATE & TIME" value={`${order.date}, 2:45 PM`} />
                <div className="md:col-span-2">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400">
                    PROPERTY ADDRESS
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[16px] font-semibold text-ink-900">
                    <MapPin className="h-4 w-4 text-brand-600" />
                    {order.propertyAddress}
                  </div>
                </div>
                <div className="md:col-span-2 rounded-[14px] bg-[#f5f8fe] px-5 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-600">
                    Special Instructions
                  </div>
                  <div className="mt-3 text-[14px] italic leading-[1.75] text-ink-500">
                    "{specialInstructions}"
                  </div>
                </div>
              </div>
            )}
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef4ff] text-brand-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="text-[28px] font-extrabold tracking-[-0.03em] text-ink-900">Documents</div>
              </div>
              <div className="text-[13px] font-semibold text-brand-600">2 Files Total</div>
            </div>
            <div className="space-y-4">
              {docs.length > 0 ? docs.map((document, index) => (
                <div key={`${document.name}-${index}`} className="flex items-center gap-4 rounded-[14px] bg-[#fbfbff] px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff1f1] text-danger-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[15px] font-semibold text-ink-900">{document.name}</div>
                    <div className="mt-1 text-[12px] text-ink-400">Uploaded {document.uploadDate} • {document.size}</div>
                  </div>
                  <button 
                    onClick={() => setViewingFile({ name: document.name, url: "#" })}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-brand-600 hover:bg-brand-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              )) : (
                <div className="text-center py-6 text-ink-400 text-sm">No documents uploaded yet</div>
              )}
            </div>
          </Surface>

          <DocumentViewer 
            isOpen={!!viewingFile}
            onClose={() => setViewingFile(null)}
            fileName={viewingFile?.name || ""}
            fileUrl={viewingFile?.url || ""}
          />

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef4ff] text-brand-600">
                <CircleDot className="h-4 w-4" />
              </div>
              <div className="text-[28px] font-extrabold tracking-[-0.03em] text-ink-900">Activity Log</div>
            </div>
            <div className="space-y-7">
              {activityLog.map(([title, body, time], index) => (
                <div key={title} className="relative pl-8">
                  {index < activityLog.length - 1 ? (
                    <div className="absolute left-[7px] top-5 h-[calc(100%+18px)] w-px bg-[#dbe4f1]" />
                  ) : null}
                  <div className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600" />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[17px] font-bold text-ink-900">{title}</div>
                      <div className="mt-2 text-[14px] leading-[1.7] text-ink-500">{body}</div>
                    </div>
                    <div className="shrink-0 text-[12px] font-semibold text-ink-400">{time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        </div>

        <div className="space-y-6">
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[14px] font-semibold uppercase tracking-[0.08em] text-ink-400">Assigned Notary</div>
            <div className="mt-5 flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-[12px] bg-[linear-gradient(135deg,#7a523f,#d0b38d)] flex items-center justify-center text-white font-bold text-xl">
                {notaryInfo.avatar}
              </div>
              <div>
                <div className="text-[22px] font-extrabold tracking-[-0.03em] text-ink-900">{notaryInfo.name}</div>
                <div className="mt-1 text-[13px] text-ink-500">4.9 <span className="mx-1 text-[#f0a11d]">★</span> ({notaryInfo.closings} Closings)</div>
              </div>
            </div>
            <div className="mt-6 space-y-4 text-[14px]">
              <div className="flex items-center justify-between">
                <span className="text-ink-400">Phone</span>
                <span className="font-semibold text-ink-700">{notaryInfo.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-400">Status</span>
                <span className="font-semibold text-[#26b15f]">• Available</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowNotaryProfile(true)}
              disabled={order.notary === "--"}
              className="mt-6 h-[42px] w-full rounded-[12px] bg-[#f4f7fc] text-[14px] font-semibold text-brand-600 transition-colors hover:bg-[#edf3fe] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              View Full Profile
            </button>
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-[#f6f6fd] p-7 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="text-[28px] font-extrabold tracking-[-0.03em] text-ink-900">Order Status</div>
            <div className="mt-7 space-y-6">
              {orderTimeline.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => {
                    updateCompanyOrder(order.id, { status: item.title as any });
                    toast.success(`Order status successfully updated to '${item.title}'!`);
                  }}
                  className="relative pl-10 w-full text-left block focus:outline-none group transition-transform active:scale-[0.98]"
                >
                  {index < orderTimeline.length - 1 ? (
                    <div className={`absolute left-[13px] top-7 h-[calc(100%+12px)] w-[2px] ${item.active ? "bg-brand-600" : "bg-[#d6dbe7]"}`} />
                  ) : null}
                  <div
                    className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors ${
                      item.current
                        ? "border-brand-600 bg-white group-hover:bg-brand-50"
                        : item.active
                          ? "border-brand-600 bg-brand-600 group-hover:bg-brand-700"
                          : "border-[#cfd5e1] bg-white group-hover:border-brand-400"
                    }`}
                  >
                    {item.current ? <div className="h-2.5 w-2.5 rounded-full bg-brand-600" /> : null}
                  </div>
                  <div className={`text-[22px] font-extrabold tracking-[-0.03em] transition-colors ${item.active ? "text-ink-900 group-hover:text-brand-600" : "text-ink-300 group-hover:text-ink-400"}`}>
                    {item.title}
                  </div>
                  <div className={`mt-1 text-[13px] transition-colors ${item.current ? "font-semibold text-brand-600" : item.active ? "text-ink-500" : "text-ink-300"}`}>
                    {item.body}
                  </div>
                </button>
              ))}
            </div>
          </Surface>
        </div>
      </div>
    </div>
      <Modal
        isOpen={showNotaryProfile}
        onClose={() => setShowNotaryProfile(false)}
        title={order.notary === "--" ? "No Notary Assigned" : order.notary}
        subtitle="Certified mobile notary supporting purchase, refinance, and seller-side closings."
        maxWidth="560px"
      >
        <div className="px-7 pb-8">
          <div className="flex items-center gap-4 rounded-[18px] bg-[#f8fbff] p-5">
            <div className="h-18 w-18 overflow-hidden rounded-[16px] bg-[linear-gradient(135deg,#7a523f,#d0b38d)] flex items-center justify-center text-white font-bold text-2xl">
              {notaryInfo.avatar}
            </div>
            <div>
              <div className="text-[18px] font-bold text-ink-900">{notaryInfo.name}</div>
              <div className="mt-1 text-[14px] text-ink-500">4.9 rating • {notaryInfo.closings} closings completed</div>
              <div className="mt-1 text-[14px] font-semibold text-[#26b15f]">Available for assignment</div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Detail label="PHONE" value={notaryInfo.phone} />
            <Detail label="EMAIL" value={notaryInfo.email} />
            <Detail label="SERVICE AREA" value={notaryInfo.serviceArea} />
            <Detail label="SPECIALTY" value={notaryInfo.specialty} />
          </div>

          <div className="mt-6 rounded-[16px] bg-[#f8fbff] px-5 py-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-400">
              Professional Summary
            </div>
            <div className="mt-3 text-[14px] leading-[1.75] text-ink-500">
              Experienced signing agent with strong borrower communication, same-day scanback accuracy, and consistent performance across high-volume residential closing packages.
            </div>
          </div>

          <div className="mt-7 flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-[12px] border-[#dfe6f2] px-5 text-[14px] font-semibold text-ink-700"
              onClick={() => setShowNotaryProfile(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function CompanyDocumentsPage() {
  const { companyDocuments } = useStore();
  const [docSearch, setDocSearch] = useState("");
  const [docStatusFilter, setDocStatusFilter] = useState<"All" | "Approved" | "Pending">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingFile, setViewingFile] = useState<{ name: string; url: string } | null>(null);
  const itemsPerPage = 10;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [docSearch, docStatusFilter]);

  const filteredDocs = companyDocuments.filter((doc) => {
    const matchesSearch =
      docSearch.trim() === "" ||
      doc.name.toLowerCase().includes(docSearch.toLowerCase()) ||
      doc.orderId.toLowerCase().includes(docSearch.toLowerCase());
    const matchesStatus = docStatusFilter === "All" || doc.status === docStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const paginatedDocs = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[44px] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink-900">
          Documents
        </h1>
        <p className="mt-2 text-[18px] leading-[1.7] text-ink-500">
          Access and download your approved files
        </p>
      </div>
      <Surface className="rounded-[18px] border border-[#e4ebf5] bg-[#f9fbff] p-4 shadow-[0_12px_30px_rgba(20,48,112,0.04)]">
        <div className="grid gap-4 lg:grid-cols-[1.55fr_0.4fr_0.4fr_54px]">
          <div className="flex h-[50px] items-center gap-3 rounded-[14px] border border-[#e5ebf5] bg-white px-4 text-sm text-ink-700">
            <Search className="h-4 w-4 shrink-0 text-ink-300" />
            <input
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              placeholder="Search by File Name or Order ID"
              className="w-full bg-transparent outline-none"
            />
          </div>
          <Select 
            value={docStatusFilter}
            onChange={(e) => setDocStatusFilter(e.target.value as any)}
            options={["All", "Approved", "Pending"]} 
            className="h-[50px] rounded-[14px] border-[#e5ebf5] bg-white" 
          />
          <Select 
            options={["Date: Any time", "Last 7 Days", "Last 30 Days", "This Year"]} 
            className="h-[50px] rounded-[14px] border-[#e5ebf5] bg-white" 
          />
          <button onClick={() => { setDocSearch(""); setDocStatusFilter("All"); }} className="flex h-[50px] items-center justify-center rounded-[14px] border border-[#e5ebf5] bg-white text-brand-600 transition-colors hover:bg-[#f5f8ff]">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </Surface>

      <Surface className="overflow-hidden rounded-[18px] border border-[#e4ebf5] bg-white shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-300">
                {["File Name", "Order ID", "Uploaded Date", "File Size", "Status", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-4">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedDocs.map((doc) => (
                <tr key={doc.id} className="border-t border-[#edf1f7] hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#fff3f3] text-danger-600 shadow-sm">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="text-[16px] font-semibold text-ink-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[15px] font-medium text-ink-600">{doc.orderId}</td>
                  <td className="px-6 py-5 text-[15px] text-ink-600">{doc.uploadDate}</td>
                  <td className="px-6 py-5 text-[15px] text-ink-600">{doc.size}</td>
                  <td className="px-6 py-5"><Badge status={doc.status} /></td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-5 text-brand-600">
                      <button 
                        type="button"
                        onClick={() => setViewingFile({ name: doc.name, url: "#" })}
                        className="hover:text-brand-700 transition-colors"
                        aria-label={`View ${doc.name}`}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => toast.info(`Downloading ${doc.name}...`)}
                        className="hover:text-brand-700 transition-colors"
                        aria-label={`Download ${doc.name}`}
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#edf1f7] px-6 py-5 text-sm text-ink-500">
          <span>
            Showing <span className="font-bold text-ink-900">{Math.min(filteredDocs.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredDocs.length, currentPage * itemsPerPage)}</span> of <span className="font-bold text-ink-900">{filteredDocs.length}</span> documents
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

      <DocumentViewer 
        isOpen={!!viewingFile}
        onClose={() => setViewingFile(null)}
        fileName={viewingFile?.name || ""}
        fileUrl={viewingFile?.url || ""}
      />
    </div>
  );
}

export function CompanyDocumentsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { companyDocuments } = useStore();
  const doc = companyDocuments.find((d) => d.id === id) || companyDocuments[0];

  const [zoom, setZoom] = useState(100);
  const [previewPage, setPreviewPage] = useState(1);
  const totalPreviewPages = 5;

  const handlePrint = () => {
    toast.info("Preparing document for print...");
    setTimeout(() => window.print(), 1000);
  };

  const handleDownload = () => {
    toast.success(`Started downloading: ${doc.name}`);
    // Simulate a real download experience
    const dummyBlob = new Blob(["Mock PDF Content"], { type: "application/pdf" });
    const url = window.URL.createObjectURL(dummyBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", doc.name);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-8 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Link to="/company/documents" className="inline-flex items-center gap-2 text-[14px] font-semibold text-brand-600">
              <ChevronLeft className="h-4 w-4" />
              Back to Documents
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <h1 className="text-[44px] font-extrabold tracking-[-0.045em] text-ink-900">
                {doc.name}
              </h1>
              <Badge status={doc.status} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-[16px] text-ink-500">
              <FileText className="h-4 w-4" />
              Order ID: {doc.orderId}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handlePrint} variant="outline" className="h-[50px] rounded-[12px] border-[#dfe6f2] px-6 text-[15px] font-semibold">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button onClick={handleDownload} className="h-[50px] rounded-[12px] px-6 text-[15px] font-semibold">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </Surface>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="flex items-center justify-between text-[15px] text-ink-600">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setZoom(prev => Math.max(50, prev - 10))}
                  className="flex items-center gap-2 font-semibold text-ink-700 hover:text-brand-600 transition-colors"
                >
                  <ZoomOut className="h-4 w-4" />
                  {zoom}%
                </button>
                <button 
                  onClick={() => setZoom(prev => Math.min(200, prev + 10))}
                  className="text-ink-500 hover:text-brand-600 transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-5">
                <button 
                  disabled={previewPage === 1}
                  onClick={() => setPreviewPage(p => p - 1)}
                  className="text-ink-500 hover:text-brand-600 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-3">
                  <span>Page</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#f4f7fc] font-bold text-ink-900 border border-[#e5ebf5]">{previewPage}</span>
                  <span>of {totalPreviewPages}</span>
                </div>
                <button 
                  disabled={previewPage === totalPreviewPages}
                  onClick={() => setPreviewPage(p => p + 1)}
                  className="text-ink-500 hover:text-brand-600 disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-6">
                <button onClick={() => toast.info("Searching document...")} className="text-ink-500 hover:text-brand-600 transition-colors">
                  <Search className="h-4 w-4" />
                </button>
                <button onClick={() => { setZoom(100); setPreviewPage(1); }} className="text-ink-500 hover:text-brand-600 transition-colors">
                  <RotateCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Surface>

          <Surface className="printable-document rounded-[22px] border border-[#dfe6f2] bg-[#edf2f8] p-10 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mx-auto min-h-[1180px] max-w-[820px] bg-white px-12 py-12 shadow-[0_18px_38px_rgba(20,48,112,0.08)]">
              <div className="relative">
                <div className="mb-12 flex justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-brand-600" />
                    <div className="text-xl font-bold tracking-tight text-ink-900">Closing Engage</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-ink-400">DOCUMENT ID</div>
                    <div className="text-sm font-semibold text-ink-700">{doc.id}-{doc.orderId}</div>
                  </div>
                </div>
                <div className="border-b border-ink-100 pb-8">
                  <h2 className="text-3xl font-extrabold text-ink-900">{doc.name.replace(".pdf", "").replace(/_/g, " ")}</h2>
                  <p className="mt-2 text-sm text-ink-500">Official Record of Transaction • {doc.uploadDate}</p>
                </div>
                <div className="mt-10 space-y-6">
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-ink-400">PARTIES INVOLVED</div>
                    <div className="grid grid-cols-2 gap-8">
                       <div className="rounded-xl border border-ink-100 bg-slate-50/50 p-4">
                         <div className="text-[10px] font-bold text-ink-400">ISSUER</div>
                         <div className="mt-1 font-bold text-ink-900">Estate Flux Title Company</div>
                       </div>
                       <div className="rounded-xl border border-ink-100 bg-slate-50/50 p-4">
                         <div className="text-[10px] font-bold text-ink-400">RECIPIENT</div>
                         <div className="mt-1 font-bold text-ink-900">Robert & Martha Henderson</div>
                       </div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-ink-400">LEGAL DISCLOSURE</div>
                    <p className="text-[13px] leading-[1.8] text-ink-600">
                      This document serves as an official record for the transaction associated with Order ID {doc.orderId}. 
                      The information contained herein is confidential and intended solely for the use of the individual 
                      or entity to whom they are addressed. If you have received this document in error, please notify 
                      the system manager.
                    </p>
                    <div className="h-3 w-full rounded-full bg-slate-100" />
                    <div className="h-3 w-[92%] rounded-full bg-slate-100" />
                    <div className="h-3 w-[84%] rounded-full bg-slate-100" />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.03]">
                  <div className="rotate-[-45deg] text-[140px] font-black tracking-tighter">
                    CONFIDENTIAL
                  </div>
                </div>
              </div>
            </div>
          </Surface>
        </div>

        <div className="space-y-6">
          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-6 flex items-center gap-3">
              <Info className="h-5 w-5 text-brand-600" />
              <div className="text-[28px] font-extrabold tracking-[-0.03em] text-ink-900">File Details</div>
            </div>
            <div className="space-y-6">
              <Detail label="FILE NAME" value={doc.name} />
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
                <Detail label="SIZE" value={doc.size} />
                <Detail label="STATUS" value={doc.status} valueClassName="text-brand-600" />
              </div>
              <Detail label="UPLOAD DATE" value={doc.uploadDate} />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400">UPLOADED BY</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef4ff] text-[11px] font-bold text-brand-600">
                    {doc.uploadedBy?.split(" ").pop()?.slice(0, 2).toUpperCase() || "NB"}
                  </div>
                  <div className="text-[16px] font-semibold text-ink-900">{doc.uploadedBy || "Notary Partner"}</div>
                </div>
              </div>
            </div>
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-6 flex items-center gap-3">
              <FolderKanban className="h-5 w-5 text-brand-600" />
              <div className="text-[28px] font-extrabold tracking-[-0.03em] text-ink-900">Order Information</div>
            </div>
            <div className="space-y-6">
              <Detail label="CLIENT NAME" value="Robert & Martha Henderson" />
              <Detail label="PROPERTY ADDRESS" value="123 Blue Oak Lane, Austin, TX 78701" />
            </div>
          </Surface>

          <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
            <div className="mb-6 flex items-center gap-3">
              <RotateCw className="h-5 w-5 text-brand-600" />
              <div className="text-[28px] font-extrabold tracking-[-0.03em] text-ink-900">Recent Activity</div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-brand-600 text-brand-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[16px] font-bold text-ink-900">Approved by Admin</div>
                  <div className="mt-1 text-[13px] text-ink-500">Oct 25, 2023 • 10:15 AM</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#d2d8e5] text-ink-400">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="text-[16px] font-bold text-ink-900">Uploaded by Notary</div>
                  <div className="mt-1 text-[13px] text-ink-500">Oct 24, 2023 • 04:30 PM</div>
                </div>
              </div>
            </div>
          </Surface>

          <div className="rounded-[18px] border border-[#cfdcf9] bg-[#edf3ff] px-6 py-5 text-[14px] leading-[1.7] text-brand-700 shadow-[0_12px_30px_rgba(20,48,112,0.04)]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                This document is available only after admin approval. Securely encrypted and stored according to industry standards.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompanyTeamPage() {
  const { teamMembers, addTeamMember, updateTeamMember, removeTeamMember } = useStore();
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedMemberRole, setSelectedMemberRole] = useState<"Admin" | "Member">("Admin");
  const [teamSearch, setTeamSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "Admin" | "Member">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Pending Invite">("All");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const { confirm } = useConfirmStore();

  const handleDeleteMember = (email: string) => {
    confirm({
      title: "Remove Team Member?",
      message: "Are you sure you want to remove this team member? This action cannot be undone.",
      confirmLabel: "Remove Member",
      type: "danger",
      onConfirm: () => {
        removeTeamMember(email);
        toast.success("Member successfully removed.");
      },
    });
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone || "");
    setSelectedMemberRole(member.role);
    setShowAddMemberModal(true);
  };

  const teamAvatars: Record<string, string> = {
    "John Doe": "from-[#23334d] to-[#1e2940]",
    "Sarah Chen": "from-[#c49a7f] to-[#f0d5c1]",
    "Marcus Bell": "from-[#1a2b39] to-[#334f67]",
  };

  const filteredTeamMembers = teamMembers.filter((member) => {
    const matchesSearch =
      teamSearch.trim() === "" ||
      member.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      member.email.toLowerCase().includes(teamSearch.toLowerCase());
    const matchesRole = roleFilter === "All" || member.role === roleFilter;
    const matchesStatus = statusFilter === "All" || member.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <>
      <div className="space-y-7">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <h1 className="text-[44px] font-extrabold leading-[1.02] tracking-[-0.045em] text-ink-900">
              Team Management
            </h1>
            <p className="mt-2 text-[18px] leading-[1.7] text-ink-500">
              Manage your company team members and roles
            </p>
          </div>
          <Button
            className="h-[48px] rounded-[14px] px-5 text-[15px] font-semibold shadow-[0_14px_32px_rgba(24,90,188,0.18)]"
            onClick={() => {
              const isEmail = teamSearch.includes("@");
              setName("");
              setEmail(isEmail ? teamSearch : "");
              setPhone("");
              setSelectedMemberRole("Member");
              setEditingMember(null);
              setShowAddMemberModal(true);
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>

        <Surface className="rounded-[18px] border border-[#e4ebf5] bg-[#f9fbff] p-4 shadow-[0_12px_30px_rgba(20,48,112,0.04)]">
          <div className="grid gap-4 md:grid-cols-[1.4fr_0.52fr_0.52fr]">
            <div className="flex h-[48px] items-center gap-3 rounded-[12px] border border-[#dfe6f2] bg-white px-4 text-[15px] text-ink-400">
              <Search className="h-4 w-4" />
              <input
                value={teamSearch}
                onChange={(event) => setTeamSearch(event.target.value)}
                placeholder="Search by name or email"
                className="h-full w-full bg-transparent text-ink-700 outline-none placeholder:text-ink-400"
              />
            </div>
            <label className="flex h-[48px] items-center rounded-[12px] border border-[#dfe6f2] bg-white px-4">
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value as "All" | "Admin" | "Member")}
                className="h-full w-full bg-transparent text-[15px] text-ink-700 outline-none"
              >
                <option value="All">Role: All</option>
                <option value="Admin">Role: Admin</option>
                <option value="Member">Role: Member</option>
              </select>
            </label>
            <label className="flex h-[48px] items-center rounded-[12px] border border-[#dfe6f2] bg-white px-4">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "All" | "Active" | "Pending Invite")}
                className="h-full w-full bg-transparent text-[15px] text-ink-700 outline-none"
              >
                <option value="All">Status: All</option>
                <option value="Active">Status: Active</option>
                <option value="Pending Invite">Status: Pending Invite</option>
              </select>
            </label>
          </div>
        </Surface>

        <Surface className="overflow-hidden rounded-[18px] border border-[#e4ebf5] bg-white shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-300">
                  {["Name", "Email", "Role", "Status", "Joined Date", "Actions"].map((header) => (
                    <th key={header} className="px-6 py-4">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTeamMembers.map((member) => (
                  <tr key={member.email} className="border-t border-[#edf1f7]">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${teamAvatars[member.name] ?? "from-[#21324b] to-[#6c5364]"} text-[12px] font-bold text-white`}>
                          {member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-[16px] font-semibold text-ink-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[15px] text-ink-500">{member.email}</td>
                    <td className="px-6 py-5">
                      <div className="relative inline-flex items-center">
                        <select
                          value={member.role}
                          onChange={(e) => {
                            const newRole = e.target.value as "Admin" | "Member";
                            updateTeamMember(member.email, { role: newRole });
                            toast.success(`${member.name}'s role updated to ${newRole}`);
                          }}
                          className="appearance-none rounded-full bg-[#f1f4f9] pl-4 pr-8 py-1.5 text-[13px] font-bold text-ink-600 outline-none cursor-pointer hover:bg-brand-50 hover:text-brand-700 transition-all border border-transparent focus:border-brand-200"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Member">Member</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-ink-400" />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge status={member.status} />
                    </td>
                    <td className="px-6 py-5 text-[15px] text-ink-500">{member.joinedDate}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-5 text-ink-500">
                        <button 
                          type="button" 
                          aria-label={`Edit ${member.name}`}
                          onClick={() => handleEditMember(member)}
                          className="hover:text-brand-600 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button 
                          type="button" 
                          aria-label={`Delete ${member.name}`}
                          onClick={() => handleDeleteMember(member.email)}
                          className="hover:text-danger-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[#edf1f7] px-6 py-5 text-sm text-ink-500">
            <span>Showing {filteredTeamMembers.length} of {teamMembers.length} team members</span>
            <div className="flex items-center gap-4">
              <button className="text-ink-400">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-semibold text-ink-900">1</span>
              <button className="text-ink-500">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Surface>
      </div>

      <Modal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        title={editingMember ? "Edit Team Member" : "Add New Member"}
        subtitle={editingMember ? "Update the details for this team member" : "Invite a team member to your company account"}
      >
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (!name || !email) {
              toast.error("Full name and email are required.");
              return;
            }

            if (editingMember) {
              updateTeamMember(editingMember.email, {
                name,
                email,
                phone,
                role: selectedMemberRole,
              });
              toast.success(`${name} has been updated!`);
            } else {
              addTeamMember({
                name: name,
                email: email,
                phone: phone,
                role: selectedMemberRole,
                status: "Pending Invite",
                joinedDate: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }),
              });
              toast.success(`${name} has been invited!`);
            }
            setShowAddMemberModal(false);
          }}
        >
          <div className="space-y-7 px-7 pb-7">
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="FULL NAME"
                id="team-member-name"
                name="name"
                autoComplete="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-[50px] rounded-[12px] border-[#e2e8f3] bg-[#f7f9fd] px-4 text-[15px]"
              />
              <Input
                label="EMAIL ADDRESS"
                id="team-member-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="john.doe@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[50px] rounded-[12px] border-[#e2e8f3] bg-[#f7f9fd] px-4 text-[15px]"
              />
              <Input
                label="PHONE NUMBER (OPTIONAL)"
                id="team-member-phone"
                name="tel"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-[50px] rounded-[12px] border-[#e2e8f3] bg-[#f7f9fd] px-4 text-[15px] md:col-span-2"
              />
            </div>

            <div>
              <div className="mb-4 text-[13px] font-bold uppercase tracking-[0.08em] text-ink-400">
                Select Member Role
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  className={`flex flex-col rounded-[20px] border p-6 text-left transition-all ${
                    selectedMemberRole === "Admin" 
                      ? "border-brand-300 bg-[#f4f8ff] ring-1 ring-brand-300" 
                      : "border-[#e5ebf5] bg-white hover:border-brand-200"
                  }`}
                  onClick={() => setSelectedMemberRole("Admin")}
                >
                  <div className="text-[18px] font-extrabold text-ink-900">Admin</div>
                  <div className="mt-2 text-[14px] leading-[1.6] text-ink-500">
                    Full access to all orders, documents, and team settings
                  </div>
                </button>
                <button
                  type="button"
                  className={`flex flex-col rounded-[20px] border p-6 text-left transition-all ${
                    selectedMemberRole === "Member" 
                      ? "border-brand-300 bg-[#f4f8ff] ring-1 ring-brand-300" 
                      : "border-[#e5ebf5] bg-white hover:border-brand-200"
                  }`}
                  onClick={() => setSelectedMemberRole("Member")}
                >
                  <div className="text-[18px] font-extrabold text-ink-900">Member</div>
                  <div className="mt-2 text-[14px] leading-[1.6] text-ink-500">
                    Access to view and manage assigned orders only
                  </div>
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-[16px] bg-[#eef4ff] px-4 py-4 text-[16px] font-semibold text-brand-600">
              <input defaultChecked type="checkbox" className="h-4 w-4" />
              Send invitation email to this user
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#edf1f7] bg-[#fbfcff] px-7 py-5">
            <Button
              variant="outline"
              className="h-[46px] rounded-[12px] border-[#dfe6f2] px-6 text-[15px] font-semibold text-ink-700"
              onClick={() => setShowAddMemberModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-[46px] rounded-[12px] px-6 text-[15px] font-semibold"
            >
              {editingMember ? "Save Changes" : "Add Member"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function CompanyTeamNewPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Surface className="w-full max-w-[760px] p-8">
        <div className="text-3xl font-extrabold tracking-[-0.04em] text-ink-900">Add New Member</div>
        <div className="mt-2 text-sm text-ink-500">Invite a team member to your company account</div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Input label="Full Name" placeholder="John Doe" className="bg-white" />
          <Input label="Phone Number (optional)" placeholder="+1 (555) 000-0000" className="bg-white" />
          <Input label="Email Address" placeholder="john.doe@company.com" className="bg-white md:col-span-2" />
        </div>
        <div className="mt-8">
          <div className="text-sm font-semibold text-ink-900">Role Selection</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <div className="font-extrabold text-ink-900">Admin</div>
              <div className="mt-2 text-sm text-ink-500">Full access to all company settings and orders</div>
            </div>
            <div className="rounded-2xl border border-ink-100 p-5">
              <div className="font-extrabold text-ink-900">Member</div>
              <div className="mt-2 text-sm text-ink-500">Limited access to assigned orders and documents</div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="text-sm font-semibold text-ink-900">Permissions</div>
          <div className="mt-4 grid gap-4 md:grid-cols-3 text-sm">
            <label className="flex items-center gap-2"><input defaultChecked type="checkbox" />Create Orders</label>
            <label className="flex items-center gap-2"><input defaultChecked type="checkbox" />View Orders</label>
            <label className="flex items-center gap-2"><input defaultChecked type="checkbox" />Download Documents</label>
          </div>
        </div>
        <label className="mt-6 flex items-center gap-2 text-sm font-semibold text-ink-700"><input defaultChecked type="checkbox" />Send invitation email to this user</label>
        <div className="mt-8 flex justify-end gap-3">
          <Link to="/company/team"><Button variant="ghost">Cancel</Button></Link>
          <Button>Add Member</Button>
        </div>
      </Surface>
    </div>
  );
}

export function CompanySettingsPage() {
  const { companyProfile, updateCompanyProfile } = useStore();
  const [isEditMode, setIsEditMode] = useState(false);

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

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notifications, setNotifications] = useState([
    { id: "email", label: "Email Notifications", body: "Receive global summary emails", active: companyProfile.notifications.email },
    { id: "orders", label: "Order Updates", body: "Real-time alerts for escrow changes", active: companyProfile.notifications.orders },
    { id: "documents", label: "Document Updates", body: "Alerts when new documents are signed", active: companyProfile.notifications.documents },
  ]);

  const resetForm = useCallback(() => {
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
    setNotifications([
      { id: "email", label: "Email Notifications", body: "Receive global summary emails", active: companyProfile.notifications.email },
      { id: "orders", label: "Order Updates", body: "Real-time alerts for escrow changes", active: companyProfile.notifications.orders },
      { id: "documents", label: "Document Updates", body: "Alerts when new documents are signed", active: companyProfile.notifications.documents },
    ]);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }, [companyProfile]);

  useEffect(() => {
    if (!isEditMode) {
      resetForm();
    }
  }, [isEditMode, resetForm]);

  const toggleNotification = (id: string) => {
    if (!isEditMode) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, active: !n.active } : n))
    );
  };

  const handleSaveSettings = () => {
    updateCompanyProfile({
      fullName: personalInfo.fullName,
      email: personalInfo.email,
      phone: personalInfo.phone,
      companyName: companyInfo.companyName,
      companyEmail: companyInfo.companyEmail,
      contactNumber: companyInfo.contactNumber,
      businessAddress: companyInfo.businessAddress,
      notifications: {
        email: notifications.find((n) => n.id === "email")?.active ?? true,
        orders: notifications.find((n) => n.id === "orders")?.active ?? true,
        documents: notifications.find((n) => n.id === "documents")?.active ?? false,
      },
    });
    toast.success("Company settings saved successfully!");
    setIsEditMode(false);
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-7">
      <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-6 shadow-[0_12px_30px_rgba(20,48,112,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="relative flex h-[76px] w-[76px] items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#17263e,#7a5361)] text-xl font-bold text-white shadow-[0_14px_30px_rgba(20,48,112,0.12)]">
              {personalInfo.fullName.split(" ").map(n => n[0]).join("")}
              <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] text-white">
                •
              </div>
            </div>
            <div>
              <div className="text-[34px] font-extrabold tracking-[-0.04em] text-ink-900">{personalInfo.fullName}</div>
              <div className="mt-2 text-[15px] text-ink-500">{personalInfo.email}</div>
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
            <div className="text-[24px] font-extrabold tracking-[-0.03em] text-ink-900">Personal Information</div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
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
            <div className="text-[24px] font-extrabold tracking-[-0.03em] text-ink-900">Company Information</div>
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
            <div className="text-[24px] font-extrabold tracking-[-0.03em] text-ink-900">Security Settings</div>
            <div className="mt-6 space-y-5">
              <Input 
                label="CURRENT PASSWORD" 
                placeholder="••••••••" 
                type="password" 
                disabled={!isEditMode}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="NEW PASSWORD" 
                placeholder="••••••••" 
                type="password" 
                disabled={!isEditMode}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`h-[48px] rounded-[12px] border-[#e2e8f3] px-4 text-[14px] ${!isEditMode ? "bg-[#f1f4f9] text-ink-400" : "bg-[#f7f9fd]"}`} 
              />
              <Input 
                label="CONFIRM NEW PASSWORD" 
                placeholder="••••••••" 
                type="password" 
                disabled={!isEditMode}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
          disabled={!isEditMode}
          className="h-[46px] rounded-[12px] px-8 text-[15px] font-semibold disabled:opacity-50" 
          onClick={handleSaveSettings}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400">{label}</div>
      <div className={`mt-2 text-[16px] font-semibold text-ink-900 ${valueClassName ?? ""}`}>{value}</div>
    </div>
  );
}
