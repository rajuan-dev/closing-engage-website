import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Eye, FileText, Search, SlidersHorizontal } from "lucide-react";
import { Badge, Select, Surface } from "@/components/common";
import { DocumentViewer } from "@/components/DocumentViewer";
import { useStore } from "@/store/useStore";
import { toast } from "@/store/useToastStore";
import { cn } from "@/lib/utils";

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
        <h1 className="text-[26px] font-bold tracking-tight text-ink-900">
          Documents
        </h1>
        <p className="mt-1 text-[13px] text-ink-500">
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
